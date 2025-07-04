import numeral from 'numeral';
import * as Sentry from '@sentry/vue';

import borrowerProfileSideSheetQuery from '#src/graphql/query/borrowerProfileSideSheet.graphql';
import loanCardBasketed from '#src/graphql/query/loanCardBasketed.graphql';
import updateLoanReservation from '#src/graphql/mutation/updateLoanReservation.graphql';

import { handleInvalidBasket, hasBasketExpired } from '#src/util/basketUtils';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import logReadQueryError from '#src/util/logReadQueryError';

export const HOME_BP_MODAL_EXP_KEY = 'home_page_bp_modal';

export default {
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			basketItems: [],
			isAdding: false,
			isBpModalEnabled: false,
			selectedLoan: undefined,
		};
	},
	methods: {
		loadBPData(loanId) {
			this.apollo.query({
				query: borrowerProfileSideSheetQuery,
				variables: {
					loanId
				}
			}).catch(e => {
				logReadQueryError(e, 'borrowerProfileSideSheetQuery');
			});
		},
		initializeIsBpModalEnabledExp(category) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				category,
				HOME_BP_MODAL_EXP_KEY,
				'EXP-MP-671-Dec2024',
			);
			if (version) {
				this.isBpModalEnabled = version === 'b';
			}
		},
		goToLink() {
			this.$kvTrackEvent('borrower-profile', 'go-to-old-bp', undefined, `${this.selectedLoan?.id}`);
			window.open(`lend/${this.selectedLoan?.id}`);
		},
		async loadInitialBasketItems() {
			try {
				const basketId = this.cookieStore.get('kvbskt');
				if (!basketId) {
					this.basketItems = [];
					return;
				}
				const { data } = await this.apollo.query({
					query: loanCardBasketed,
					variables: {
						id: 0, // dummy id since we only need basket data
						basketId
					},
					fetchPolicy: 'network-only'
				});
				this.basketItems = data?.shop?.basket?.items?.values || [];
			} catch (error) {
				console.error('Error loading initial basket items:', error);
				this.basketItems = [];
			}
		},
		addToBasket(lendAmount) {
			this.$kvTrackEvent(
				'Lending',
				'Add to basket',
				'lend-button-click',
				this.selectedLoan?.id,
				lendAmount
			);
			this.isAdding = true;
			this.apollo.mutate({
				mutation: updateLoanReservation,
				variables: {
					loanId: Number(this.selectedLoan?.id),
					price: numeral(lendAmount).format('0.00'),
				},
			}).then(({ errors }) => {
				if (errors) {
					// Handle errors from adding to basket
					errors.forEach(error => {
						try {
							this.$kvTrackEvent(
								'Lending',
								'Add-to-Basket',
								`Failed: ${error.message.substring(0, 40)}...`
							);
							Sentry.captureMessage(`Add to Basket: ${error.message}`);
							if (hasBasketExpired(error?.extensions?.code)) {
								// eslint-disable-next-line max-len
								this.$showTipMsg('There was a problem adding the loan to your basket, refreshing the page to try again.', 'error');
								return handleInvalidBasket({
									cookieStore: this.cookieStore,
									loan: {
										id: this.selectedLoan?.id,
										price: lendAmount
									}
								});
							}
							this.$showTipMsg(error.message, 'error');
						} catch (e) {
							// no-op
						}
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
					const basketId = this.cookieStore.get('kvbskt');
					return this.apollo.query({
						query: loanCardBasketed,
						variables: {
							id: this.selectedLoan?.id,
							basketId: basketId || undefined
						},
						fetchPolicy: 'network-only',
					}).then(({ data }) => {
						this.basketItems = data?.shop?.basket?.items?.values || [];
					});
				}
			}).catch(error => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
				this.$kvTrackEvent('Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
				Sentry.captureException(error);
			}).finally(() => {
				this.isAdding = false;
				this.handleCartModal();
			});
		},
	},
};
