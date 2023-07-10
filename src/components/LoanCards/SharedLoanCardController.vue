<template>
	<div>
		<kv-classic-loan-card
			:loan-id="loanId"
			:loan="loan"
			:custom-loan-details="customLoanDetails"
			:use-full-width="useFullWidth"
			:show-tags="showTags"
			:category-page-name="categoryPageName"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:large-card="largeCard"
			:is-adding="isAdding"
			:is-visitor="isVisitor"
			:basket-items="basketItems"
			:is-bookmarked="isBookmarked"
			:kv-track-function="$kvTrackEvent"
			:photo-path="PHOTO_PATH"
			:show-view-loan="showViewLoan"
			:external-links="true"
			:route="currentRoute"
			:user-balance="userBalance"
			:get-cookie="getCookie"
			:set-cookie="setCookie"
			@toggle-bookmark="toggleBookmark"
			@add-to-basket="addToBasket"
		/>
	</div>
</template>

<script>
import * as Sentry from '@sentry/vue';
import { gql } from '@apollo/client';
import { setLendAmount, handleInvalidBasket, hasBasketExpired } from '@/util/basketUtils';
import { readLoanFragment, watchLoanData } from '@/util/loanUtils';
import bookmarkLoan from '@/util/bookmarkUtil';
import logFormatter from '@/util/logFormatter';
import { createIntersectionObserver } from '@/util/observerUtils';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import loanCardFieldsExtendedFragment from '@/graphql/fragments/loanCardFieldsExtended.graphql';
import KvClassicLoanCard from '~/@kiva/kv-components/vue/KvClassicLoanCard';

const PHOTO_PATH = 'https://www-kiva-org.freetls.fastly.net/img/';

const loanQuery = gql`
	${loanCardFieldsExtendedFragment}
	query kcBasicLoanCard($basketId: String, $loanId: Int!) {
	shop (basketId: $basketId) {
		id
		basket {
			id
			# for isInBasket
			items {
				values {
					id
				}
			}
		}
	}
	lend {
		loan(id: $loanId) {
			id
			...loanCardFieldsExtended
		}
	}
	my {
		id
		userAccount {
			id
		}
	}
}`;

export default {
	name: 'SharedLoanCardController',
	props: {
		loanId: {
			type: Number,
			required: true,
		},
		customLoanDetails: {
			type: Boolean,
			default: false
		},
		useFullWidth: {
			type: Boolean,
			default: false
		},
		showTags: {
			type: Boolean,
			default: false
		},
		categoryPageName: {
			type: String,
			default: '',
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		enableMoreCta: {
			type: Boolean,
			default: false
		},
		largeCard: {
			type: Boolean,
			default: false
		},
		userBalance: {
			type: String,
			default: undefined
		},
		showViewLoan: {
			type: Boolean,
			default: false
		},
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [percentRaisedMixin, timeLeftMixin],
	components: {
		KvClassicLoanCard
	},
	data() {
		return {
			loan: null,
			basketItems: null,
			isLoading: true,
			queryObserver: null,
			viewportObserver: null,
			isAdding: false,
			loanCallouts: undefined,
			isVisitor: true,
			isBookmarked: false,
			currentRoute: {},
			PHOTO_PATH,
		};
	},
	methods: {
		createViewportObserver() {
			// Watch for this element being in the viewport
			this.viewportObserver = createIntersectionObserver({
				targets: [this.$el],
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === this.$el && entry.intersectionRatio > 0) {
							// This element is in the viewport, so load the data.
							this.loadData();
						}
					});
				}
			});
			if (!this.viewportObserver) {
				// Observer was not created, so call loadData right away as a fallback.
				this.loadData();
			}
		},
		destroyViewportObserver() {
			if (this.viewportObserver) {
				this.viewportObserver.disconnect();
			}
		},
		loadData() {
			if (!this.queryObserver) {
				this.queryObserver = watchLoanData({
					apollo: this.apollo,
					cookieStore: this.cookieStore,
					loanId: this.loanId,
					loanQuery,
					callback: result => this.processQueryResult(result),
				});
			}
		},
		processQueryResult(result) {
			if (result.error) {
				console.error(result.error);
				this.$showTipMsg('There was a problem loading your loan recommendations', 'error');
				try {
					Sentry.withScope(scope => {
						scope.setTag('wizard_stage', 'results');
						scope.setTag('loan_id', this.loanId);
						Sentry.captureException(result.error);
					});
				} catch (e) {
					// no-op
				}
			}

			this.isVisitor = !result.data?.my?.userAccount?.id ?? true;

			// Some pages initially show loading cards without loan IDs
			if (result.data?.lend?.loan) {
				this.loan = result.data.lend.loan;

				this.isLoading = false;
			}

			this.basketItems = result.data?.shop?.basket?.items?.values || null;
		},
		addToBasket(lendAmount) {
			this.isAdding = true;
			return setLendAmount({
				amount: lendAmount,
				apollo: this.apollo,
				loanId: this.loanId,
			}).then(() => {
				this.isAdding = false;
				this.$emit('add-to-basket', { loanId: this.loanId, success: true });
				this.$kvTrackEvent(
					'loan-card',
					'add-to-basket',
					null,
					this.loanId,
					this.lessThan25 ? this.amountLeft : 25
				);
			}).catch(e => {
				this.$emit('add-to-basket', { loanId: this.loanId, success: false });
				const msg = e?.[0]?.extensions?.code === 'reached_anonymous_basket_limit'
					? e?.[0]?.message
					: 'There was a problem adding the loan to your basket';
				this.$kvTrackEvent('Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
				Sentry.captureException(e);
				// Handle errors from adding to basket
				if (hasBasketExpired(e?.[0]?.extensions?.code)) {
					// eslint-disable-next-line max-len
					this.$showTipMsg('There was a problem adding the loan to your basket, refreshing the page to try again.', 'error');
					return handleInvalidBasket({
						cookieStore: this.cookieStore,
						loan: {
							id: this.loanId,
							price: lendAmount
						}
					});
				}
				this.$showTipMsg(msg, 'error');
				this.isAdding = false;
			});
		},
		toggleBookmark() {
			if (!this.loanId) return;

			// Set bookmark optimistically
			this.isBookmarked = !this.isBookmarked;

			bookmarkLoan(this.loanId, this.isBookmarked)
				.then(() => {
					this.$kvTrackEvent(
						'Lending',
						'Loan Favorite Toggled',
						this.isBookmarked ? 'Favorite Loan Added' : 'Loan Favorite Removed',
						this.isBookmarked,
					);
				}).catch(error => {
					logFormatter(error, 'error');

					this.$kvTrackEvent('Lending', 'Loan Favorite Toggled', 'Failed to toggle favorite.');

					// Error occurred, change bookmark back due to failure
					this.isBookmarked = !this.isBookmarked;
				});
		},
		getCookie(name) {
			return this.cookieStore.get(name);
		},
		setCookie(name, value, options) {
			return this.cookieStore.set(name, value, options);
		}
	},
	mounted() {
		if (this.loan) {
			// Already have a loan, so only setup watch query to handle changes in data
			this.loadData();
		} else {
			// Don't have a loan yet, so setup viewport observer to prepare async loading
			this.createViewportObserver();
		}

		// get route object
		this.currentRoute = this.$route;
	},
	beforeDestroy() {
		this.destroyViewportObserver();
	},
	created() {
		// Use cached loan data if it exists
		const cachedLoan = readLoanFragment({
			apollo: this.apollo,
			loanId: this.loanId,
			fragment: loanCardFieldsExtendedFragment,
		});
		if (cachedLoan) {
			this.loan = cachedLoan;
			this.isLoading = false;
		}
	},
	watch: {
		// When loan id changes, update watch query variables
		loanId(loanId) {
			if (this.queryObserver) {
				this.queryObserver.setVariables({
					basketId: this.cookieStore.get('kvbskt'),
					loanId,
				});
			}
		},
	},
};
</script>
