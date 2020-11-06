<template>
	<www-page-minimal
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div class="corporate-campaign-landing">
			<campaign-header :header-area-content="headerAreaContent" />

			<campaign-status
				:loading-promotion="loadingPromotion"
				:promo-error-message="promoErrorMessage"
				:promo-applied="promoApplied"
				:promo-amount="promoAmount"
			/>

			<campaign-loan-display
				id="campaignLoanDisplay"
				ref="loandisplayref"
				:checkout-visible="checkoutVisible || showThanks"
				:filters="filters"
				:is-visitor="isVisitor"
				:items-in-basket="itemsInBasket"
				@add-to-basket="addToBasket"
			/>

			<section v-if="checkoutVisible" class="campaign-checkout section row align-center">
				<div class="small-12 large-8 align-self-middle columns">
					<in-context-checkout
						:is-actively-logged-in="isActivelyLoggedIn"
						:loans="basketLoans"
						:donations="donations"
						:kiva-cards="kivaCards"
						:totals="basketTotals"
						:show-donation="false"
						:auto-redirect-to-thanks="false"
						@transaciton-complete="transactionComplete"
					/>
				</div>
			</section>

			<section v-if="showThanks" class="campaign-thanks section row align-center">
				<campaign-thanks :transaction-id="transactionId" />
			</section>
		</div>
	</www-page-minimal>
</template>

<script>
import gql from 'graphql-tag';
import numeral from 'numeral';
import { processPageContentFlat } from '@/util/contentfulUtils';
import { validateQueryParams, getPromoFromBasket } from '@/util/campaignUtils';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import { blueHeader, blueFooter } from '@/util/siteThemes';
import cookieStore from '@/util/cookieStore';
// import paginationMixin from '@/plugins/pagination-mixin';
import CampaignHeader from '@/components/ContentGroups/CampaignHeader';
import CampaignStatus from '@/components/ContentGroups/CampaignStatus';
import CampaignLoanDisplay from '@/components/ContentGroups/CampaignLoanDisplay';
import InContextCheckout from '@/components/Checkout/InContext/InContextCheckout';
import CampaignThanks from '@/components/ContentGroups/CampaignThanks';
import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';
// import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import { getSearchableFilters } from '@/api/fixtures/LoanSearchFilters';

const pageQuery = gql`query pageContent($basketId: String!, $contentKey: String) {
	contentful {
		entries(contentType: "page", contentKey: $contentKey)
	}
	shop(basketId: $basketId) {
		id
		basket {
			id
			hasFreeCredits
		}
		lendingRewardOffered
	}
	my {
		userAccount {
			id
		}
	}
}`;

// Query to gather credits and promo id from latest basket state
const basketItemsQuery = gql`query basketItemsQuery(
	$basketId: String!,
) {
	shop(basketId: $basketId) {
		id
		basket {
			id
			hasFreeCredits
			items {
				totalCount
				values {
					basketItemType
					creditsUsed {
						amount
						applied
						available
						creditType
						id
						promoFund {
							id
						}
					}
					id
					price
					... on LoanReservation {
						expiryTime
						isEndingSoon
						donateRepayments
						loan {
							id
							name
							use
							status
							matchingText
							loanAmount
							plannedExpirationDate
							sector {
								id
								name
							}
							activity {
								id
								name
							}
							geocode {
								country {
									name
									isoCode
								}
							}
							loanFundraisingInfo {
								isExpiringSoon
								fundedAmount
								reservedAmount
							}
							image {
								id
								url: url (presetSize: loan_thumbnail)
								url_2x: url (presetSize: loan_thumbnail_retina)
							}
							... on LoanDirect {
								sponsor_name: trusteeName
							}
							... on LoanPartner {
								sponsor_name: partnerName
							}
						}
						team {
							id
							name
						}
					}
					... on Donation {
						isTip
						isUserEdited
					}
					... on KivaCard {
						id
						price
						idsInGroup
						quantity
						individualPrice
						kivaCardObject {
							deliveryType
							recipient {
								name
								email
								scheduledDeliveryDate
							}
							mailingInfo {
								firstName
								lastName
								address
								city
								state
								zip
							}
						}
					}
				}
			}
			credits {
				values {
					id
					applied
					available
					creditType
					promoFund {
						id
					}
				}
			}
			totals {
				creditAmountNeeded
				creditAvailableTotal
				creditAppliedTotal
				donationTotal
				itemTotal
				loanReservationTotal
			}
		}
	}
}`;

export default {
	inject: ['apollo', 'kvAuth0'],
	components: {
		CampaignHeader,
		CampaignLoanDisplay,
		CampaignStatus,
		CampaignThanks,
		InContextCheckout,
		WwwPageMinimal,
	},
	mixins: [
		checkoutUtils
	],
	// mixins: [paginationMixin],
	props: {
		dynamicRoute: {
			type: String,
			default: ''
		},
		upc: {
			type: String,
			default: ''
		},
		promoCode: {
			type: String,
			default: ''
		},
		lendingReward: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			// loansPerPage,
			headerTheme: blueHeader,
			footerTheme: blueFooter,
			rawPageData: null,
			pageData: null,
			hasFreeCredits: null,
			lendingRewardOffered: null,
			promoApplied: null,
			promoErrorMessage: null,
			promoData: null,
			lastActiveLogin: 0,
			myId: null,
			activeLoginDuration: 3600,
			currentTime: Date.now(),
			currentTimeInterval: null,
			loadingPromotion: false,
			// loadingLoans: false,
			loans: [],
			basketTotals: {},
			basketLoans: [],
			donations: [],
			kivaCards: [],
			totalCount: 0,
			itemsInBasket: [],
			isVisitor: true,
			offset: 0,
			// limit: loansPerPage,
			pageQuery: { page: '1' },
			checkoutVisible: false,
			showThanks: false,
			transactionId: null,
		};
	},
	metaInfo() {
		return {
			title: `${this.pageTitle}`,
		};
	},
	apollo: {
		preFetch: true,
		query: pageQuery,
		// TODO: Convert to prefetch function and check for page path before fetching all content
		// - Requires extended contentful graphql query options for include depth and query by addtional fields
		preFetchVariables({ route }) {
			return { contentKey: route.params.dynamicRoute };
		},
		variables() {
			return { contentKey: this.$route.params.dynamicRoute };
		},
		result({ data }) {
			// extract dynamicRoute param for contentful query
			const { dynamicRoute } = this.$route.params;
			// redirect if missing page data and/or route
			if (typeof dynamicRoute === 'undefined') {
				this.$router.push('/');
			}
			this.rawPageData = data;
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;

			this.lendingRewardOffered = data.shop?.lendingRewardOffered ?? false;
			this.hasFreeCredits = data.shop?.basket?.hasFreeCredits ?? false;
			const basketItems = data.shop?.basket?.items?.values ?? [];
			this.itemsInBasket = basketItems.length ? basketItems.map(item => item.id) : [];
			this.isVisitor = !data.my?.userAccount?.id ?? true;
		}
	},
	created() {
		// extract query
		this.pageQuery = this.$route.query;
	},
	mounted() {
		// console.log('raw page data: ', this.rawPageData);
		// console.log('page data: ', this.pageData);

		if (Object.keys(this.$route.query).length) {
			this.applyPromotion();
		}
	},
	computed: {
		pageTitle() {
			// TODO: add field on Contentful Page for this
			return this.pageData?.page?.pageLayout?.name;
		},
		headerAreaContent() {
			return this.pageData?.page?.contentGroups?.promoCampaignTestCg;
		},
		promoAmount() {
			return this.promoData?.promoFund?.promoPrice ?? null;
		},
		filters() {
			const filters = this.promoData?.managedAccount?.loanSearchCriteria?.filters ?? {};
			// if (!Object.keys(filters).length) return {};
			return getSearchableFilters(filters);
		},
		isActivelyLoggedIn() {
			const lastLogin = (parseInt(this.lastActiveLogin, 10)) || 0;
			if (lastLogin + (this.activeLoginDuration * 1000) > this.currentTime) {
				return true;
			}
			return false;
		},
	},
	methods: {
		applyPromotion() {
			this.loadingPromotion = true;
			// establish promotion state
			const applyPromo = validateQueryParams(this.$route.query, this.apollo);
			// handle applied promo state
			applyPromo.then(result => {
				// failed to apply promotion
				if (result.errors) {
					this.promoErrorMessage = result.errors[0].message;
					this.promoApplied = false;
				} else {
					this.promoApplied = true;
					// gather promo info
					this.getPromoInformationFromBasket();
				}
				this.loadingPromotion = false;
			}).catch(error => {
				console.error(error);
				this.loadingPromotion = false;
			});
		},
		getPromoInformationFromBasket() {
			const basketItems = this.apollo.query({
				query: basketItemsQuery,
				variables: {
					basketId: cookieStore.get('kvbskt')
				}
			});

			// TEMPORARY Handling for patched in basket credits
			// TODO Extract as utility to get promo id from basket credits
			basketItems.then(({ data }) => {
				console.log(data);

				if (typeof data.shop === 'undefined') {
					console.error('missing shop basket');
					return false;
				}

				const credits = data.shop?.basket?.credits?.values;
				const targetPromo = credits.filter(credit => {
					return credit.promoFund ? Object.keys(credit.promoFund).length > 0 : false;
				});
				// Primary PromoCampaign Query
				// Future usage will not require the promoFundId relying only on the basket id
				return getPromoFromBasket(targetPromo[0].promoFund?.id, this.apollo);
			}).then(response => {
				// TODO Handle response and any potential errors
				this.promoData = response.data?.shop?.promoCampaign;
				// Initialize loan query + observer
				// this.activateLoanWatchQuery();
				this.$refs.loandisplayref.activateLoanWatchQuery();
				this.updateBasketState();
			});
		},
		addToBasket() {
			// Query to update basket state
			this.updateBasketState();
		},
		updateBasketState() {
			const basketItems = this.apollo.query({
				query: basketItemsQuery,
				variables: {
					basketId: cookieStore.get('kvbskt')
				},
				fetchPolicy: 'network-only',
			});
			basketItems.then(({ data }) => {
				// Validate baseline promo + basket state (1 loan, 1 credit, 0 donation)
				this.validatePromoBasketState(data);
				const basketItemValues = data.shop?.basket?.items?.values ?? [];
				this.itemsInBasket = basketItemValues.length ? basketItemValues.map(item => item.id) : [];
			});
		},
		validatePromoBasketState(basketState) {
			console.log(basketState);
			// TEMPORARY Simplified Validation
			this.basketTotals = basketState.shop?.basket?.totals ?? {};
			// Check number of items 1
			// check basket totals (credits available 25, credits applied 25, donation 0, balance due 0)
			const {
				creditAmountNeeded,
				creditAvailableTotal,
				creditAppliedTotal,
				donationTotal,
				itemTotal,
				loanReservationTotal
			} = this.basketTotals;

			// TODO: Log or notify for any of the following conditions
			if (numeral(donationTotal).value() > 0) {
				return false;
			}

			if (numeral(creditAmountNeeded).value() > 0) {
				return false;
			}

			// TODO: Refine and document narrow in-context checkout conditions
			// TODO: Handle complex checkout scenarios
			if (numeral(creditAppliedTotal).value() !== numeral(loanReservationTotal).value()
				|| numeral(itemTotal).value() !== numeral(loanReservationTotal).value()
				|| numeral(creditAvailableTotal).value() !== numeral(loanReservationTotal).value()) {
				return false;
			}

			const basketItems = basketState.shop?.basket?.items?.values ?? [];
			// eslint-disable-next-line no-underscore-dangle
			this.basketLoans = basketItems.filter(item => item.__typename === 'LoanReservation');
			// eslint-disable-next-line no-underscore-dangle
			this.donations = basketItems.filter(item => item.__typename === 'Donation');
			// eslint-disable-next-line no-underscore-dangle
			this.kivaCards = basketItems.filter(item => item.__typename === 'KivaCard');

			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus !== true) {
						console.error(validationStatus);
						// validation failed
						// this.showCheckoutError(validationStatus);
					}
					// Present OVERLAY checkout completion option if baseline
					// TEMPORARY: Obstruct ability to click the "Checkout" button on the loan card to prevent redirect
					this.checkoutVisible = true;
					this.setAuthStatus(this.kvAuth0?.user ?? {});
				}).catch(errorResponse => {
					console.error(errorResponse);
					return false;
				});
		},

		transactionComplete(payload) {
			console.log('transaction complete', payload);
			this.transactionId = payload.transactionId;
			this.checkoutVisible = false;
			this.showThanks = true;
		},

		setAuthStatus(userState) {
			if (typeof userState !== 'undefined' && userState !== null) {
				this.lastActiveLogin = userState['https://www.kiva.org/last_login'] || 0;
				this.myId = userState['https://www.kiva.org/kiva_id'] || null;
			}
			// covers popup login
			// this.logBasketState();
		},
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.$refs.loandisplayref.updateFromParams(to.query);
		});
	},
	beforeRouteUpdate(to, from, next) {
		this.$refs.loandisplayref.updateFromParams(to.query);
		next();
	},
};
</script>

<style lang="scss">
@import 'settings';

.corporate-campaign-landing {
	.campaign-checkout,
	.campaign-thanks {
		padding: 3rem 0;
	}
}

.basket-bar {
	display: none;
}
</style>
