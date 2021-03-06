<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="row">
			<div class="small-12 columns input-wrapper recurring-amounts">
				<fieldset v-if="!oneTimeOnly && expRecurringOnly !== 'shown'">
					<legend class="visually-hidden">
						Choose how often to contribute
					</legend>
					<kv-pill-toggle
						:id="`${id}-deposit-type`"
						class="deposit-options-toggle"
						:options="depositOptions"
						:selected="depositSelected"
						@pill-toggled="depositTypeChanged"
					/>
				</fieldset>
				<fieldset>
					<legend v-if="oneTimeOnly" class="recurring-only-legend">
						Choose a one-time amount to contribute
					</legend>
					<legend v-else-if="expRecurringOnly === 'shown'" class="recurring-only-legend">
						Contribute monthly:
					</legend>
					<legend v-else class="visually-hidden">
						Choose an amount to contribute
					</legend>
					<multi-amount-selector
						v-show="isRecurring"
						:id="`${id}-amount-selector`"
						class="recurring-amount-selector"
						ref="recurringAmountSelectorRef"
						:options="recurringAmountOptions"
						:selected="recurringAmountSelection"
						:custom-amount="recurringCustomAmount"
						:min-custom-amount="minRecurringAmount"
						@pill-toggled="recurringAmountSelected"
						@custom-amount-updated="recurringCustomAmountUpdated"
						:split-pills="true"
					/>
					<multi-amount-selector
						v-show="!isRecurring"
						:id="`${id}-onetime-amount-selector`"
						class="onetime-amount-selector"
						ref="onetimeAmountSelectorRef"
						:options="onetimeAmountOptions"
						:selected="onetimeAmountSelection"
						:custom-amount="onetimeCustomAmount"
						:min-custom-amount="minOnetimeAmount"
						@pill-toggled="onetimeAmountSelected"
						@custom-amount-updated="onetimeCustomAmountUpdated"
						:split-pills="true"
					/>
				</fieldset>
				<kv-button class="smaller submit-btn" type="submit" :disabled="$v.$invalid">
					{{ buttonText }}
				</kv-button>
			</div>
		</div>
	</form>
</template>

<script>
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { minValue, maxValue } from 'vuelidate/lib/validators';

import gql from 'graphql-tag';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';

import KvPillToggle from '@/components/Kv/KvPillToggle';
import MultiAmountSelector from '@/components/Forms/MultiAmountSelector';
import KvButton from '@/components/Kv/KvButton';

const pageQuery = gql`query covidLandingPage {
	general {
		covDefaultAmountExp: uiExperimentSetting(key: "covid19response_default_amount") {
			key
			value
		}
		mgRecurringOnlyExp: uiExperimentSetting(key: "mg_recurring_only") {
			key
			value
		}
	}
}`;

export default {
	components: {
		KvButton,
		KvPillToggle,
		MultiAmountSelector,
	},
	mixins: [
		validationMixin
	],
	validations() {
		if (this.isRecurring) {
			return {
				selectedAmount: {
					minValue: minValue(this.minRecurringAmount),
					maxValue: maxValue(this.maxDepositAmount)
				}
			};
		}
		return {
			selectedAmount: {
				minValue: minValue(this.minOnetimeAmount),
				maxValue: maxValue(this.maxDepositAmount)
			}
		};
	},
	props: {
		buttonText: {
			type: String,
			default: 'Contribute monthly'
		},
		oneTimeOnly: { // force a one-time donation regardless of experiment
			type: Boolean,
			default: false
		},
		id: { // used when you have multiple instances of this form on one page.
			type: String,
			default: 'instance1',
		}
	},
	data() {
		return {
			isRecurring: true,
			depositOptions: [
				{
					title: 'Contribute monthly',
					key: 'recurring',
				},
				{
					title: 'One-time contribution',
					key: 'onetime',
				},
			],
			depositSelected: 'recurring',
			// Recurring Deposit Config
			recurringAmountOptions: [
				{
					title: '$10',
					key: '10',
				},
				{
					title: '$25',
					key: '25',
				},
				{
					title: '$75',
					key: '75',
				},
				{
					title: '$100',
					key: '100',
				},
				{
					title: 'Other',
					key: 'custom'
				}
			],
			recurringAmountSelection: '75',
			recurringCustomAmount: 75,
			recurringAmount: 75,
			minRecurringAmount: 5,
			// Onetime Deposit Config
			onetimeAmountOptions: [
				{
					title: '$25',
					key: '25',
				},
				{
					title: '$50',
					key: '50',
				},
				{
					title: '$100',
					key: '100',
				},
				{
					title: '$250',
					key: '250',
				},
				{
					title: 'Other',
					key: 'custom'
				}
			],
			onetimeAmountSelection: '50',
			onetimeCustomAmount: 50,
			onetimeAmount: 50,
			minOnetimeAmount: 25,
			maxDepositAmount: 10000,
			expDefaultAmount: null,
			expRecurringOnly: null,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			}).then(() => {
				return Promise.all([
					client.query({ query: experimentQuery, variables: { id: 'covid19response_default_amount' } }),
					client.query({ query: experimentQuery, variables: { id: 'mg_recurring_only' } })
				]);
			});
		},
		result() {
			const covid19responseDefaultAmount = this.apollo.readFragment({
				id: 'Experiment:covid19response_default_amount',
				fragment: experimentVersionFragment,
			}) || {};
			this.expDefaultAmount = covid19responseDefaultAmount.version;
			if (this.expDefaultAmount === 'shown') {
				this.recurringAmountSelection = '25';
				this.recurringCustomAmount = 25;
				this.recurringAmount = 25;
			}

			const mgRecurringOnlyExp = this.apollo.readFragment({
				id: 'Experiment:mg_recurring_only',
				fragment: experimentVersionFragment,
			}) || {};
			this.expRecurringOnly = mgRecurringOnlyExp.version;
			if (this.expRecurringOnly === 'shown') {
				this.isRecurring = true;
			}
		},
	},
	mounted() {
		if (this.expDefaultAmount && this.expDefaultAmount !== 'unassigned') {
			// Fire Event for GROW-96
			this.$kvTrackEvent(
				'Monthly Good',
				'EXP-GROW-96-May2020',
				this.expDefaultAmount === 'shown' ? 'b' : 'a'
			);
		}

		if (this.expRecurringOnly && this.expRecurringOnly !== 'unassigned') {
			this.$kvTrackEvent(
				'MonthlyGood',
				'EXP-GROW-104-May2020',
				this.expRecurringOnly === 'shown' ? 'b' : 'a'
			);
		}

		if (this.oneTimeOnly) {
			this.isRecurring = false;
		}
	},
	computed: {
		selectedAmount() {
			if (this.isRecurring) {
				return this.recurringAmount;
			}
			return this.onetimeAmount;
		}
	},
	watch: {
		isRecurring(newVal) {
			if (newVal && this.recurringAmountSelection === 'custom') {
				this.$nextTick(() => {
					try {
						this.$refs.recurringAmountSelectorRef.$refs.kvCurrencyRef[0].$refs.kvCurrencyInputRef.focus();
					} catch (e) {
						// noop
					}
				});
			}
			if (!newVal && this.onetimeAmountSelection === 'custom') {
				this.$nextTick(() => {
					try {
						this.$refs.onetimeAmountSelectorRef.$refs.kvCurrencyRef[0].$refs.kvCurrencyInputRef.focus();
					} catch (e) {
						// noop
					}
				});
			}
		}
	},
	methods: {
		depositTypeChanged(value) {
			this.depositSelected = value;
			this.isRecurring = value === 'recurring';
		},
		recurringAmountSelected(value) {
			if (value === 'custom') {
				this.updateAmount(numeral(this.recurringCustomAmount).value());
				this.recurringAmountSelection = 'custom';
			} else {
				this.updateAmount(numeral(value).value());
				this.recurringAmountSelection = value;
			}
		},
		recurringCustomAmountUpdated(value) {
			this.recurringCustomAmount = numeral(value).value();
			this.updateAmount(Number(value));
		},

		onetimeAmountSelected(value) {
			if (value === 'custom') {
				this.updateAmount(numeral(this.onetimeCustomAmount).value(), 'onetime');
				this.onetimeAmountSelection = 'custom';
			} else {
				this.updateAmount(numeral(value).value(), 'onetime');
				this.onetimeAmountSelection = value;
			}
		},
		onetimeCustomAmountUpdated(value) {
			this.onetimeCustomAmount = numeral(value).value();
			this.updateAmount(value, 'onetime');
		},

		updateAmount(value, type) {
			// updates local var from various changes in the form
			// update for onetime
			if (type === 'onetime') {
				this.onetimeAmount = numeral(value).value();
			} else {
				// else it's recurring
				this.recurringAmount = numeral(value).value();
			}
		},
		submit() {
			this.$router.push({
				path: '/monthlygood/setup',
				query: {
					amount: this.selectedAmount,
					category: 'disaster_relief_covid',
					onetime: !this.isRecurring,
					source: 'covid19response'
				}
			});
		}
	},
};

</script>
<style lang="scss" scoped>
@import 'settings';

.recurring-amount-selector,
.onetime-amount-selector {
	margin-bottom: 1rem;
	position: relative;
}

.recurring-only-legend {
	font-size: 1rem;
	font-weight: 700;
}

.submit-btn {
	width: 100%;
	margin: 0.5rem 0;
}

// Monthly or Onetime Toggle
::v-deep .deposit-options-toggle {
	margin-bottom: 2rem;

	.pill {
		flex-grow: 1;
	}
}

::v-deep label,
::v-deep input {
	font-weight: 700;
}

::v-deep .validation-errors {
	position: absolute;
	bottom: -1rem;
	right: 0;
	margin-bottom: 0;
}

.visually-hidden {
	@include visually-hidden();
}
</style>
