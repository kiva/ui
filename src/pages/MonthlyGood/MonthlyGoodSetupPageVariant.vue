<template>
	<www-page>
		<div v-if="!isMonthlyGoodSubscriber && !hasLegacySubscription">
			<kv-responsive-image
				class="hero-images"
				:images="heroImages"
				alt="A woman in a yellow dress with a look of pride and satisfaction on her face "
			/>
			<div class="row">
				<div class="small-12 columns monthly-good-setup">
					<div class="large-10 large-offset-1 columns ">
						<div class="section">
							<kv-checkout-steps
								class="step-indicator"
								:steps="['Review', 'Thank You!']"
								:current-step-index="0"
							/>
						</div>
						<div class="section">
							<h1 class="h2">
								{{ pageTitle }}
							</h1>
							<div class="row">
								<div class="small-12 large-7 xlarge-8 xxlarge-9 columns">
									<p>
										<span class="quiet">
											Your subscription will support {{ selectedCategory }} on Kiva.
										</span><br>
										It will deposit every month on the {{ dayOfMonth }}th,
										and you can cancel any time.
									</p>
								</div>
								<div class="small-12 large-4 xlarge-3 xxlarge-2 large-offset-1 columns text-right">
									<span class="h3">${{ mgAmount }}</span>
								</div>
							</div>
						</div>
						<form
							class="section donation"
							:disabled="$v.$invalid || submitting"
							@submit.prevent="hasBillingAgreement ? submitMonthlyGood() : null"
							novalidate
						>
							<div class="donation__description">
								<label for="donation" class="h2">
									Monthly Donation to Kiva (optional)
								</label>
								<p class="inline quiet">
									{{ donationTagLine }}
								</p>
								<button
									class="small-text donation__info-btn inline"
									@click="triggerDefaultLightbox"
									type="button"
									v-kv-track-event="['Registration', 'Donation Info Lightbox', 'Open Lightbox']"
								>
									How Kiva uses donations
								</button>
							</div>
							<div class="donation__pricing">
								<kv-dropdown-rounded
									class="donation__pricing-dropdown"
									v-model="donationOptionSelected"
									id="donation"
								>
									<option
										v-for="(option, index) in dropdownOptions"
										:value="option.value"
										:key="index"
									>
										{{ option.label }}
									</option>
								</kv-dropdown-rounded>
								<div
									class="donation__pricing-other"
									v-if="donationOptionSelected === 'other'"
								>
									<label for="other-donation" class="show-for-sr">Other Donation Amount</label>
									<kv-currency-input
										id="other-donation"
										v-model="donation"
										ref="donationOtherInput"
									/>
									<ul class="text-right validation-errors" v-if="$v.donation.$invalid">
										<li v-if="!$v.donation.minValue || !$v.donation.maxValue">
											Enter an amount of $0-$10,000
										</li>
									</ul>
								</div>
							</div>
						</form>

						<div class="section notice" v-if="!isNewUserRegistration">
							<kv-icon name="bell" class="notice__icon" />
							<div>
								<p>
									Your current auto-lending settings will be
									updated to the Monthly Good lending setting.
								</p>
								<p class="quiet">
									Eligible credit in your Kiva account will be automatically re-lent
									for you to support {{ selectedCategory }} on Kiva.
								</p>
								<p v-if="hasAutoDeposits" class="quiet">
									<em>
										* Your {{ isOnetime ? '' : 'new Monthly Good ' }}contribution
										will replace your existing auto deposit.
									</em>
								</p>
							</div>
						</div>

						<div class="section section--last text-right">
							<div class="h2 strong">
								<span v-if="!isOnetime">Total/month:</span>
								<span v-else>Total:</span>
								{{ totalCombinedDeposit | numeral('$0,0.00') }}
							</div>
							<ul class="text-right validation-errors"
								v-if="!$v.mgAmount.maxTotal || !$v.donation.maxTotal"
							>
								<li>
									The maximum Monthly Good total is $10,000.<br>
									Please try again by entering in a smaller amount.
								</li>
							</ul>
							<div v-if="hasBillingAgreement">
								<kv-button
									data-test="confirm-monthly-good-button"
									class="subscribe-btn"
									:disabled="$v.$invalid || submitting"
									@click.native="submitMonthlyGood()"
								>
									Subscribe <kv-loading-spinner v-if="submitting" />
								</kv-button>
								<p>
									<em>
										We'll charge your PayPal account for your
										{{ isOnetime ? 'Contribution' : 'Monthly Good' }}
									</em>
								</p>
							</div>

							<div v-if="!hasBillingAgreement" class="paypal">
								<div class="paypal__wrapper">
									<div class="paypal__cover" v-if="$v.$invalid"></div>
									<pay-pal-mg
										class="paypal__btn"
										:amount="totalCombinedDeposit"
										@complete-transaction="submitMonthlyGood()"
									/>
									<p class="small-text">
										Thanks to PayPal, Kiva receives free payment processing.
									</p>
								</div>
							</div>
						</div>
						<kv-lightbox
							:visible="donationLbVisible"
							@lightbox-closed="lightboxClosed"
							title="How does Kiva use donations?"
						>
							<p>
								100% of every dollar you lend on Kiva goes directly to funding loans.
								We rely on small optional donations from you and others to keep Kiva running.
								Every $1 donated to Kiva makes $8 in loans possible around the world.
								Your donation will enable us to:
							</p>
							<ul>
								<li>Send expert staff to over 60 countries to vet and monitor loans and partners.</li>
								<li>
									Build and maintain a website that facilitates over
									$1 million in loans each week.
								</li>
								<li>Provide comprehensive customer support to thousands of lenders worldwide.</li>
								<li>Train and support hundreds of volunteers -- 4 for every 1 staff member at Kiva.</li>
							</ul>
							<p>
								If you live in the United States, your donation is tax-deductible.
								Thank you for considering a donation to Kiva.
							</p>
						</kv-lightbox>
					</div>
				</div>
			</div>
		</div>
		<div
			v-else
			class="row align-center other-notices"
		>
			<already-subscribed-notice
				class="small-12 medium-11 large-8 columns"
				v-if="isMonthlyGoodSubscriber"
				:onetime="isOnetime"
			/>
			<legacy-subscriber-notice
				class="small-12 medium-11 large-8 columns"
				v-if="hasLegacySubscription"
				:legacy-subscriptions="legacySubs"
			/>
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
import LegacySubscriberNotice from './LegacySubscriberNotice';
import PayPalMg from './PayPalMG';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '@/components/Kv/KvButton';
import KvCheckoutSteps from '@/components/Kv/KvCheckoutSteps';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

const heroImagesRequire = require.context('@/assets/images/mg-landing-hero', true);

const pageQuery = gql`query monthlyGoodSetupPageVariant {
    general {
      mgDonationTaglineActive: uiConfigSetting(key: "mg_donationtagline_active") {
        key
        value
      }
    }
	my {
		subscriptions {
			values {
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
			isEnabled
		}
		loans {
			totalCount
		}
		payPalBillingAgreement {
			hasPayPalBillingAgreement
		}
	}
}`;

export default {
	props: {
		amount: {
			type: Number,
			default: 25
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
		}
	},
	components: {
		AlreadySubscribedNotice,
		KvButton,
		KvCheckoutSteps,
		KvCurrencyInput,
		KvDropdownRounded,
		KvIcon,
		KvLightbox,
		KvLoadingSpinner,
		KvResponsiveImage,
		LegacySubscriberNotice,
		PayPalMg,
		WwwPage,
	},
	data() {
		return {
			donationLbVisible: false,
			heroImages: [
				['small', heroImagesRequire('./monthlygood-banner-sm-std.jpg')],
				['small retina', heroImagesRequire('./monthlygood-banner-sm-retina.jpg')],
				['medium', heroImagesRequire('./monthlygood-banner-med-std_0.jpg')],
				['medium retina', heroImagesRequire('./monthlygood-banner-med-retina_0.jpg')],
				['large', heroImagesRequire('./monthlygood-banner-lg-std_0.jpg')],
				['large retina', heroImagesRequire('./monthlygood-banner-lg-retina_0.jpg')],
				['xga', heroImagesRequire('./monthlygood-banner-xl-std_0.jpg')],
				['xga retina', heroImagesRequire('./monthlygood-banner-xl-retina_0.jpg')],
				['wxga', heroImagesRequire('./monthlygood-banner-xxl-std.jpg')],
				['wxga retina', heroImagesRequire('./monthlygood-banner-xxl-retina.jpg')],
			],
			selectedGroup: 'default',
			mgAmount: 25,
			dayOfMonth: 20,
			donation: 25 * 0.15,
			donationOptionSelected: '15',
			submitting: false,
			legacySubs: [],
			// user flags
			isNewUserRegistration: true,
			isMonthlyGoodSubscriber: false,
			hasAutoDeposits: false,
			hasBillingAgreement: false,
			hasLegacySubscription: false,
			isMGDonationTaglineActive: false,
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
	},
	inject: ['apollo'],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isMGDonationTaglineActive = _get(data, 'general.mgDonationTaglineActive.value') === 'true' || false;
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			this.hasAutoDeposits = _get(data, 'my.autoDeposit', false);
			this.hasBillingAgreement = _get(data,
				'my.payPalBillingAgreement.hasPayPalBillingAgreement', false);
			this.legacySubs = _get(data, 'my.subscriptions.values', []);
			this.hasLegacySubscription = this.legacySubs.length > 0;
			this.isNewUserRegistration = _get(data, 'my.loans.totalCount') === 0;
		},
	},
	created() {
		// Sanitize and set initial form values.
		if (this.lendingCategories.find(category => category.value === this.category)) {
			this.selectedGroup = this.category;
		}

		if (!Number.isNaN(Number(this.amount))) {
			this.mgAmount = this.amount;
			this.donation = this.amount * 0.15;
		}
		// Fire snowplow events
		if (this.isMonthlyGoodSubscriber) {
			this.$kvTrackEvent('Registration', 'unsuccessful-monthly-good-reg', 'has-mg');
		}
		if (this.hasLegacySubscription) {
			this.$kvTrackEvent('Registration', 'unsuccessful-monthly-good-reg', 'has-legacy-subscription');
		}
	},
	watch: {
		async donationOptionSelected(newVal) {
			// flag donation options as dirty, which stops the recalculation of the drop down values.
			if (newVal !== 'other') {
				// handle pre-computed donation options based update
				const selectedDonationAmount = this.calculatedDonationOptions.find(
					donationSelect => donationSelect.value === newVal
				);
				this.donation = selectedDonationAmount.monetaryValue;
			} else {
				await this.$nextTick();
				try {
					this.$refs.donationOtherInput.$el.focus();
				} catch (err) {
					console.error(err);
				}
			}
		}
	},
	metaInfo() {
		return {
			title: `${this.pageTitle} - Review`,
		};
	},
	methods: {
		triggerDefaultLightbox() {
			this.donationLbVisible = !this.donationLbVisible;
		},
		lightboxClosed() {
			this.donationLbVisible = false;
		},
		focusDonationOtherInput() {
			this.$refs.donationOtherInput.focus();
		},
		submitMonthlyGood() {
			this.submitting = true;
			this.$kvTrackEvent('Registration', 'click-confirm-monthly-good', 'register-monthly-good');

			this.apollo.mutate({
				mutation: gql`
					mutation registerMonthlyGood(
						$amount: Money!,
						$donateAmount: Money!,
						$dayOfMonth: Int!,
						$category: MonthlyGoodCategoryEnum,
						$isOnetime: Boolean
					) {
						my {
							createMonthlyGoodSubscription( autoDeposit: {
								amount: $amount,
								donateAmount: $donateAmount,
								dayOfMonth: $dayOfMonth,
								isOnetime: $isOnetime
							},
							category: $category)
						}
					}`,
				variables: {
					amount: numeral(this.totalCombinedDeposit).format('0.00'),
					donateAmount: numeral(this.donation).format('0.00'),
					dayOfMonth: numeral(this.dayOfMonth).value(),
					category: this.selectedGroup,
					isOnetime: this.isOnetime
				}
			}).then(data => {
				if (data.errors) {
					const errorMessage = _get(data, 'errors[0].message');
					this.$showTipMsg(errorMessage, 'error');
				} else {
					this.$kvTrackEvent('Registration', 'successful-monthly-good-reg', 'register-monthly-good');
					// Send to thanks page
					this.$router.push({
						path: '/monthlygood/thanks',
						query: {
							onetime: this.isOnetime,
							source: this.source,
						}
					});
				}
			}).catch(error => {
				this.$showTipMsg(error, 'error');
			}).finally(() => {
				this.submitting = false;
			});
		},
	},
	computed: {
		pageTitle() {
			return this.category === 'disaster_relief_covid' ? 'COVID-19 relief' : 'Monthly Good';
		},
		totalCombinedDeposit() {
			return this.donation + this.mgAmount;
		},
		donationTagLine() {
			if (!this.isMGDonationTaglineActive) {
				return 'Each $25 loan costs Kiva more than $3 to facilitate. Will you help us cover our costs?';
			}
			return 'Every $25 loan costs more than $3 to facilitate, and our generous supporters are donating $1 for every $3 you donate.'; // eslint-disable-line max-len
		},
		selectedCategory() {
			return this.lendingCategories.find(category => category.value === this.category).shortName;
		},
		dropdownOptions() {
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

.hero-images {
	height: 0;
	padding-bottom: 540/480 * 100%;

	@include breakpoint(medium) {
		padding-bottom: 372/680 * 100%;
	}

	@include breakpoint(large) {
		padding-bottom: 441/1024 * 100%;
	}

	@include breakpoint(xga) {
		padding-bottom: 620/1440 * 100%;
	}

	@include breakpoint(wxga) {
		padding-bottom: 750/1920 * 100%;
	}
}

.section {
	padding-bottom: 2rem;
	margin-bottom: 2rem;
	border-bottom: 1px solid $kiva-stroke-gray;

	&--last {
		margin-bottom: 0;
		border-bottom: 0;
	}
}

.step-indicator {
	max-width: 20rem;
	margin: 0 auto;
}

.monthly-good-setup {
	background: #fff;
	padding-bottom: 2rem;
	padding-top: 2rem;

	@include breakpoint(large) {
		margin-top: -20%;
		margin-bottom: 4rem;
		border-radius: rem-calc(8);
		box-shadow: 0 0 rem-calc(24) rem-calc(1) rgba(0, 0, 0, 0.2);
	}

	@include breakpoint(xga) {
		margin-top: -30%;
	}

	@include breakpoint(wxga) {
		margin-top: -38%;
	}

	p {
		margin-bottom: 0;
	}
}

.donation {
	@include breakpoint(large) {
		display: flex;
	}

	&__description {
		@include breakpoint(large) {
			flex: 1;
			margin-right: 1rem;
		}
	}

	&__pricing {
		display: flex;
		text-align: right;
		margin-top: 1rem;
		justify-content: flex-end;
	}

	&__pricing-other {
		margin-left: 1rem;
		width: 7rem;
	}

	&__info-btn {
		font-size: $normal-text-font-size;
		color: $kiva-textlink;
		text-decoration: underline;

		&:hover {
			color: $kiva-textlink-hover;
			text-decoration: underline;
		}
	}
}

.notice {
	display: flex;

	&__icon {
		width: 3rem;
		height: 3rem;
		flex-shrink: 0;
		margin-right: 1rem;
		padding: 0.66rem;
		background: $kiva-green;
		fill: #fff;
		border-radius: 50%;
	}
}

.subscribe-btn {
	width: 100%;
	margin: 1.5rem auto;

	@include breakpoint(large) {
		width: 16rem;
	}
}

.paypal {
	&__wrapper {
		position: relative;
	}

	// cover and disallow clicking if form is invalid
	&__cover {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(255, 255, 255, 0.8);
		z-index: 10000;
	}

	&__btn {
		width: fit-content;
		margin: 1.5rem 0 1.5rem auto;
	}
}

.other-notices {
	margin: 5rem auto;
	text-align: center;
}

// utility classes
.h1 {
	@include large-text();
}

.h2 {
	font-size: 1.75rem;
}

.h3 {
	font-size: 1.25rem;
	font-weight: $global-weight-highlight;
}

.inline {
	display: inline;
}

.quiet {
	color: $kiva-text-light;
}

// overrides
::v-deep .loading-spinner {
	vertical-align: middle;
	width: 1rem;
	height: 1rem;
}

::v-deep .loading-spinner .line {
	background-color: $white;
}
</style>
