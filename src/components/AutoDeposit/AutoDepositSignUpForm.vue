<template>
	<form
		class="ad-sign-up-form"
		@submit.prevent
		novalidate
	>
		<!-- Amount and Day Input -->
		<div class="row column align-middle tw-text-h3">
			<span>
				Deposit
			</span>
			<label
				class="tw-sr-only"
				:class="{ 'error': v$.adAmount?.$invalid }"
				for="amount"
			>
				Amount
			</label>
			<kv-currency-input class="tw-w-16" id="amount" v-model="adAmount" />
			<span>
				each month on the
			</span>
			<label class="tw-sr-only" :class="{ 'error': v$.dayOfMonth?.$invalid }" :for="dayOfMonth">
				Day of the Month
			</label>
			<kv-text-input
				v-if="isDayInputShown"
				@blur="hideDayInput()"
				class="text-input"
				id="dayOfMonth"
				type="number"
				placeholder=""
				required
				min="1"
				max="31"
				v-model.number="dayOfMonth"
			/>
			<button
				class="tw-text-action hover:tw-text-action-highlight"
				@click="isDayInputShown = true"
				v-if="!isDayInputShown"
			>
				<strong>{{ $filters.numeral(dayOfMonth, 'Oo') }}</strong>
				<kv-material-icon
					class="tw-w-2.5 tw-h-2.5"
					:icon="mdiPencil"
				/>
			</button>
		</div>

		<!-- Errors and Messaging -->
		<div class="row column tw-text-center">
			<ul class="validation-errors" v-if="v$.dayOfMonth?.$invalid">
				<li v-if="v$.dayOfMonth?.required?.$invalid">
					Day field is required
				</li>
				<li v-if="v$.dayOfMonth?.minValue?.$invalid || v$.dayOfMonth?.maxValue?.$invalid">
					Enter day of month - 1 to 31
				</li>
			</ul>
			<ul class="validation-errors" v-if="v$.adAmount?.$invalid">
				<li v-if="v$.adAmount?.required?.$invalid">
					Amount field is required
				</li>
				<li v-if="v$.adAmount?.minValue?.$invalid || v$.adAmount?.maxValue?.$invalid">
					Enter an amount of $0-$10,000
				</li>
			</ul>
		</div>

		<!-- Donation -->
		<div class="row collapse align-middle">
			<div class="columns shrink tw-text-h3">
				<kv-checkbox
					id="donation-checkbox"
					class="tw--mt-1"
					v-model="donationCheckbox"
				>
					<span>
						Add an optional
					</span>

					<label
						class="tw-sr-only"
						:class="{ 'error': v$.donation?.$invalid }"
						for="donation"
					>
						Donation
					</label>
					<kv-select
						id="donation"
						class="donation-dropdown"
						v-model="donationOptionSelected"
						v-if="donationOptionSelected !== 'other'"
					>
						<option
							v-for="(option, index) in dropdownOptions"
							:value="option.value"
							:key="index"
						>
							{{ option.label }}
						</option>
					</kv-select>
					<kv-currency-input
						class="tw-w-16"
						id="donation"
						v-model="donation"
						v-if="donationOptionSelected === 'other'"
					/>
					<span>
						donation to support Kiva’s costs
					</span>
				</kv-checkbox>
			</div>
		</div>

		<div class="row column tw-text-center">
			<!-- Donation Errors -->
			<ul class="validation-errors" v-if="v$.donation?.$invalid">
				<li v-if="v$.donation?.minValue?.$invalid || v$.donation?.maxValue?.$invalid">
					Enter a donation amount of $0-$10,000
				</li>
			</ul>

			<!-- General Errors & Messaging-->
			<ul
				class="validation-errors"
				v-if="v$.adAmount?.combinedTotal?.$invalid || v$.donation?.combinedTotal?.$invalid"
			>
				<li>
					To set up an Auto Deposit, please enter a total amount between $0 and $10,000.
				</li>
			</ul>
			<small v-if="dayOfMonth > 28">
				(note - deposit may be processed on the last day of the month)</small>
		</div>

		<!-- Payment Wrapper-->
		<div class="row column">
			<div class="tw-text-center tw-relative" v-if="isLoggedIn">
				<div class="payment-dropin-invalid-cover" v-if="v$.$invalid"></div>
				<auto-deposit-drop-in-payment-wrapper
					:amount="totalCombinedDeposit"
					:donate-amount="donation"
					:day-of-month="dayOfMonth"
					@complete-transaction="completeADBraintree"
				/>
			</div>
			<kv-button
				v-else
				class="tw-mt-4"
				:href="`/ui-login?force=true&doneUrl=${$route.path}`"
			>
				Sign in to set up
			</kv-button>
		</div>
		<kv-loading-overlay
			v-if="showLoadingOverlay"
		/>
	</form>
</template>

<script>
import numeral from 'numeral';
import _get from 'lodash/get';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue } from '@vuelidate/validators';

import AutoDepositDropInPaymentWrapper from '#src/components/AutoDeposit/AutoDepositDropInPaymentWrapper';
import KvCurrencyInput from '#src/components/Kv/KvCurrencyInput';
import KvLoadingOverlay from '#src/components/Kv/KvLoadingOverlay';

import userIdQuery from '#src/graphql/query/userId.graphql';
import { mdiPencil } from '@mdi/js';
import {
	KvButton, KvCheckbox, KvMaterialIcon, KvSelect, KvTextInput
} from '@kiva/kv-components';

let frozenDropdownOptions;

export default {
	name: 'AutoDepositSignUpForm',
	components: {
		AutoDepositDropInPaymentWrapper,
		KvButton,
		KvCheckbox,
		KvCurrencyInput,
		KvSelect,
		KvTextInput,
		KvMaterialIcon,
		KvLoadingOverlay,
	},
	data() {
		return {
			adAmount: 25,
			isDayInputShown: false,
			dayOfMonth: new Date().getDate(),
			donation: 25 * 0.15,
			donationCheckbox: true,
			donationOptionSelected: '15',
			isDonationOptionsDirty: false,
			isLoggedIn: false,
			mdiPencil,
			showLoadingOverlay: false,
		};
	},
	setup() { return { v$: useVuelidate() }; },
	validations() {
		return {
			adAmount: {
				required,
				minValue: minValue(0),
				maxValue: maxValue(10000),
				combinedTotal(value) {
					const total = numeral(value).value() + numeral(this.donation).value();
					return total < 10000 && total > 0;
				}
			},
			donation: {
				minValue: minValue(0),
				maxValue: maxValue(10000),
				combinedTotal(value) {
					const total = numeral(value).value() + numeral(this.adAmount).value();
					return total < 10000 && total > 0;
				}
			},
			dayOfMonth: {
				required,
				minValue: minValue(1),
				maxValue: maxValue(31)
			},
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: userIdQuery,
		preFetch: true,
		result({ data }) {
			this.isLoggedIn = _get(data, 'my.userAccount.id') !== undefined || false;
		},
	},
	watch: {
		donation(newVal) {
			if (newVal !== 0) {
				this.donationCheckbox = true;
			}
			if (newVal === 0) {
				this.donationOptionSelected = '0';
			}
		},
		donationCheckbox(newVal) {
			if (!newVal) {
				// when box is unchecked, change donation amount to zero.
				this.donationOptionSelected = '0';
			}
		},
		donationOptionSelected(newVal) {
			// flag donation options as dirty, which stops the recalculation of the drop down values.
			this.isDonationOptionsDirty = true;
			if (newVal !== 'other') {
				// handle pre-computed donation options based update
				if (!this.isDonationOptionsDirty) {
					// get selected amount in donation
					const selectedDonationAmount = this.calculatedDonationOptions.find(
						donationSelect => donationSelect.value === newVal
					);
					this.donation = selectedDonationAmount.monetaryValue;
				} else if (this.isDonationOptionsDirty) {
					// handle user selected donation options based update
					this.$nextTick(() => {
						const selectedFrozenOption = frozenDropdownOptions.find(
							donationSelect => donationSelect.value === newVal
						);
						if (selectedFrozenOption) {
							this.donation = selectedFrozenOption.monetaryValue;
						}
					});
				}

				// sync the checkbox with the dropdown.
				if (newVal !== '0') {
					this.donationCheckbox = true;
				} else {
					this.donationCheckbox = false;
				}
			}
		},
		// monitor adAmount for changes
		adAmount() {
			// handle pre-computed donation options based update
			if (this.donationOptionSelected !== 'other' && !this.isDonationOptionsDirty) {
				// get selected amount in donation
				const selectedDonationAmount = this.calculatedDonationOptions.find(
					donationSelect => donationSelect.value === this.donationOptionSelected
				);
				this.donation = selectedDonationAmount.monetaryValue;
			} else if (this.donationOptionSelected !== 'other' && this.isDonationOptionsDirty) {
				// handle user selected donation options based update
				const selectedFrozenOption = frozenDropdownOptions.find(
					donationSelect => donationSelect.value === this.donationOptionSelected
				);
				if (selectedFrozenOption) {
					this.donation = selectedFrozenOption.monetaryValue;
				}
			}
		},
	},
	methods: {
		hideDayInput() {
			if (!this.v$.dayOfMonth?.$invalid) {
				this.isDayInputShown = false;
			}
		},
		completeADBraintree() {
			this.showLoadingOverlay = true;
			this.$kvTrackEvent('Registration', 'successful-auto-deposit-reg', 'register-auto-deposit');
			// Send to thanks page
			this.$router.push({
				path: `${this.$route.path}/thanks`,
			}).finally(() => {
				this.showLoadingOverlay = false;
			});
		},
	},
	computed: {
		totalCombinedDeposit() {
			return numeral(this.donation).value() + numeral(this.adAmount).value();
		},
		dropdownOptions() {
			if (this.isDonationOptionsDirty) {
				if (!frozenDropdownOptions) {
					// make a copy of calculatedDonationOptions to freeze the values
					frozenDropdownOptions = this.calculatedDonationOptions.map(selectItem => ({ ...selectItem }));
				}
				return frozenDropdownOptions;
			}
			return this.calculatedDonationOptions;
		},
		calculatedDonationOptions() {
			// If adAmount isn't valid, just set these values to default
			const amountToBasePercentageOn = this.v$.adAmount?.$invalid ? 25 : this.adAmount;
			return [
				{
					value: '20',
					label: `${numeral(amountToBasePercentageOn * 0.20).format('$0,0.00')}`,
					monetaryValue: Math.round(amountToBasePercentageOn * 0.20 * 100) / 100
				},
				{
					value: '15',
					label: `${numeral(amountToBasePercentageOn * 0.15).format('$0,0.00')}`,
					monetaryValue: Math.round(amountToBasePercentageOn * 0.15 * 100) / 100

				},
				{
					value: '8',
					label: `${numeral(amountToBasePercentageOn * 0.08).format('$0,0.00')}`,
					monetaryValue: Math.round(amountToBasePercentageOn * 0.08 * 100) / 100
				},
				{
					value: '0',
					label: '$0.00',
					monetaryValue: 0

				},
				{
					value: 'other',
					label: 'Other'
				}
			];
		},
	},
};

</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.ad-sign-up-form {
	margin-top: 1rem;

	.row {
		margin-bottom: 1rem;
	}

	ul.validation-errors {
		margin-bottom: 0;
	}

	:deep(.dropdown-wrapper.donation-dropdown) .dropdown {
		width: rem-calc(130);
		margin-bottom: 0;
	}
}

.payment-dropin-wrapper {
	position: relative;
	text-align: center;
	margin-top: 3rem;
}

.payment-dropin-invalid-cover {
	position: absolute;
	inset: 0;
	background: rgb(255 255 255 / 80%);
	z-index: 10000;
}

// Set z-index for loading overlay so that it is over drop in UI
.loading-overlay {
	z-index: 500;
}
</style>
