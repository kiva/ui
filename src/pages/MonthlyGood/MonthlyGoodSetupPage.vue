<template>
	<www-page>
		<kv-default-wrapper class="monthly-good-setup-page">
			<div
				class="row align-center tw-text-center auto-lending-notice"
				v-if="balance > autoDepositNoticeThreshold"
			>
				<div class="small-12 medium-11 large-10 column">
					<h2 class="tw-mb-4">
						Heads up! You have {{ balance | numeral('$0') }} available to lend.
					</h2>
					<p class="tw-mb-2">
						<!-- eslint-disable-next-line max-len -->
						If you sign up for Monthly Good, this balance and all future repayments will be automatically lent. If you prefer to keep choosing your own loans, switch to auto-deposit.
					</p>
					<kv-button
						variant="secondary"
						class="tw-mb-4"
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
				<div
					class="small-12 medium-11 large-10 column"
					v-if="!isMonthlyGoodSubscriber && !hasLegacySubscription && !hasModernSub"
				>
					<h1 class="tw-text-center tw-mb-2">
						Confirm your Good
					</h1>
					<h2 class="tw-text-center tw-text-subhead tw-mb-4">
						Review and set up your monthly contribution
					</h2>
					<form
						class="monthly-good-form"
						@submit.prevent
						novalidate
					>
						<div class="panel zigzag-bottom tw-bg-secondary">
							<div class="row align-center tw-text-center">
								<div class="medium-10 small-12 columns">
									<div class="row column">
										<strong>Each month on the</strong>
										<label
											class="tw-sr-only"
											:class="{ 'tw-text-danger': $v.dayOfMonth.$invalid }"
											:for="dayOfMonth"
										>
											Day of the Month
										</label>
										<kv-text-input
											v-if="isDayInputShown"
											@blur="hideDayInput()"
											class="text-input__day tw-w-9 tw-inline-block tw-ml-1"
											id="dayOfMonth"
											type="number"
											placeholder=""
											required
											min="1"
											max="31"
											v-model.number="dayOfMonth"
										/>
										<button
											class="tw-text-link"
											@click="isDayInputShown = true"
											v-if="!isDayInputShown"
										>
											<strong>{{ dayOfMonth | numeral('Oo') }}</strong>
											<kv-icon class="tw-w-2 tw-h-2" name="pencil" title="Edit" />
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

									<div class="row tw-text-left align-middle">
										<div class="columns">
											<span class="tw-font-medium tw-ml-3">
												Deposit for lending
											</span>
										</div>

										<div class="medium-5 small-6 columns">
											<label
												class="tw-sr-only"
												:class="{ 'tw-text-danger': $v.mgAmount.$invalid }"
												for="amount"
											>
												Amount
											</label>
											<kv-currency-input
												class="text-input tw-w-full"
												id="amount"
												v-model="mgAmount"
											/>
										</div>

										<div class="small-12 columns">
											<ul class="tw-text-right validation-errors" v-if="$v.mgAmount.$invalid">
												<li v-if="!$v.mgAmount.required">
													Field is required
												</li>
												<li v-if="!$v.mgAmount.minValue || !$v.mgAmount.maxValue">
													Enter an amount of $5-$10,000
												</li>
											</ul>
										</div>
									</div>

									<div class="row tw-text-left align-middle">
										<div class="columns">
											<kv-checkbox
												id="donation-checkbox"
												class="tw--ml-2"
												v-model="donationCheckbox"
											>
												<span class="tw-font-medium">
													Help cover the cost of your loans (optional donation to Kiva)
												</span>
												<div class="tw-text-small" v-if="isMGTaglineActive">
													<!-- eslint-disable-next-line max-len -->
													Every $25 loan costs more than $3 to facilitate, and our generous supporters are donating $1 for every $3 you donate.
												</div>
											</kv-checkbox>
										</div>

										<div class="medium-5 small-6 columns">
											<label
												class="tw-sr-only"
												:class="{ 'tw-text-danger': $v.donation.$invalid }"
												:for="`
													${donationOptionSelected !== 'other'
													? 'donation' : 'donation_other'
												}`"
											>
												Donation
											</label>
											<kv-select
												class="donation-dropdown tw-w-full"
												id="donation"
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
												id="donation_other"
												v-model="donation"
												v-if="donationOptionSelected === 'other'"
											/>
										</div>

										<div class="small-12 columns">
											<ul class="tw-text-right validation-errors" v-if="$v.donation.$invalid">
												<li v-if="!$v.donation.minValue || !$v.donation.maxValue">
													Enter an amount of $0-$10,000
												</li>
											</ul>
										</div>
									</div>

									<div class="row tw-text-left">
										<div class="columns">
											<span class="tw-font-medium tw-ml-3">Total/month</span>
										</div>

										<div class="medium-5 small-6 columns">
											<span class="tw-ml-1 tw-font-medium">
												{{ totalCombinedDeposit | numeral('$0,0.00') }}
											</span>
										</div>

										<div class="small-12 columns">
											<ul
												class="tw-text-center validation-errors"
												v-if="!$v.mgAmount.maxTotal || !$v.donation.maxTotal"
											>
												<li>
													The maximum Monthly Good total is $10,000.<br>
													Please try again by entering in a smaller amount.
												</li>
											</ul>
										</div>
									</div>

									<div class="row tw-text-left">
										<div class="small-12 columns">
											<div class="tw-ml-3">
												<label for="lending-category" class="tw-block tw-mb-2">
													Select a category to focus your lending
												</label>
												<kv-select
													v-model="selectedGroup"
													class="group-dropdown tw-mb-2"
													id="lending-category"
												>
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

									<div class="row small-collapse">
										<div class="small-12 columns">
											<em class="tw-text-center">Rest easy, you can cancel anytime.</em>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="row align-center tw-text-center">
							<div class="large-9 medium-10 small-12 columns">
								<p class="tw-mb-2">
									<!-- eslint-disable-next-line max-len -->
									We’ll charge your payment method each month. All credit in your Kiva account, including repayments, will be automatically lent whenever it exceeds $5.
								</p>
								<p class="conditional-messaging">
									<!-- eslint-disable-next-line max-len -->
									<em v-if="hasAutoDeposits">* Your new Monthly Good contribution will replace your existing auto deposit.</em>
									<!-- eslint-disable-next-line max-len -->
									<em v-if="hasAutoLending">* Enrolling in Monthly Good will also disable your current auto lending settings.</em>
								</p>

								<div class="payment-dropin-wrapper" v-if="hasActiveLogin">
									<div class="payment-dropin-invalid-cover" v-if="$v.$invalid"></div>
									<monthly-good-drop-in-payment-wrapper
										:amount="totalCombinedDeposit"
										:donate-amount="donation"
										:day-of-month="dayOfMonth"
										:category="selectedGroup"
										@complete-transaction="completeMGBraintree"
									/>
								</div>
								<div class="payment-dropin-wrapper" v-if="!hasActiveLogin">
									<kv-button
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
					v-if="isMonthlyGoodSubscriber || hasModernSub"
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
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import numeral from 'numeral';
import { gql } from '@apollo/client';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import { subDays } from 'date-fns';

import logReadQueryError from '@/util/logReadQueryError';
import { checkLastLoginTime } from '@/util/authenticationGuard';
import { myFTDQuery } from '@/util/checkoutUtils';

import authenticationQuery from '@/graphql/query/authenticationQuery.graphql';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';

import AlreadySubscribedNotice from '@/components/MonthlyGood/AlreadySubscribedNotice';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import LegacySubscriberNotice from '@/components/MonthlyGood/LegacySubscriberNotice';
import MonthlyGoodDropInPaymentWrapper from '@/components/MonthlyGood/MonthlyGoodDropInPaymentWrapper';
import WwwPage from '@/components/WwwFrame/WwwPage';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

const pageQuery = gql`query monthlyGoodSetupPageControl {
	general {
		mgDonationTaglineActive: uiConfigSetting(key: "mg_donationtagline_active") {
			key
			value
		}
	}
	my {
		id
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
	mySubscriptions(includeDisabled: false) {
		values {
			id
			enabled
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

const defaultDonationPercentage = 0.18;

export default {
	name: 'MonthlyGoodSetupPage',
	props: {
		amount: {
			type: Number,
			default: 25
		},
		initDonation: {
			type: Number,
			default: 25 * defaultDonationPercentage,
		},
		day: {
			type: Number,
			default: startDay(false),
		},
		category: {
			type: String,
			default: 'default'
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
		KvDefaultWrapper,
		KvSelect,
		KvIcon,
		KvLoadingOverlay,
		KvTextInput,
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
			donation: 25 * defaultDonationPercentage,
			donationCheckbox: true,
			donationOptionSelected: '18',
			isDonationOptionsDirty: false,
			submitting: false,
			legacySubs: [],
			showLoadingOverlay: false,
			// user flags
			isMonthlyGoodSubscriber: false,
			hasAutoDeposits: false,
			hasAutoLending: false,
			hasLegacySubscription: false,
			hasModernSub: false,
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
			const modernSubscriptions = pageQueryResult?.mySubscriptions?.values ?? [];
			this.hasModernSub = modernSubscriptions.length !== 0;
		} catch (e) {
			logReadQueryError(e, 'MonthlyGoodSetupPage pageQuery');
		}

		// Sanitize and set initial form values.
		// Initial group from prop
		// Removing covid-19 as a category option
		this.lendingCategories = this.lendingCategories.filter(category => category.marketingName !== 'COVID-19');
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
			this.donation = this.amount * defaultDonationPercentage;
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
					value: '18',
					label: `${numeral(amountToBasePercentageOn * defaultDonationPercentage).format('$0,0.00')}`,
					monetaryValue: Math.round(amountToBasePercentageOn * defaultDonationPercentage * 100) / 100

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
@import 'settings';

.monthly-good-setup-page {
	position: relative;

	form.monthly-good-form {
		margin-top: 2rem;

		.panel.zigzag-bottom {
			margin-bottom: 1.5rem;
			position: relative;
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
				linear-gradient(-45deg, rgb(var(--bg-primary)) 12px, transparent 0),
				linear-gradient(45deg, rgb(var(--bg-primary)) 12px, transparent 0);
			background-size: 24px 24px;
			content: " ";
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 24px;
		}

		.additional-day-info {
			margin-bottom: 1.25rem;

			small,
			strong {
				display: block;
			}
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
