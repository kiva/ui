<template>
	<div
		v-if="showToggle"
		class="tw-flex tw-mt-1"
		data-testid="tip-from-balance-toggle"
	>
		<kv-switch
			class="tw-flex"
			data-testid="tip-from-balance-switch"
			:model-value="toggleValue"
			:disabled="updating"
			@update:model-value="setPreference"
		>
			<span class="tw-font-medium tw-text-gray-600">
				Use my balance to cover this tip instead of future loans.
			</span>
		</kv-switch>
	</div>
</template>

<script>
import logFormatter from '#src/util/logFormatter';
import updateKivaCreditDonationPreference from '#src/graphql/mutation/updateKivaCreditDonationPreference.graphql';
import { KvSwitch } from '@kiva/kv-components';

export const TIP_FROM_BALANCE_EXP_KEY = 'checkout_tip_from_balance_toggle';

// Marks a basket whose preference is already decided, so we never default it off twice.
// Needed because the stored preference cannot tell "never chose" apart from "chose yes".
export const TIP_FROM_BALANCE_SEEDED_COOKIE = 'kvtipseeded';

/**
 * Whether the lender can use the switch at all. The checkout page reads this too, so the
 * variant treatment only appears where the switch itself can.
 *
 * @param {Object} state The basket state provided by the checkout page
 * @returns {boolean} Whether the lender is in the experiment audience
 */
export function meetsTipFromBalanceCriteria(state = {}) {
	return !!state.myId
		&& state.balance > 0
		&& state.hasLoans
		&& state.tipAmount > 0;
}

export default {
	name: 'KivaCreditTipToggle',
	components: {
		KvSwitch,
	},
	inject: {
		apollo: { from: 'apollo' },
		cookieStore: { from: 'cookieStore' },
		// Provided by the checkout page; the defaults keep this component inert anywhere else
		tipFromBalanceVersion: { default: null },
		tipToggleBasketState: { default: null },
	},
	emits: ['refreshtotals', 'updating-totals'],
	data() {
		return {
			choiceProtected: false,
			toggleValue: false,
			updating: false,
			seeding: false,
		};
	},
	mounted() {
		this.maybeSeedPreference();
	},
	watch: {
		basketId: { handler: 'readBasketChoice', immediate: true },
		isEligible: 'maybeSeedPreference',
		applyKivaCreditToDonation: {
			handler(preference) {
				// Not mid-change, or the switch would snap back under the lender
				if (!this.updating) {
					this.toggleValue = preference === true;
				}
				this.maybeSeedPreference();
			},
			immediate: true,
		},
	},
	computed: {
		basketState() {
			return this.tipToggleBasketState ?? {};
		},
		basketId() {
			return this.basketState.basketId ?? null;
		},
		applyKivaCreditToDonation() {
			const preference = this.basketState.applyKivaCreditToDonation;
			return typeof preference === 'boolean' ? preference : null;
		},
		isEligible() {
			return this.tipFromBalanceVersion === 'b' && meetsTipFromBalanceCriteria(this.basketState);
		},
		needsSeeding() {
			return this.applyKivaCreditToDonation === true && !this.choiceProtected;
		},
		showToggle() {
			// Hidden until the default is stored, so the switch always matches the basket
			return this.isEligible
				&& this.applyKivaCreditToDonation !== null
				&& !this.needsSeeding;
		},
	},
	methods: {
		maybeSeedPreference() {
			// Client only, since seeding mutates the basket
			if (typeof window === 'undefined') return;
			if (!this.isEligible || this.applyKivaCreditToDonation === null) return;
			if (this.needsSeeding && !this.seeding) {
				this.seedPreferenceOff();
			}
		},
		/**
		 * Persists the preference and refreshes the basket. Resolves once the choice is
		 * marked; callers handle their own in-flight flag and failure behavior.
		 *
		 * @param {boolean} applyKivaCreditToDonation
		 * @returns {Promise}
		 */
		persistPreference(applyKivaCreditToDonation) {
			this.$emit('updating-totals', true);
			return this.apollo.mutate({
				mutation: updateKivaCreditDonationPreference,
				variables: { applyKivaCreditToDonation },
			}).then(({ errors }) => {
				if (errors?.length) throw errors[0];
				this.markChoiceProtected();
			});
		},
		seedPreferenceOff() {
			this.seeding = true;
			this.persistPreference(false).then(() => {
				this.$emit('refreshtotals');
			}).catch(error => {
				logFormatter(error, 'error');
				this.$emit('updating-totals', false);
			}).finally(() => {
				this.seeding = false;
			});
		},
		setPreference(value) {
			if (this.updating || value === this.applyKivaCreditToDonation) return;
			this.updating = true;
			this.toggleValue = value;
			this.persistPreference(value).then(() => {
				this.$kvTrackEvent(
					'basket',
					'click',
					value ? 'tip-from-balance-toggle-on' : 'tip-from-balance-toggle-off',
				);
			}).catch(error => {
				logFormatter(error, 'error');
				this.toggleValue = this.applyKivaCreditToDonation === true;
				this.$showTipMsg('There was a problem updating your basket. Please try again.', 'error');
			}).finally(() => {
				// Refresh on failure too, so a stale basket recovers before the retry
				this.$emit('refreshtotals');
				this.updating = false;
			});
		},
		readBasketChoice() {
			// Copied into state because a cookie write does not trigger a re-render
			this.choiceProtected = !!this.basketId
				&& this.cookieStore.get(TIP_FROM_BALANCE_SEEDED_COOKIE) === String(this.basketId);
		},
		markChoiceProtected() {
			this.cookieStore.set(TIP_FROM_BALANCE_SEEDED_COOKIE, String(this.basketId), { path: '/' });
			this.choiceProtected = true;
		},
	},
};
</script>

<style lang="postcss" scoped>
/* KvSwitch hardcodes a 16px gap on its label and takes no prop for it; the mocks call for 8px */
:deep(label) {
	@apply tw-gap-1;
}
</style>
