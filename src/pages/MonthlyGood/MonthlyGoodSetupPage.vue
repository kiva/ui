<template>
	<www-page>
		<div class="row align-center monthly-good-setup-page">
			<div class="small-12 medium-11 large-10 column" v-if="!isMonthlyGoodSubscriber">
				<h1 class="text-center impact-text">
					Confirm your Good
				</h1>
				<h3 class="text-center featured-text">
					Review and set up your monthly contribution
				</h3>
				<form
					class="monthly-good-form"
					@submit.prevent="hasBillingAgreement ? submitMonthlyGood : null"
					novalidate
				>
					<div class="panel zigzag-bottom">
						<div class="row align-center text-center">
							<div class="medium-10 small-12 columns">
								<div class="row column">
									<strong>Each month on the</strong>
									<label class="show-for-sr" :class="{ 'error': $v.$invalid }" :for="dayOfMonth">
										Day of the Month
									</label>
									<input v-if="isDayInputShown"
										@blur="hideDayInput()"
										class="text-input__day"
										id="dayOfMonth"
										type="number"
										placeholder=""
										required
										min="1"
										max="31"
										v-model="dayOfMonth"
									>
									<button
										class="button--ordinal-day"
										@click="isDayInputShown = true"
										v-if="!isDayInputShown"
									>
										<strong>{{ dayOfMonth | numeral('Oo') }}</strong>
										<icon-pencil class="icon-pencil" />
									</button>
									<ul class="validation-errors" v-if="$v.dayOfMonth.$invalid">
										<li v-if="!$v.dayOfMonth.required">
											Field is required
										</li>
										<li v-if="!$v.dayOfMonth.minValue || !$v.dayOfMonth.maxValue">
											Enter day of month - 1 to 31
										</li>
									</ul>
									<div class="additional-day-info">
										<strong>we'll process the following:</strong>
										<small v-if="dayOfMonth > 28">
											(note - may be processed on the last day of the month)</small>
									</div>
								</div>

								<div class="row text-left align-middle">
									<div class="columns">
										<span class="additional-left-pad-spans">
											Deposit for lending
										</span>
									</div>

									<div class="medium-5 small-6 columns">
										<label
											class="show-for-sr"
											:class="{ 'error': $v.mgAmount.$invalid }"
											for="amount"
										>
											Amount
										</label>
										<kv-currency-input class="text-input" id="amount" v-model="mgAmount" />
									</div>

									<div class="small-12 columns">
										<ul class="text-right validation-errors" v-if="$v.mgAmount.$invalid">
											<li v-if="!$v.mgAmount.required">
												Field is required
											</li>
											<li v-if="!$v.mgAmount.minValue || !$v.mgAmount.maxValue">
												Enter an amount of $5-$10,000
											</li>
										</ul>
									</div>
								</div>

								<div class="row text-left align-middle">
									<div class="columns">
										<kv-checkbox
											id="donation-checkbox"
											v-model="donationCheckbox"
											@change="donationCheckboxChange()"
										/>
										<span
											class="additional-left-pad-spans display-inline-block"
										>Optional donation to support Kiva</span>
									</div>

									<div class="medium-5 small-6 columns">
										<label
											class="show-for-sr"
											:class="{ 'error': $v.donation.$invalid }"
											for="donation"
										>
											Donation
										</label>
										<kv-dropdown-rounded
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
										</kv-dropdown-rounded>
										<kv-currency-input
											class="text-input"
											id="donation"
											v-model="donation"
											v-if="donationOptionSelected === 'other'"
										/>
									</div>

									<div class="small-12 columns">
										<ul class="text-right validation-errors" v-if="$v.donation.$invalid">
											<li v-if="!$v.donation.minValue || !$v.donation.maxValue">
												Enter an amount of $0-$10,000
											</li>
										</ul>
									</div>
								</div>

								<div class="row text-left">
									<div class="columns">
										<strong class="additional-left-pad-spans">Total/month</strong>
									</div>

									<div class="medium-5 small-6 columns">
										<strong
											class="additional-left-pad-currency"
										>{{ totalCombinedDeposit | numeral('$0,0.00') }}</strong>
									</div>

									<div class="small-12 columns">
										<ul class="text-center validation-errors"
											v-if="!$v.mgAmount.maxTotal || !$v.donation.maxTotal"
										>
											<li>
												The maximum Monthly Good total is $10,000.<br>
												Please try again by entering in a smaller amount.
											</li>
										</ul>
									</div>
								</div>

								<div class="row text-left">
									<div class="small-12 columns">
										<div class="additional-left-pad-spans">
											Select a category to focus your lending
											<kv-dropdown-rounded v-model="selectedGroup" class="group-dropdown">
												<option
													v-for="(option, index) in lendingCategories"
													:value="option.value"
													:key="index"
												>
													{{ option.label }}
												</option>
											</kv-dropdown-rounded>
										</div>
									</div>
								</div>

								<div class="row small-collapse">
									<div class="small-12 columns">
										<em class="text-center">Rest easy, you can cancel anytime.</em>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row align-center text-center">
						<div class="large-9 medium-10 small-12 columns">
							<p>
								<!-- eslint-disable-next-line max-len -->
								<strong><em>We'll charge your PayPal account each month, and any credit in your Kiva account will be automatically re-lent for you.</em></strong>
							</p>
							<p v-if="hasAutoDeposits">
								<em>* Your new Monthly Good contribution will replace your existing auto deposit.</em>
							</p>
							<p v-if="hasAutoLending">
								<!-- eslint-disable-next-line max-len -->
								<em>* Enrolling in Monthly Good will also disable your current auto lending settings.</em>
							</p>
							<div v-if="hasBillingAgreement">
								<kv-button
									type="submit"
									data-test="confirm-monthly-good-button"
									class="smaller"
									:disabled="$v.$invalid"
									@click.native="submitMonthlyGood()"
								>
									Confirm <kv-loading-spinner v-if="submitting" />
								</kv-button>
								<p>
									<em>We'll charge your PayPal account for your Monthly Good</em>
								</p>
							</div>

							<div v-if="!hasBillingAgreement">
								<div class="paypal-wrapper">
									<div class="paypal-cover" v-if="$v.$invalid"></div>
									<pay-pal-mg
										:amount="totalCombinedDeposit"
										@complete-transaction="submitMonthlyGood()"
									/>
									<p class="small-text">
										Thanks to PayPal, Kiva receives free payment processing.
									</p>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
			<already-subscribed-notice class="small-12 medium-11 large-8 column" v-if="isMonthlyGoodSubscriber" />
		</div>
	</www-page>
</template>

<script>
import numeral from 'numeral';
import _get from 'lodash/get';
import gql from 'graphql-tag';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import AlreadySubscribedNotice from './AlreadySubscribedNotice';
import PayPalMg from './PayPalMG';

import IconPencil from '@/assets/inline-svgs/icons/pencil.svg';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';
import KvCheckbox from '@/components/Kv/KvCheckbox';
import KvButton from '@/components/Kv/KvButton';
import userInfoQuery from '@/graphql/query/userInfo.graphql';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

const pageQuery = gql`{
	my {
		autoDeposit {
			id
			amount
			donateAmount
			dayOfMonth
			status
			isSubscriber
		}
		autolendProfile {
			isEnabled
		}
		payPalBillingAgreement {
			hasPayPalBillingAgreement
		}
	}
}`;

let frozenDropdownOptions;

export default {
	props: {
		amount: {
			type: Number,
			default: 25
		},
		group: {
			type: String,
			default: 'default'
		}
	},
	components: {
		AlreadySubscribedNotice,
		IconPencil,
		KvButton,
		KvCheckbox,
		KvCurrencyInput,
		KvDropdownRounded,
		KvLoadingSpinner,
		PayPalMg,
		WwwPage,
	},
	data() {
		return {
			selectedGroup: 'default',
			mgAmount: 25,
			isDayInputShown: false,
			dayOfMonth: new Date().getDate(),
			donation: 25 * 0.15,
			donationCheckbox: true,
			donationOptionSelected: '15',
			isDonationOptionsDirty: false,
			submitting: false,
			// user flags
			isMonthlyGoodSubscriber: false,
			hasAutoDeposits: false,
			hasAutoLending: false,
			hasBillingAgreement: false,
		};
	},
	mixins: [
		validationMixin,
		loanGroupCategoriesMixin
	],
	validations: {
		mgAmount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(10000),
			maxTotal(value) {
				return value + this.donation < 10000;
			}
		},
		donation: {
			minValue: minValue(0),
			maxValue: maxValue(10000),
			maxTotal(value) {
				return value + this.mgAmount < 10000;
			}
		},
		dayOfMonth: {
			required,
			minValue: minValue(1),
			maxValue: maxValue(31)
		},

	},
	inject: ['apollo'],
	apollo: {
		query: pageQuery,
		preFetch(config, client, { route }) {
			return client.query({ query: userInfoQuery })
				.then(({ data }) => {
					const userId = _get(data, 'my.userAccount.id');
					if (!userId) {
						throw new Error('activeLoginRequired');
					}
				})
				.then(() => {
					return client.query({ query: pageQuery })
						.then(({ data }) => {
							this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
							this.hasAutoDeposits = _get(data, 'my.autoDeposit', false);
							this.hasAutoLending = _get(data, 'my.autolendProfile.isEnabled', false);
							this.hasBillingAgreement = _get(
								data,
								'my.payPalBillingAgreement.hasPayPalBillingAgreement',
								false
							);
						});
				})
				.catch(e => {
					if (e.message.indexOf('activeLoginRequired') > -1) {
						// Force a login when active login is required
						return Promise.reject({
							path: '/ui-login',
							query: { doneUrl: route.fullPath }
						});
					}
					// Log other errors
					console.error(e);
				});
		},
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			this.hasAutoDeposits = _get(data, 'my.autoDeposit', false);
			this.hasAutoLending = _get(data, 'my.autolendProfile.isEnabled', false);
			this.hasBillingAgreement = _get(data, 'my.payPalBillingAgreement.hasPayPalBillingAgreement', false);
		},
	},
	created() {
		// Sanitize and set initial form values.
		if (this.lendingCategories.find(category => category.value === this.group)) {
			this.selectedGroup = this.group;
		}
		if (!Number.isNaN(Number(this.amount))) {
			this.mgAmount = this.amount;
			this.donation = this.amount * 0.15;
		}
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
		donationOptionSelected(newVal) {
			// flag donation options as dirty, which stops the recalculation of the drop down values.
			this.isDonationOptionsDirty = true;
			if (newVal !== 'other') {
				this.donation = this.mgAmount * (Number(newVal) / 100);
				// sync the checkbox with the dropdown.
				if (newVal !== '0') {
					this.donationCheckbox = true;
				} else {
					this.donationCheckbox = false;
				}
			}
		},
	},
	methods: {
		hideDayInput() {
			if (!this.$v.dayOfMonth.$invalid) {
				this.isDayInputShown = false;
			}
		},
		donationCheckboxChange() {
			if (!this.donationCheckbox) {
				// when box is unchecked, change donation amount to zero.
				this.donationOptionSelected = '0';
			}
		},
		submitMonthlyGood() {
			this.submitting = true;
			this.$kvTrackEvent('Registration', 'click-confirm-monthly-good', 'register-monthly-good');

			this.apollo.mutate({
				mutation: gql`
					mutation (
						$amount: Money!,
						$donateAmount: Money!,
						$dayOfMonth: Int!,
						$category: MonthlyGoodCategoryEnum
					) {
						my {
							createMonthlyGoodSubscription( autoDeposit: {
								amount: $amount, donateAmount: $donateAmount, dayOfMonth: $dayOfMonth
							},
							category: $category)
						}
					}`,
				variables: {
					amount: this.totalCombinedDeposit,
					donateAmount: this.donation,
					dayOfMonth: this.dayOfMonth,
					category: this.selectedGroup,
				}
			}).then(data => {
				if (data.errors) {
					const errorMessage = _get(data, 'errors[0].message');
					this.$showTipMsg(errorMessage, 'error');
				} else {
					this.$kvTrackEvent('Registration', 'successful-monthly-good-reg', 'register-monthly-good');

					// !TODO send to thanks page
					console.log('Send to Thanks Page', data);
					// send to thanks
					// self._sendToThanks();
				}
			}).catch(error => {
				this.$showTipMsg(error, 'error');
			}).finally(() => {
				this.submitting = false;
			});
		},
	},
	computed: {
		totalCombinedDeposit() {
			return this.donation + this.mgAmount;
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
			return [
				{
					value: '20',
					label: `${numeral(this.mgAmount * 0.20).format('$0,0.00')}`
				},
				{
					value: '15',
					label: `${numeral(this.mgAmount * 0.15).format('$0,0.00')}`
				},

				{
					value: '8',
					label: `${numeral(this.mgAmount * 0.08).format('$0,0.00')}`
				},
				{
					value: '0',
					label: '$0.00'
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
@import 'settings';

.monthly-good-setup-page {
	margin: 2rem auto 2rem;

	h1 { color: $kiva-green; }

	h3 { padding: 0 2rem; }

	form.monthly-good-form {
		margin-top: 2rem;

		.panel.zigzag-bottom {
			margin-bottom: 1.5rem;
			position: relative;
			background-color: $kiva-bg-darkgray;
			padding: 1rem 2rem 1rem 2rem;

			& > .row .row {
				margin-bottom: 1rem;
			}
		}

		.panel.zigzag-bottom::after {
			background:
				linear-gradient(-45deg, $white 12px, transparent 0),
				linear-gradient(45deg, $white 12px, transparent 0);
			background-size: 24px 24px;
			content: " ";
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 24px;
		}

		//aligns numbers with input
		.additional-left-pad-currency {
			padding-left: 0.55rem;
		}

		//aligns other rows to make room for checkbox
		.additional-left-pad-spans {
			padding-left: 1.55rem;
		}

		// styles to match KvDropDownRounded
		input.text-input {
			border: 1px solid $charcoal;
			border-radius: $button-radius;
			color: $charcoal;
			font-size: $medium-text-font-size;
			font-weight: $global-weight-highlight;
			margin: 0;
		}

		.button--ordinal-day {
			color: $kiva-accent-blue;
			fill: $kiva-accent-blue;
			cursor: pointer;
		}

		.icon-pencil {
			height: 1rem;
		}

		.text-input__day {
			display: inline-block;
			width: 3.5rem;
			padding: 0.25rem 0.5rem;
			margin: 0 0 0 0.25rem;
			height: 2rem;
		}

		.text-input,
		.validation-errors {
			margin: 0;
		}

		.additional-day-info {
			margin-bottom: 1.25rem;

			small,
			strong {
				display: block;
			}
		}

		.display-inline-block {
			display: inline-block;
		}

		::v-deep .loading-spinner {
			vertical-align: middle;
			width: 1rem;
			height: 1rem;
		}

		::v-deep .loading-spinner .line {
			background-color: $white;
		}

		::v-deep .dropdown-wrapper.donation-dropdown .dropdown {
			margin-bottom: 0;
			width: 100%;
		}

		::v-deep .dropdown-wrapper.group-dropdown .dropdown {
			margin-top: 0.65rem;
		}

		::v-deep .kv-checkbox {
			position: absolute;
			padding-top: 0.15rem;
		}
	}

	// cover and disallow clicking if form is invalid
	.paypal-wrapper { position: relative; }

	.paypal-cover {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(255, 255, 255, 0.8);
		z-index: 10000;
	}
}
</style>
