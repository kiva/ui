<template>
	<www-page class="instant-lending-processor kv-tailwind">
		<kv-page-container class="
			tw-pt-4 tw-pb-8
			md:tw-pt-6 md:tw-pb-12
			lg:tw-pt-8 lg:tw-pb-1"
		>
			<kv-grid class="tw-grid-cols-12">
				<div class="
					tw-col-span-12
					md:tw-col-span-10 lg:tw-col-span-8
					md:tw-col-start-2 lg:tw-col-start-3
					tw-text-center"
				>
					<div
						v-if="loanNotFound || tokenValidationFailed"
						class=""
					>
						<template v-if="loanNotFound">
							<h1>We couldn't find that loan.</h1>
							<p>This loan may have already been funded.</p>
							<kv-button
								to="/lend-by-category"
								v-kv-track-event="['Instant Lending', 'click-Find-another-loan', 'Find another loan']"
							>
								Find another loan
							</kv-button>
						</template>
						<template v-else-if="tokenValidationFailed">
							<h1>Validation of your unique email link failed.</h1>
							<kv-button
								to="/lend-by-category"
								v-kv-track-event="['Instant Lending', 'click-Find-another-loan', 'Find another loan']"
							>
								Find another loan
							</kv-button>
						</template>
					</div>
					<div v-else>
						<h1>Adding loan to basket</h1>
						{{ loanId }} | {{ lendAmount }}
						<div v-if="!showError" class="tw-flex tw-justify-center">
							<kv-loading-spinner
								class="tw-my-auto tw-mb-3"
							/>
						</div>
						<div v-else>
							<p>Another lender has selected this loan. Please choose a different borrower to support.</p>
							<kv-button
								to="/lend-by-category"
								v-kv-track-event="['Instant Lending', 'click-Find-another-loan', 'Find another loan']"
							>
								Find another loan
							</kv-button>
						</div>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import numeral from 'numeral';
import * as Sentry from '@sentry/vue';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvLoadingSpinner from '~/@kiva/kv-components/vue/KvLoadingSpinner';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
// import logFormatter from '@/util/logFormatter';

export default {
	inject: ['apollo'],
	components: {
		KvButton,
		KvGrid,
		KvLoadingSpinner,
		KvPageContainer,
		WwwPage
	},
	metaInfo: {
		title: 'Processing Instant Lending'
	},
	props: {
		errorType: {
			type: String,
			default: ''
		},
		loanId: {
			type: Number,
			default: 0
		},
		lendAmount: {
			type: Number,
			default: 25
		},
	},
	data() {
		return {
			errorCode: this.$route.query.error,
			errorDescription: this.$route.query.error_description,
			loading: false,
			loanAdded: false,
			showError: false
		};
	},
	computed: {
		loanNotFound() {
			return this.errorType === 'loan-not-found';
		},
		tokenValidationFailed() {
			return this.errorType === 'token-validation-failed';
		}
	},
	methods: {
		addToBasket() {
			this.loading = true;
			this.apollo.mutate({
				mutation: updateLoanReservation,
				variables: {
					loanid: this.loanId,
					price: numeral(this.lendAmount).format('0.00'),
				},
			}).then(({ errors }) => {
				console.error(JSON.stringify(errors));
				if (errors.length) {
					// Handle errors from adding to basket
					errors.forEach(error => {
						// this.$showTipMsg(error.message, 'error');
						console.error(JSON.stringify(error));
						try {
							this.$kvTrackEvent(
								'Instant Lending',
								'Add-to-Basket',
								`Failed: ${error.message.substring(0, 40)}...`
							);
							Sentry.captureMessage(`Add to Basket: ${error.message}`);
						} catch (e) {
							// no-op
						}
						this.showError = true;
					});
				} else {
					try {
						// track facebook add to basket
						if (typeof window !== 'undefined' && typeof fbq === 'function') {
							window.fbq('track', 'AddToCart', { content_category: 'Loan' });
						}
					} catch (e) {
						console.error(e);
					}
					this.loanAdded = true;
				}
			}).catch(error => {
				console.error(JSON.stringify(error));
				// this.$showTipMsg('Failed to add loan. Please try again.', 'error');
				this.$kvTrackEvent('Instant Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
				Sentry.captureException(error);
			}).finally(() => {
				this.loading = false;
			});
		},
	},
	mounted() {
		// check for loan id, attempt to add to basket
		if (this.loanId !== 0) {
			this.addToBasket();
		}

		// logFormatter(
		// 	`Auth0 authentication error: ${this.errorCode}: ${this.errorDescription}`,
		// 	'warn',
		// 	{ ...this.$route.query }
		// );
	},
};
</script>
