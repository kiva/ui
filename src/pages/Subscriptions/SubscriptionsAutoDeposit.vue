<template>
	<div class="row">
		<kv-settings-card class="column large-8" title="Auto Deposit">
			<template v-slot:icon>
				<kv-icon
					class="icon"
					title="Auto Deposits"
					name="subscriptions-auto-deposit"
				/>
			</template>
			<template v-slot:content>
				<router-link v-if="!isAutoDepositSubscriber"
					to="/auto-deposit"
				>
					Add money to your account every month
				</router-link>
				<div v-if="isAutoDepositSubscriber">
					<p>
						On the <kv-button class="text-link"
							@click.native.prevent="showLightbox = true;"
						>
							{{ dayOfMonth | numeral('Oo') }}
						</kv-button> of each month <kv-button class="text-link"
							@click.native.prevent="showLightbox = true;"
						>
							{{ totalCombinedDeposit | numeral('$0,0.00') }}
						</kv-button> will be
						transferred.
					</p>
					<p>
						<kv-button class="text-link"
							@click.native.prevent="$emit('cancel-subscription')"
						>
							Cancel Auto Deposit
						</kv-button>
					</p>
					<kv-lightbox
						class="auto-deposit-settings-lightbox"
						:visible="showLightbox"
						title="Change your auto deposit"
						@lightbox-closed="closeLightbox"
					>
						<form
							@submit.prevent="null"
							novalidate
						>
							<fieldset :disabled="isSaving">
								<div class="row align-center text-left">
									<div class="small-12 columns">
										<div class="row column">
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
											<strong>we'll process the following:</strong>
											<ul class="validation-errors" v-if="$v.dayOfMonth.$invalid">
												<li v-if="!$v.dayOfMonth.required">
													Field is required
												</li>
												<li v-if="!$v.dayOfMonth.minValue || !$v.dayOfMonth.maxValue">
													Enter day of month between 1 and 31
												</li>
											</ul>
											<div class="additional-day-info">
												<small v-if="dayOfMonth > 28">
													(note - may be processed on the last day of the month)</small>
											</div>
										</div>
										<div class="middle-wrapper">
											<div class="row align-middle">
												<div class="columns">
													<span>
														Deposit for lending
													</span>
												</div>

												<div class="small-6 medium-4 columns">
													<label
														class="show-for-sr"
														:class="{ 'error': $v.mgAmount.$invalid }"
														for="amount"
													>
														Amount
													</label>
													<kv-currency-input
														class="text-input"
														id="amount"
														v-model="mgAmount"
													/>
												</div>
											</div>
											<div class="row columns align-middle">
												<ul class="text-right validation-errors" v-if="$v.mgAmount.$invalid">
													<li v-if="!$v.mgAmount.required">
														Field is required
													</li>
													<li v-if="!$v.mgAmount.minValue || !$v.mgAmount.maxValue">
														Enter an amount of $5-$10,000
													</li>
												</ul>
											</div>

											<div class="row align-middle">
												<div class="columns">
													<span>
														Optional donation to support Kiva
													</span>
												</div>

												<div class="small-6 medium-4 columns">
													<label
														class="show-for-sr"
														:class="{ 'error': $v.donation.$invalid }"
														for="amount"
													>
														Donation
													</label>
													<kv-currency-input
														class="text-input"
														id="donation"
														v-model="donation"
													/>
												</div>
											</div>
											<div class="row column align-middle">
												<ul class="text-right validation-errors" v-if="$v.donation.$invalid">
													<li v-if="!$v.donation.minValue || !$v.donation.maxValue">
														Enter an amount of $0-$10,000
													</li>
												</ul>
											</div>

											<div class="row">
												<div class="columns">
													<strong>Total/month</strong>
												</div>

												<div class="small-6 medium-4 columns">
													<strong
														class="additional-left-pad-currency"
													>{{ totalCombinedDeposit | numeral('$0,0.00') }}</strong>
												</div>
											</div>
											<div class="row column">
												<ul class="text-center validation-errors"
													v-if="!$v.mgAmount.maxTotal || !$v.donation.maxTotal"
												>
													<li>
														The maximum Auto Deposit total is $10,000.<br>
														Please try again by entering in a smaller amount.
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</fieldset>
						</form>
						<template slot="controls">
							<kv-button
								data-test="auto-deposit-save-button"
								class="smaller button"
								v-if="!isSaving"
								@click.native="saveAutoDeposit"
								:disabled="!isChanged || $v.$invalid"
							>
								Save
							</kv-button>
							<kv-button data-test="auto-deposit-save-button" class="smaller button" v-else>
								Saving <kv-loading-spinner />
							</kv-button>
						</template>
					</kv-lightbox>
				</div>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import KvButton from '@/components/Kv/KvButton';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';

const pageQuery = gql`query autoDepositPage {
	my {
		autoDeposit {
			amount
			donateAmount
			dayOfMonth
			isSubscriber
			status
		}
	}
}`;

export default {
	inject: ['apollo'],
	components: {
		KvButton,
		KvCurrencyInput,
		KvIcon,
		KvLightbox,
		KvLoadingSpinner,
		KvSettingsCard,
	},
	data() {
		return {
			isSaving: false,
			dayOfMonth: new Date().getDate(),
			donation: 0,
			mgAmount: 0,
			isAutoDepositSubscriber: false,
			showLightbox: false,
			isDayInputShown: false,
		};
	},
	mixins: [
		validationMixin,
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
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			});
		},
		result({ data }) {
			const autoDepositAmount = parseFloat(_get(data, 'my.autoDeposit.amount', 0));
			// eslint-disable-next-line max-len
			this.isAutoDepositSubscriber = !_get(data, 'my.autoDeposit.isSubscriber', false) && _get(data, 'my.autoDeposit.status', false);
			this.donation = parseFloat(_get(data, 'my.autoDeposit.donateAmount', 0));
			this.dayOfMonth = _get(data, 'my.autoDeposit.dayOfMonth');
			this.mgAmount = autoDepositAmount - this.donation;
		},
	},
	mounted() {
		// After initial value is loaded, setup watch to make form dirty on value changes
		this.$watch('mgAmount', () => {
			this.$v.$touch();
		});
		this.$watch('donation', () => {
			this.$v.$touch();
		});
		this.$watch('dayOfMonth', () => {
			this.$v.$touch();
		});
	},
	computed: {
		totalCombinedDeposit() {
			return this.donation + this.mgAmount;
		},
		isChanged() {
			return this.$v.$dirty;
		}
	},
	methods: {
		closeLightbox() {
			// this will trigger only when the lightbox is closed manually
			// not when it is closed via outside click or close button click
			this.$emit('unsaved-changes', true);
			this.showLightbox = false;
		},
		hideDayInput() {
			if (!this.$v.dayOfMonth.$invalid) {
				this.isDayInputShown = false;
			}
		},
		saveAutoDeposit() {
			this.isSaving = true;
			const updateAutoDepositSettings = this.apollo.mutate({
				mutation: gql`mutation updateAutoDeposit($amount: Money, $donateAmount: Money, $dayOfMonth: Int) {
					my {
						updateAutoDeposit( autoDeposit: {
							amount: $amount, donateAmount: $donateAmount, dayOfMonth: $dayOfMonth
						}) {
							amount donateAmount dayOfMonth
						}
					}
				}`,
				variables: {
					amount: this.totalCombinedDeposit,
					donateAmount: this.donation,
					dayOfMonth: this.dayOfMonth,
				}
			});
			return updateAutoDepositSettings.then(() => {
				this.$showTipMsg('Settings saved!');
			}).catch(e => {
				console.error(e);
				this.$showTipMsg('There was a problem saving your settings', 'error');
			}).finally(() => {
				this.isSaving = false;
				this.$emit('unsaved-changes', false);
				this.showLightbox = false;
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

form {
	margin-top: 2rem;

	.row {
		margin-bottom: 0.25em;
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

	.additional-left-pad-currency {
		padding-left: 0.65rem;
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

	::v-deep .loading-spinner {
		vertical-align: middle;
		width: 1rem;
		height: 1rem;
	}

	::v-deep .loading-spinner .line {
		background-color: $white;
	}

	.middle-wrapper {
		padding-left: 2rem;
		padding-right: 2rem;
		margin-bottom: 2rem;
	}
}
</style>
