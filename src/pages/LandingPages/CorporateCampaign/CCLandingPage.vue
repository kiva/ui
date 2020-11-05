<template>
	<www-page-minimal
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div class="corporate-campaign-landing">
			<section class="campaign-header section row align-center">
				<div class="small-12 medium-10 large-6 xlarge-5 small-order-2 large-order-1 columns">
					<no-click-loan-card />
				</div>
				<!-- eslint-disable-next-line max-len -->
				<div class="small-10 large-6 xlarge-7 small-order-1 large-order-2 align-self-middle columns campaign-header__cta_wrapper">
					<div v-if="headerLogo.url" class="campaign-header__logo">
						<img :title="headerLogo.title" :src="headerLogo.url">
					</div>
					<hr v-if="headerLogo.url">
					<h1 class="campaign-header__header">
						{{ headline }}
					</h1>
					<div class="campaign-header__body" v-html="bodyCopy"></div>
					<a
						class="campaign-header__cta"
						@click.prevent="jumpToLoans"
						v-kv-track-event="[
							'Campaign',
							'click-hero-cta',
							'Find someone to lend to',
						]"
					>
						Find someone to lend to &xrarr;
					</a>
				</div>
			</section>

			<section class="campaign-status section">
				<div class="row campaign-status__border">
					<div v-if="loadingPromotion" class="campaign-status__validating-promo">
						<kv-loading-overlay />
						<p>Validating Promotion...</p>
					</div>

					<div v-if="promoErrorMessage" class="small-12 columns campaign-status__error-text-container">
						<span class="message-content text-center">
							<div class="icon-wrapper">
								<kv-icon name="error" />
							</div>
							<p class="message">{{ promoErrorMessage }}</p>
						</span>
					</div>

					<div v-if="promoApplied" class="small-12 large-6 columns campaign-status__text-container">
						<h3 class="campaign-status__header">
							How it works:
						</h3>
						<ul>
							<li>Choose your borrower below.</li>
							<li>Click "Add to basket"</li>
							<li>Click "Checkout" to complete your loan</li>
						</ul>
					</div>
					<div v-if="promoApplied" class="small-12 large-6 columns campaign-status__text-container">
						<h3 class="campaign-status__header">
							Find your first <br>borrower
						</h3>
						<p class="campaign-status__body">
							You have ${{ promoAmount | numeral }} to lend!
						</p>
					</div>
				</div>
			</section>

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
					<kv-pagination v-if="totalCount > 0" :total="totalCount" :limit="limit" @page-change="pageChange" />
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
import { lightHeader, lightFooter } from '@/util/siteThemes';
import cookieStore from '@/util/cookieStore';
// import paginationMixin from '@/plugins/pagination-mixin';
import InContextCheckout from '@/pages/LandingPages/CorporateCampaign/InContextCheckout';
import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';
import NoClickLoanCard from '@/components/Homepage/LendByCategory/NoClickLoanCard';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
// import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
// import KvLightbox from '@/components/Kv/KvLightbox';
import KvPagination from '@/components/Kv/KvPagination';
import { getSearchableFilters } from '@/api/fixtures/LoanSearchFilters';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

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
		InContextCheckout,
		WwwPageMinimal,
		NoClickLoanCard,
		LoanCardController,
		KvLoadingOverlay,
		// KvButton,
		KvIcon,
		// KvLightbox,
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
			headerTheme: lightHeader,
			footerTheme: lightFooter,
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
		headerLogo() {
			const mediaObject = this.headerAreaContent?.media?.[0];
			if (mediaObject) {
				return {
					title: mediaObject.title,
					url: mediaObject.file?.url
				};
			}
			return {
				title: '',
				url: ''
			};
		},
		headline() {
			if (this.headerAreaContent) {
				return this.headerAreaContent.contents[0].headline;
			}
			return '';
		},
		bodyCopy() {
			if (this.headerAreaContent) {
				return documentToHtmlString(this.headerAreaContent.contents[0].bodyCopy);
			}
			return '';
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
				filters: this.filters
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

			if (numeral(donationTotal).value() > 0) {
				return false;
			}

			if (numeral(creditAmountNeeded).value() > 0) {
				return false;
			}

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

<style lang="scss" scoped>
@import 'settings';

.campaign-header {
	padding: 2rem 0 2rem;

	@include breakpoint(large) {
		padding: 4rem 0 2rem;
	}

	&__cta_wrapper {
		padding: 0 0 2rem;

		@include breakpoint(medium) {
			padding: 0 2rem 2rem;
		}

		@include breakpoint(large) {
			padding: 0 2rem;
		}
	}

	&__logo {
		image {
			display: block;
			outline: none;
			width: 100%;
		}
	}

	&__header {
		@include large-text();

		padding-top: 1rem;
	}

	&__body,
	&__cta {
		@include medium-text();

		@include breakpoint(xlarge) {
			@include featured-text();
		}
	}
}

.campaign-status {
	padding: 2rem;

	&__border {
		min-height: 10rem;
		position: relative;
		border-radius: 1rem;
		z-index: 1;
		box-shadow: 0 0 1.2rem 1rem rgb(153, 153, 153, 0.1);
		margin: 0 rem-calc(10);
		padding: 1rem;

		@include breakpoint(xga) {
			margin: 0 auto;
		}
	}

	&__validating-promo {
		text-align: center;
		width: 100%;

		p {
			position: relative;
		}
	}

	&__error-text-container {
		.icon-wrapper {
			padding: 1rem 1rem 0.3rem;

			.wrapper {
				height: rem-calc(30);
				width: rem-calc(30);

				::v-deep .icon {
					fill: $kiva-accent-red;
				}
			}
		}
	}

	&__header {
		font-weight: bold;
		margin-top: rem-calc(20);
	}
}

$card-width: rem-calc(290);
$max-card-width: rem-calc(330);
$card-margin: rem-calc(14);
$card-half-space: rem-calc(14/2);

.campaign-loans {
	position: relative;

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

	// .loading-loans {

	// }
}

.basket-bar {
	display: none;
}

</style>
