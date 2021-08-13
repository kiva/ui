<template>
	<www-page>
		<div class="monthly-good-setup-page">
			<div class="row align-center text-center auto-lending-notice"
				v-if="balance > autoDepositNoticeThreshold"
			>
				<div class="small-12 medium-11 large-10 column">
					<h2>Heads up! You have {{ balance | numeral('$0') }} available to lend.</h2>
					<!-- eslint-disable-next-line max-len -->
					<p>If you sign up for Monthly Good, this balance and all future repayments will be automatically lent. If you prefer to keep choosing your own loans, switch to auto-deposit.</p>
					<kv-button
						class="smaller secondary"
						to="/auto-deposit"
						v-kv-track-event="[
							'MonthlyGood',
							'click-large-balance-auto-deposit-warning',
							'Switch to auto-deposit'
						]"
					>
						Switch to auto-deposit
					</kv-button>
					<hr>
				</div>
			</div>
			<div class="row align-center">
				<div class="small-12 medium-11 large-10 column"
					v-if="!isMonthlyGoodSubscriber && !hasLegacySubscription"
				>
					<h1 class="text-center impact-text">
						Confirm your Good
					</h1>
					<h3 class="text-center featured-text" v-if="!isOnetime">
						Review and set up your monthly contribution
					</h3>
					<form
						class="monthly-good-form"
						@submit.prevent
						novalidate
					>
						<div class="panel zigzag-bottom">
							<div class="row align-center text-center">
								<div class="medium-10 small-12 columns">
									<div class="row column" v-if="!fromCovidLanding">
										<strong>Each month on the</strong>
										<label class="show-for-sr"
											:class="{ 'error': $v.dayOfMonth.$invalid }"
											:for="dayOfMonth"
										>
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
											v-model.number="dayOfMonth"
										>
										<button
											class="button--ordinal-day"
											@click="isDayInputShown = true"
											v-if="!isDayInputShown"
										>
											<strong>{{ dayOfMonth | numeral('Oo') }}</strong>
											<kv-icon class="icon-pencil" name="pencil" title="Edit" />
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
											<span class="additional-left-pad-spans strong">
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
											<div class="additional-left-pad-spans display-inline-block">
												<span class="strong">
													Monthly donation to Kiva (optional)
												</span>
												<div class="small-text" v-if="isMGTaglineActive">
													<!-- eslint-disable-next-line max-len -->
													Every $25 loan costs more than $3 to facilitate, and our generous supporters are donating $1 for every $3 you donate.
												</div>
											</div>
										</div>

										<div class="medium-5 small-6 columns">
											<label
												class="show-for-sr"
												:class="{ 'error': $v.donation.$invalid }"
												for="donation"
											>
												Donation
											</label>
											<kv-select
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
											<strong v-if="!onetime"
												class="additional-left-pad-spans"
											>Total/month</strong>
											<strong v-else class="additional-left-pad-spans">Total</strong>
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

									<div class="row text-left" v-if="!fromCovidLanding">
										<div class="small-12 columns">
											<div class="additional-left-pad-spans">
												Select a category to focus your lending
												<kv-select v-model="selectedGroup" class="group-dropdown">
													<option
														v-for="(option, index) in lendingCategories"
														:value="option.value"
														:key="index"
													>
														{{ option.label }}
													</option>
												</kv-select>
											</div>
										</div>
									</div>

									<div class="row small-collapse" v-if="!isOnetime">
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
									We’ll charge your payment method{{ isOnetime ? '' : ' each month' }}. All credit in your Kiva account, including repayments, will be automatically lent whenever it exceeds $25.
								</p>
								<p class="conditional-messaging">
									<!-- eslint-disable-next-line max-len -->
									<em v-if="hasAutoDeposits">* Your {{ isOnetime ? '' : 'new Monthly Good ' }}contribution will replace your existing auto deposit.</em>
									<!-- eslint-disable-next-line max-len -->
									<em v-if="hasAutoLending">* {{ isOnetime ? 'This contribution' : 'Enrolling in Monthly Good' }} will also disable your current auto lending settings.</em>
								</p>

								<div class="payment-dropin-wrapper" v-if="hasActiveLogin">
									<div class="payment-dropin-invalid-cover" v-if="$v.$invalid"></div>
									<monthly-good-drop-in-payment-wrapper
										:amount="totalCombinedDeposit"
										:donate-amount="donation"
										:day-of-month="dayOfMonth"
										:category="selectedGroup"
										:is-one-time="isOnetime"
										@complete-transaction="completeMGBraintree"
									/>
								</div>
								<div class="payment-dropin-wrapper" v-if="!hasActiveLogin">
									<kv-button
										title="Continue"
										:href="`/ui-login?force=true&doneUrl=${loginRedirectUrl}`"
										v-kv-track-event="[
											'MonthlyGood',
											'click-setup-form',
											'Continue'
										]"
									>
										Continue
									</kv-button>
								</div>
							</div>
						</div>
					</form>
				</div>
				<already-subscribed-notice
					class="small-12 medium-11 large-8 column"
					v-if="isMonthlyGoodSubscriber"
					:onetime="isOnetime"
				/>
				<legacy-subscriber-notice
					class="small-12 medium-11 large-8 column"
					:legacy-subscriptions="legacySubs"
					v-if="hasLegacySubscription"
				/>
			</div>

			<kv-loading-overlay
				v-if="showLoadingOverlay"
			/>
		</div>
	</www-page>
</template>

<script>
import numeral from 'numeral';
import gql from 'graphql-tag';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import { subDays } from 'date-fns';

import logReadQueryError from '@/util/logReadQueryError';
import { checkLastLoginTime } from '@/util/authenticationGuard';
import { myFTDQuery } from '@/util/checkoutUtils';

import authenticationQuery from '@/graphql/query/authenticationQuery.graphql';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';

import AlreadySubscribedNotice from '@/components/MonthlyGood/AlreadySubscribedNotice';
import KvButton from '@/components/Kv/KvButton';
import KvCheckbox from '@/components/Kv/KvCheckbox';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import KvSelect from '@/components/Kv/KvSelect';
import LegacySubscriberNotice from '@/components/MonthlyGood/LegacySubscriberNotice';
import MonthlyGoodDropInPaymentWrapper from '@/components/MonthlyGood/MonthlyGoodDropInPaymentWrapper';
import WwwPage from '@/components/WwwFrame/WwwPage';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

const pageQuery = gql`query monthlyGoodSetupPageControl {
	general {
		mgDonationTaglineActive: uiConfigSetting(key: "mg_donationtagline_active") {
			key
			value
		}
	}
	my {
		subscriptions {
			values {
				id
				subscrId
			}
		}
		autoDeposit {
			id
			amount
			donateAmount
			dayOfMonth
			status
			isSubscriber
		}
		autolendProfile {
			id
			isEnabled
		}
		userAccount {
			id
			balance
		}
	}
}`;

let frozenDropdownOptions;

/**
 * Returns initial day of month to start monthly good
 * @param {boolean} nextmonth Should MG start roughly a month from now?
 * @returns {number} day of start date
 */
const startDay = nextmonth => {
	const dayToStartMG = nextmonth ? subDays(new Date(), 1) : new Date();
	return dayToStartMG.getDate();
};

export default {
	props: {
		amount: {
			type: Number,
			default: 25
		},
		initDonation: {
			type: Number,
			default: 25 * 0.15,
		},
		day: {
			type: Number,
			default: startDay(false),
		},
		category: {
			type: String,
			default: 'default'
		},
		onetime: {
			type: String,
			default: 'false'
		},
		source: {
			type: String,
			default: ''
		},
		nextmonth: {
			type: Boolean,
			default: false
		}
	},
	components: {
		AlreadySubscribedNotice,
		KvButton,
		KvCheckbox,
		KvCurrencyInput,
		KvSelect,
		KvIcon,
		KvLoadingOverlay,
		LegacySubscriberNotice,
		MonthlyGoodDropInPaymentWrapper,
		WwwPage,
	},
	data() {
		return {
			selectedGroup: 'default',
			mgAmount: 25,
			isDayInputShown: false,
			dayOfMonth: startDay(this.nextmonth),
			donation: 25 * 0.15,
			donationCheckbox: true,
			donationOptionSelected: '15',
			isDonationOptionsDirty: false,
			submitting: false,
			legacySubs: [],
			showLoadingOverlay: false,
			// user flags
			isMonthlyGoodSubscriber: false,
			hasAutoDeposits: false,
			hasAutoLending: false,
			hasLegacySubscription: false,
			isMGTaglineActive: false,
			hasActiveLogin: false,
			balance: 0,
			autoDepositNoticeThreshold: 150
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
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client, { route }) {
			/**
			 * Implementation of SUBS-609 Experiment Results
			 * For users without a currently active login.
			 *
			 * If user has logged in before:
			 * Setup page should load, showing continue button.
			 * Login after setup form
			 *
			 * If user has not logged in before:
			 * Setup page should not load, redirect to login, then show setup page.
			 * Login before setup form.
			 */
			return client.query({ query: hasEverLoggedInQuery })
				.then(response => {
					const loginAfterSetup = response.data?.hasEverLoggedIn ? 'shown' : 'control';
					// Control version
					// Auth status should be checked and redirect to login.
					if (loginAfterSetup === 'control') {
						return client.query({
							query: authenticationQuery,
							fetchPolicy: 'network-only',
						}).then(({ data }) => {
							if (!data.my) {
								throw new Error('api.authenticationRequired');
							}
							// Route requires active login
							if (!checkLastLoginTime(data, 'activeLoginDuration', 3600)) {
								throw new Error('activeLoginRequired');
							}
							return client.query({ query: pageQuery });
						}).catch(() => {
							// Auth error will be caught here, redirect to login.
							return Promise.reject({
								path: '/ui-login',
								query: { force: true, doneUrl: route.fullPath }
							});
						});
					}
					// Shown version
					// Auth status should not be checked, continue with pageQuery
					if (loginAfterSetup === 'shown') {
						return client.query({ query: pageQuery });
					}
				});
		}
	},
	created() {
		try {
			const pageQueryResult = this.apollo.readQuery({
				query: pageQuery,
			});
			this.isMGTaglineActive = pageQueryResult?.general?.mgDonationTaglineActive?.value === 'true' || false;
			this.isMonthlyGoodSubscriber = pageQueryResult?.my?.autoDeposit?.isSubscriber ?? false;
			this.hasAutoDeposits = pageQueryResult?.my?.autoDeposit ?? false;
			this.hasAutoLending = pageQueryResult?.my?.autolendProfile?.isEnabled ?? false;
			this.legacySubs = pageQueryResult?.my?.subscriptions?.values ?? [];
			this.hasLegacySubscription = this.legacySubs.length > 0;
			this.hasActiveLogin = !!pageQueryResult?.my;
			this.balance = Math.floor(pageQueryResult?.my?.userAccount?.balance ?? 0);
		} catch (e) {
			logReadQueryError(e, 'MonthlyGoodSetupPage pageQuery');
		}

		// Sanitize and set initial form values.
		// Initial group from prop
		if (this.lendingCategories.find(category => category.value === this.category)) {
			this.selectedGroup = this.category;
		}

		// Initial amount from prop
		if (!Number.isNaN(this.amount)) {
			this.mgAmount = this.amount;
		}

		// Initial donation from prop
		if (!Number.isNaN(this.initDonation)) {
			// If donation in prop on load, set donation to other and fill with value from prop
			this.donationOptionSelected = 'other';
			this.donation = this.initDonation;
		} else {
			this.donation = this.amount * 0.15;
		}

		// Initial day from prop
		if (!Number.isNaN(this.day)) {
			this.dayOfMonth = this.day;
		}

		// Fire snowplow events
		if (this.isMonthlyGoodSubscriber) {
			this.$kvTrackEvent('Registration', 'unsuccessful-monthly-good-reg', 'has-mg');
		}
		if (this.hasLegacySubscription) {
			this.$kvTrackEvent('Registration', 'unsuccessful-monthly-good-reg', 'has-legacy-subscription');
		}

		// Fire event if user sees auto-deposit warning
		if (this.balance > this.autoDepositNoticeThreshold) {
			this.$kvTrackEvent('MonthlyGood', 'shown-large-balance-auto-deposit-warning');
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
		// monitor mgAmount for changes
		mgAmount() {
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
		completeMGBraintree(paymentType) {
			this.showLoadingOverlay = true;
			this.$kvTrackEvent('Registration', 'successful-monthly-good-reg', 'register-monthly-good');

			const mgSignupData = {
				mgTotalAmount: this.totalCombinedDeposit,
				mgLendingAmount: this.mgAmount,
				mgDonationAmount: this.donation,
				mgDayOfMonth: this.dayOfMonth,
				mgCategory: this.selectedGroup,
				isFTD: false,
				mgIsOneTime: this.isOnetime,
			};

			// check ftd status
			const myFtd = myFTDQuery(this.apollo);
			myFtd.then(({ data }) => {
				const isFTD = data?.my?.userAccount?.isFirstTimeDepositor;
				const hasDeposits = data?.my?.userAccount?.hasDeposits;
				// update transaction data
				mgSignupData.isFTD = isFTD || !hasDeposits;

				// push to dataLayer
				if (typeof window.dataLayer === 'object') {
					window.dataLayer.push({
						event: 'monthlyGoodSignUp',
						...mgSignupData
					});
				}

				// Send to thanks page
				this.$router.push({
					path: '/monthlygood/thanks',
					query: {
						onetime: this.isOnetime,
						source: this.source,
						paymentType: paymentType || 'UnknownBraintree',
					}
				}).finally(() => {
					this.showLoadingOverlay = false;
				});
			});
		},
	},
	computed: {
		// change url parameters if form values are changed for login redirect
		loginRedirectUrl() {
			let redirectString = this.$route.path;
			// eslint-disable-next-line max-len
			redirectString += `?amount=${this.mgAmount}&category=${this.selectedGroup}&day=${this.dayOfMonth}&initDonation=${this.donation}`;
			if (this.source) {
				redirectString += `&source=${this.source}`;
			}
			if (this.onetime) {
				redirectString += `&onetime=${this.onetime}`;
			}
			return encodeURIComponent(redirectString);
		},
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
			// If mgAmount isn't valid, just set these values on the amount prop.
			const amountToBasePercentageOn = this.$v.mgAmount.$invalid ? this.amount : this.mgAmount;
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
		isOnetime() {
			// ensure this is cast to a bool for use in Graphql mutation
			return this.onetime === 'true';
		},
		fromCovidLanding() {
			return this.source === 'covid19response';
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.monthly-good-setup-page {
	position: relative;
	padding: 2rem 0 2rem;

	h1 { color: $kiva-green; }

	h3 { padding: 0 2rem; }

	form.monthly-good-form {
		margin-top: 2rem;

		.panel.zigzag-bottom {
			margin-bottom: 1.5rem;
			position: relative;
			background-color: $kiva-bg-darkgray;
			padding: 1rem;

			& > .row .row {
				margin-bottom: 1rem;
			}

			@include breakpoint(large) {
				padding: 1rem 2rem;
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
			display: inline-block;
		}

		// styles to match KvSelect
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
			width: 1rem;
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

	.auto-lending-notice {
		h2 {
			margin-bottom: 1.5rem;
		}

		.button {
			margin-top: 1rem;
		}

		margin-bottom: 2.5rem;
	}

	// cover and disallow clicking if form is invalid
	.payment-dropin-wrapper {
		position: relative;
	}

	.payment-dropin-invalid-cover {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(255, 255, 255, 0.8);
		z-index: 10000;
	}

	.conditional-messaging {
		margin: 1.5rem 0 2rem;
		em { display: block; }
	}
}

// Set z-index for loading overlay so that it is over drop in UI
.loading-overlay {
	z-index: 500;
}
</style>
