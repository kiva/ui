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
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import numeral from 'numeral';
import logFormatter from '#src/util/logFormatter';
import initializeCheckout from '#src/graphql/query/checkout/initializeCheckout.graphql';
import updateKivaCreditDonationPreference from '#src/graphql/mutation/updateKivaCreditDonationPreference.graphql';
import { KvSwitch } from '@kiva/kv-components';

export const TIP_FROM_BALANCE_EXP_KEY = 'checkout_tip_from_balance_toggle';

// Marks the basket whose donation preference was already defaulted to off for treatment.
// Manifest.applyKivaCreditToDonation can't distinguish "never chose" from "chose yes", so a
// basket carrying this marker is never re-seeded, protecting an explicit lender choice.
export const TIP_FROM_BALANCE_SEEDED_COOKIE = 'kvtipseeded';

export default {
	name: 'KivaCreditTipToggle',
	components: {
		KvSwitch,
	},
	inject: {
		apollo: { from: 'apollo' },
		cookieStore: { from: 'cookieStore' },
		// Assigned version provided by the checkout page; null when rendered elsewhere
		tipFromBalanceVersion: { default: null },
	},
	emits: ['refreshtotals', 'updating-totals'],
	data() {
		return {
			myId: null,
			balance: 0,
			hasLoans: false,
			tipAmount: 0,
			basketId: null,
			applyKivaCreditToDonation: null,
			choiceProtected: false,
			toggleValue: false,
			updating: false,
			seeding: false,
		};
	},
	created() {
		// Watch for and react to changes to the basket state
		this.apollo.watchQuery({ query: initializeCheckout }).subscribe({
			next: ({ data }) => {
				this.myId = _get(data, 'my.userAccount.id') ?? null;
				this.balance = numeral(_get(data, 'my.userAccount.balance')).value() ?? 0;
				const items = _get(data, 'shop.basket.items.values') ?? [];
				this.hasLoans = _filter(items, { __typename: 'LoanReservation' }).length > 0;
				const tip = _filter(items, { __typename: 'Donation' }).find(item => !item.metadata?.campaignId);
				this.tipAmount = numeral(tip?.price).value() ?? 0;
				this.basketId = _get(data, 'shop.basket.id') ?? null;
				const preference = _get(data, 'shop.basket.applyKivaCreditToDonation');
				this.applyKivaCreditToDonation = typeof preference === 'boolean' ? preference : null;
				this.choiceProtected = !!this.basketId
					&& this.cookieStore.get(TIP_FROM_BALANCE_SEEDED_COOKIE) === String(this.basketId);
				if (!this.updating) {
					this.toggleValue = this.applyKivaCreditToDonation === true;
				}
			},
		});
	},
	mounted() {
		this.maybeSeedPreference();
	},
	watch: {
		isEligible: 'maybeSeedPreference',
		applyKivaCreditToDonation: 'maybeSeedPreference',
	},
	computed: {
		isEligible() {
			return this.tipFromBalanceVersion === 'b'
				&& !!this.myId
				&& this.balance > 0
				&& this.hasLoans
				&& this.tipAmount > 0;
		},
		needsSeeding() {
			return this.applyKivaCreditToDonation === true && !this.choiceProtected;
		},
		showToggle() {
			// Hidden until the manifest default-off seeding has settled, so the rendered
			// toggle and the manifest always agree
			return this.isEligible
				&& this.applyKivaCreditToDonation !== null
				&& !this.needsSeeding;
		},
	},
	methods: {
		maybeSeedPreference() {
			// Client-only: seeding mutates the basket
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
				// Refreshing on failure too, so a stale basket recovers before the user retries
				this.$emit('refreshtotals');
				this.updating = false;
			});
		},
		markChoiceProtected() {
			this.cookieStore.set(TIP_FROM_BALANCE_SEEDED_COOKIE, String(this.basketId), { path: '/' });
			this.choiceProtected = true;
		},
	},
};
</script>
