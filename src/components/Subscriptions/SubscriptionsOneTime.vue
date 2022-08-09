<template>
	<div class="row">
		<kv-settings-card class="column large-8" title="Global COVID-19 Response Lending">
			<template #content>
				<p>
					Thank you for supporting those affected by COVID-19. Your deposit of <kv-button
						class="text-link"
						@click.native.prevent="showLightbox = true;"
					>
						{{ totalCombinedDeposit | numeral('$0,0.00') }}
					</kv-button> will occur within one hour,
					after which you will be unable to cancel.
				</p>
				<p>
					<kv-button
						class="text-link"
						@click.native.prevent="$emit('cancel-subscription')"
					>
						Cancel Contribution
					</kv-button>
				</p>
				<kv-lightbox
					class="one-time-settings-lightbox"
					:visible="showLightbox"
					title="Change your contribution"
					@lightbox-closed="closeLightbox"
				>
					<form
						@submit.prevent
						novalidate
					>
						<div class="row align-center tw-text-left">
							<div class="small-12 columns">
								<div class="row align-middle">
									<div class="columns">
										<span>
											Deposit for lending
										</span>
									</div>

									<div class="small-6 medium-4 columns">
										<label
											class="tw-sr-only"
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
									<ul class="tw-text-right validation-errors" v-if="$v.mgAmount.$invalid">
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
											class="tw-sr-only"
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
									<ul class="tw-text-right validation-errors" v-if="$v.donation.$invalid">
										<li v-if="!$v.donation.minValue || !$v.donation.maxValue">
											Enter an amount of $0-$10,000
										</li>
									</ul>
								</div>

								<div class="row">
									<div class="columns">
										<strong>Total</strong>
									</div>

									<div class="small-6 medium-4 columns">
										<strong
											class="additional-left-pad-currency"
										>{{ totalCombinedDeposit | numeral('$0,0.00') }}</strong>
									</div>
								</div>
								<div class="row column">
									<ul
										class="tw-text-center validation-errors"
										v-if="!$v.mgAmount.maxTotal || !$v.donation.maxTotal"
									>
										<li>
											The maximum Contribution total is $10,000.<br>
											Please try again by entering in a smaller amount.
										</li>
									</ul>
								</div>
							</div>
						</div>
					</form>
					<template #controls>
						<kv-button
							data-test="one-time-save-button"
							class="smaller button"
							v-if="!isSaving"
							@click.native="saveOneTime"
							:disabled="!isChanged || $v.$invalid"
						>
							Save
						</kv-button>
						<kv-button data-test="one-time-save-button" class="smaller button" v-else>
							Saving <kv-loading-spinner />
						</kv-button>
					</template>
				</kv-lightbox>
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
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';

const pageQuery = gql`query oneTimeSubscription {
	my {
		autoDeposit {
			id
			amount
			donateAmount
		}
	}
}`;

export default {
	name: 'SubscriptionsOneTime',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvButton,
		KvCurrencyInput,
		KvLightbox,
		KvLoadingSpinner,
		KvSettingsCard,
	},
	data() {
		return {
			isSaving: false,
			donation: 0,
			mgAmount: 0,
			showLightbox: false,
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
			this.donation = parseFloat(_get(data, 'my.autoDeposit.donateAmount', 0));
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
			// This will not trigger when lightbox is closed after saving
			this.$emit('unsaved-changes', true);
			this.showLightbox = false;
		},
		saveOneTime() {
			this.isSaving = true;
			const updateOneTimeSettings = this.apollo.mutate({
				mutation: gql`mutation updateAutoDeposit($amount: Money, $donateAmount: Money) {
					my {
						updateAutoDeposit( autoDeposit: {
							amount: $amount, donateAmount: $donateAmount
						}) {
							id amount donateAmount
						}
					}
				}`,
				variables: {
					amount: this.totalCombinedDeposit,
					donateAmount: this.donation,
				}
			});
			return updateOneTimeSettings.then(() => {
				this.$showTipMsg('Contribution saved!');
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

	// styles to match KvSelect
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

	.text-input,
	.validation-errors {
		margin: 0;
	}

	::v-deep .loading-spinner {
		vertical-align: middle;
		width: 1rem;
		height: 1rem;
	}

	::v-deep .loading-spinner .line {
		background-color: $white;
	}
}
</style>
