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

			<!-- TODO: Move to own component -->
			<section class="campaign-loans row align-center">
				<div class="columns small-12" v-if="loans.length > 0">
					<div class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
						<loan-card-controller
							v-for="loan in loans"
							class="cards-loan-card"
							:items-in-basket="itemsInBasket"
							:is-visitor="isVisitor"
							:key="loan.id"
							:loan="loan"
							loan-card-type="LendHomepageLoanCard"
							@add-to-basket="addToBasket"
						/>
					</div>
					<kv-pagination
						v-if="totalCount > 0"
						:total="totalCount"
						:limit="limit"
						@page-change="pageChange"
					/>
					<div v-if="totalCount > 0" class="loan-count">
						{{ totalCount }} loans
					</div>
				</div>
				<div v-if="loadingLoans" class="campaign-loans__loading-loans">
					<kv-loading-overlay />
					<p>Loading loans...</p>
				</div>
			</section>

			<section class="campaign-checkout row align-center">
				<in-context-checkout
					:is-actively-logged-in="isActivelyLoggedIn"
					:loans="basketLoans"
					:donations="donations"
					:kiva-cards="kivaCards"
					:totals="basketTotals"
					:lightbox-closed="checkoutLightboxVisible"
					@complete-checkout="completeCheckout"
					@lightbox-closed="checkoutLightboxClosed"
				/>
			</section>
		</div>
	</www-page-minimal>
</template>

<script>
import gql from 'graphql-tag';
import _invokeMap from 'lodash/invokeMap';
import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';
import numeral from 'numeral';
import basicLoanQuery from '@/graphql/query/basicLoanData.graphql';
import { processPageContentFlat } from '@/util/contentfulUtils';
import { validateQueryParams, getPromoFromBasket } from '@/util/campaignUtils';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import { blueHeader, blueFooter } from '@/util/siteThemes';
import cookieStore from '@/util/cookieStore';
// import paginationMixin from '@/plugins/pagination-mixin';
import CampaignHeader from '@/components/ContentGroups/CampaignHeader';
import CampaignStatus from '@/components/ContentGroups/CampaignStatus';
import InContextCheckout from '@/pages/LandingPages/CorporateCampaign/InContextCheckout';
import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import KvPagination from '@/components/Kv/KvPagination';
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

const loansPerPage = 9;

// A map of functions to transform url query parameters to/from graphql variables.
// Each key in urlParamTransform is a url query parameter (e.g. the 'page' in ?page=2).
// Each value is then an object with the to/from functions to write/read the url parameter.
const urlParamTransform = {
	page: {
		to({ offset }) {
			const page = Math.floor(offset / loansPerPage) + 1;
			return page > 1 ? String(page) : undefined;
		},
		from({ page }) {
			const pagenum = Number(page) - 1;
			return { offset: pagenum > 0 ? loansPerPage * pagenum : 0 };
		}
	},
};

// Turn an object of graphql variables into an object of url query parameters
function toUrlParams(variables) {
	const loMap = _mapValues(urlParamTransform, ({ to }) => to(variables));
	return loMap;
}

// Turn an object of url query parameters into an object of graphql variables
function fromUrlParams(params) {
	return _merge({}, ..._invokeMap(urlParamTransform, 'from', params));
}

export default {
	inject: ['apollo', 'kvAuth0'],
	components: {
		CampaignHeader,
		CampaignStatus,
		InContextCheckout,
		WwwPageMinimal,
		LoanCardController,
		KvLoadingOverlay,
		KvPagination,
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
			loansPerPage,
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
			loadingLoans: false,
			loans: [],
			basketTotals: {},
			basketLoans: [],
			donations: [],
			kivaCards: [],
			totalCount: 0,
			itemsInBasket: [],
			isVisitor: true,
			offset: 0,
			limit: loansPerPage,
			pageQuery: { page: '1' },
			checkoutLightboxVisible: false,
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
			const filters = this.promoData.managedAccount?.loanSearchCriteria?.filters ?? {};
			return getSearchableFilters(filters);
		},
		urlParams() {
			return toUrlParams({
				offset: this.offset,
			});
		},
		lastLoanPage() {
			return Math.ceil(this.totalCount / this.limit);
		},
		loanIds() {
			// return this.loans.length ? this.loans.map(loan => loan.id) : [];
			return this.loans.map(loan => loan.id) || [];
		},
		loanQueryVars() {
			return {
				limit: this.limit,
				offset: this.offset,
				filters: this.filters,
				promoOnly: { basketId: cookieStore.get('kvbskt') }
			};
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
				this.activateLoanWatchQuery();
				this.updateBasketState();
			});
		},
		activateLoanWatchQuery() {
			const observer = this.apollo.watchQuery({
				query: basicLoanQuery,
				variables: this.loanQueryVars
			});
			this.$watch(() => this.loanQueryVars, vars => {
				observer.setVariables(vars);
			}, { deep: true });
			// Subscribe to the observer to see each result
			observer.subscribe({
				next: ({ data, loading }) => {
					if (loading) {
						this.loadingLoans = true;
					} else {
						this.loans = data.lend?.loans?.values ?? [];
						this.totalCount = data.lend?.loans?.totalCount ?? 0;
						const basketItems = data.shop?.basket?.items?.values ?? [];
						this.itemsInBasket = basketItems.length ? basketItems.map(item => item.id) : [];
						// console.log(this.loans.length, this.pageQuery.page);
						this.checkIfPageIsOutOfRange(this.loans.length, this.pageQuery.page);
						this.loadingLoans = false;
					}
				}
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
					this.checkoutLightboxVisible = true;
					this.setAuthStatus(this.kvAuth0?.user ?? {});
				}).catch(errorResponse => {
					console.error(errorResponse);
					return false;
				});
		},
		checkoutLightboxClosed(context) {
			console.log('checkout lightbox closed', context);
			this.checkoutLightboxVisible = false;
		},
		completeCheckout() {
			console.log('checkout');
		},

		setAuthStatus(userState) {
			if (typeof userState !== 'undefined' && userState !== null) {
				this.lastActiveLogin = userState['https://www.kiva.org/last_login'] || 0;
				this.myId = userState['https://www.kiva.org/kiva_id'] || null;
			}
			// covers popup login
			// this.logBasketState();
		},

		// Pagination Related methods
		checkIfPageIsOutOfRange(loansArrayLength, pageQueryParam) {
			// determines if the page query param is for a page that is out of bounds.
			// if it is, changes page to the last page and displays a tip message
			const loansOutOfRange = loansArrayLength === 0 && pageQueryParam;
			if (loansOutOfRange) {
				// eslint-disable-next-line max-len
				this.$showTipMsg(`There are currently ${this.lastLoanPage} pages of results. We’ve loaded the last page for you.`);
				this.pageChange(this.lastLoanPage);
			}
		},
		pageChange(number) {
			const offset = loansPerPage * (number - 1);
			this.offset = offset;
			this.pushChangesToUrl();
		},
		updateFromParams(query) {
			const { offset } = fromUrlParams(query);
			this.offset = offset;
		},
		pushChangesToUrl() {
			const { page } = this.$route?.query ?? { page: '0' };
			if (page !== this.urlParams.page) {
				this.$router.push({
					query: {
						...this.$route.query,
						...this.urlParams
					}
				});
			}
		},
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.updateFromParams(to.query);
		});
	},
	beforeRouteUpdate(to, from, next) {
		this.updateFromParams(to.query);
		next();
	},
};
</script>

<style lang="scss">
@import 'settings';

$card-width: rem-calc(290);
$max-card-width: rem-calc(330);
$card-margin: rem-calc(14);
$card-half-space: rem-calc(14/2);

.campaign-loans {
	position: relative;
	background-color: rgba(0, 0, 0, 0.0125);
	padding: 3rem 0;

	.loan-card-group {
		display: flex;
		justify-content: center;
	}

	.cards-loan-card {
		border-radius: 0.65rem;
		box-shadow: 0 0.65rem $card-margin $card-half-space rgb(153, 153, 153, 0.1);
		width: $card-width;
		max-width: $max-card-width;
		flex: 1 0 auto;
		margin: $card-margin;
	}

	.loan-count {
		text-align: center;
	}
}

.basket-bar {
	display: none;
}

</style>
