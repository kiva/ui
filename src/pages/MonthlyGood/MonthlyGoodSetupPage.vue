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

				<form class="monthly-good-form panel zigzag-bottom" @submit.prevent.stop="submit" novalidate>
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
									<label class="show-for-sr" :class="{ 'error': $v.mgAmount.$invalid }" for="amount">
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
									>{{ donation + mgAmount | numeral('$0,0.00') }}</strong>
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
					<!-- !TODO disable submit button if form is invalid :disabled="$v.$invalid"-->
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
import userInfoQuery from '@/graphql/query/userInfo.graphql';
import AlreadySubscribedNotice from './AlreadySubscribedNotice';
import WwwPage from '@/components/WwwFrame/WwwPage';
import IconPencil from '@/assets/inline-svgs/icons/pencil.svg';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';
import KvCheckbox from '@/components/Kv/KvCheckbox';

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
		WwwPage,
		AlreadySubscribedNotice,
		IconPencil,
		KvCurrencyInput,
		KvDropdownRounded,
		KvCheckbox
	},
	data() {
		return {
			selectedGroup: 'default',
			mgAmount: 25,
			isMonthlyGoodSubscriber: false,
			isDayInputShown: false,
			dayOfMonth: 1,
			donation: 25 * 0.15,
			donationCheckbox: true,
			donationOptionSelected: '15',
			isDonationOptionsDirty: false
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
		submit() {
			console.log('submit form');
		},
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
	},
	computed: {
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

// styles to match KvDropDownRounded
input.text-input {
	border: 1px solid $charcoal;
	border-radius: $button-radius;
	color: $charcoal;
	font-size: $medium-text-font-size;
	font-weight: $global-weight-highlight;
	margin: 0;
}

.monthly-good-setup-page {
	margin-top: 2rem;

	h1 { color: $kiva-green; }

	h3 { padding: 0 2rem; }

	form.monthly-good-form {
		margin-top: 2rem;

		& > .row .row {
			margin-bottom: 1rem;
		}

		//aligns numbers with input
		.additional-left-pad-currency {
			padding-left: 0.55rem;
		}

		//aligns other rows to make room for checkbox
		.additional-left-pad-spans {
			padding-left: 1.55rem;
		}

		&.panel.zigzag-bottom {
			margin-bottom: 4rem;
			position: relative;
			background-color: $kiva-bg-darkgray;
			padding: 1rem 2rem 1rem 2rem;
		}

		&.panel.zigzag-bottom::after {
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
}
</style>
