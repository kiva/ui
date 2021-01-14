<template>
	<www-page-corporate
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
		:corporate-logo-url="corporateLogoUrl"
	>
		<div class="corporate-campaign-landing">
			<!-- TODO: Add promo code entry input, if no promo query params exist and  no promo is applied -->
			<campaign-status
				class="corporate-campaign-landing__status"
				:loading-promotion="loadingPromotion"
				:promo-error-message="promoErrorMessage"
				:promo-applied="promoApplied"
				:promo-amount="promoAmount"
				:promo-name="campaignPartnerName"
				@show-checkout="showCheckout"
			/>

			<!-- TODO: Alter CTA if Checkout is ready -->
			<campaign-hero
				:hero-area-content="heroAreaContent"
				@add-to-basket="handleAddToBasket"
				@jump-to-loans="scrollToSection('campaignLoanDisplay')"
			/>

			<hr>

			<section class="loan-categories section">
				<div class="row">
					<div class="columns">
						<h2 class="loan-categories__header text-center">
							Support causes you care about.
						</h2>

						<!-- :applied-filters="filters" -->
						<campaign-loan-filters
							v-show="showTestFilters"
							:initial-filters="initialFilters"
							@updated-filters="handleUpdatedFilters"
						/>

						<campaign-loan-row
							v-show="showLoanRows"
							id="campaignLoanRowDisplay"
							:filters="filters"
							:is-visitor="isVisitor"
							:items-in-basket="itemsInBasket"
							:is-logged-in="!isVisitor"
							:is-visible="true"
							:key="'one-category'"
							:row-number="1"
							@add-to-basket="handleAddToBasket"
						/>

						<campaign-loan-grid-display
							v-show="!showLoanRows"
							id="campaignLoanDisplay"
							ref="loandisplayref"
							:show-loans="showLoans"
							:checkout-visible="checkoutVisible || showThanks"
							:filters="filters"
							:is-visitor="isVisitor"
							:items-in-basket="itemsInBasket"
							@add-to-basket="handleAddToBasket"
						/>
					</div>
				</div>
			</section>

			<hr>
			<section class="campaign-loan-view-selector section row align-center">
				<div class="small-12 large-8 align-self-middle columns text-center">
					<kv-button
						class="text-link"
						@click.native.prevent="showLoanRows = true"
					>
						Show loan rows
					</kv-button>
					&nbsp;&nbsp;|&nbsp;&nbsp;
					<kv-button
						class="text-link"
						@click.native.prevent="showLoanRows = false"
					>
						Show loan grid
					</kv-button>
				</div>
			</section>
			<hr>

			<campaign-partner :partner-area-content="partnerAreaContent" />
			<hr>

			<campaign-how-kiva-works v-if="!showThanks" />

			<campaign-verification-form
				v-if="this.showVerification"
				:form-id="this.externalFormId"
				:user-id="this.myId"
				@verification-complete="verificationComplete"
			/>

			<kv-lightbox
				:prevent-close="preventLightboxClose"
				:visible="checkoutVisible"
				@lightbox-closed="checkoutVisible = false"
				title="Checkout"
			>
				<in-context-checkout
					class="campaign-checkout"
					:is-actively-logged-in="isActivelyLoggedIn"
					:loans="basketLoans"
					:donations="donations"
					:kiva-cards="kivaCards"
					:totals="basketTotals"
					:show-donation="false"
					:auto-redirect-to-thanks="false"
					@transaction-complete="transactionComplete"
					@refresh-totals="refreshTotals"
				/>
			</kv-lightbox>

			<kv-lightbox
				class="campaign-thanks"
				:prevent-close="preventLightboxClose"
				:visible="showThanks"
				@lightbox-closed="showThanks = false"
			>
				<campaign-logo-group
					class="campaign-thanks__logos"
					:corporate-logo-url="corporateLogoUrl"
					:style="`--logo-color: ${headerTheme.logoColor}`"
				/>
				<campaign-thanks
					:transaction-id="transactionId"
					:partner-content="partnerThanksContent"
				/>
			</kv-lightbox>
		</div>
	</www-page-corporate>
</template>

<script>
import gql from 'graphql-tag';
import numeral from 'numeral';
import { processPageContentFlat } from '@/util/contentfulUtils';
import { validateQueryParams, getPromoFromBasket } from '@/util/campaignUtils';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import { lightHeader, lightFooter } from '@/util/siteThemes';
import cookieStore from '@/util/cookieStore';
import CampaignHero from '@/components/CorporateCampaign/CampaignHero';
import CampaignHowKivaWorks from '@/components/CorporateCampaign/CampaignHowKivaWorks';
import CampaignLoanGridDisplay from '@/components/CorporateCampaign/CampaignLoanGridDisplay';
import CampaignLoanRow from '@/components/CorporateCampaign/CampaignLoanRow';
import CampaignLoanFilters from '@/components/CorporateCampaign/LoanSearch/LoanSearchFilters';
// import CampaignLoanRowsDisplay from '@/components/CorporateCampaign/CampaignLoanRowsDisplay';
import CampaignLogoGroup from '@/components/CorporateCampaign/CampaignLogoGroup';
import CampaignPartner from '@/components/CorporateCampaign/CampaignPartner';
import CampaignStatus from '@/components/CorporateCampaign/CampaignStatus';
import CampaignVerificationForm from '@/components/CorporateCampaign/CampaignVerificationForm';
import CampaignThanks from '@/components/CorporateCampaign/CampaignThanks';
import InContextCheckout from '@/components/Checkout/InContext/InContextCheckout';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import WwwPageCorporate from '@/components/WwwFrame/WwwPageCorporate';
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
			items {
				totalCount
				values {
					id
					basketItemType
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
		CampaignHero,
		CampaignHowKivaWorks,
		CampaignLoanGridDisplay,
		CampaignLoanFilters,
		CampaignLoanRow,
		CampaignLogoGroup,
		CampaignPartner,
		CampaignStatus,
		CampaignThanks,
		CampaignVerificationForm,
		InContextCheckout,
		KvButton,
		KvLightbox,
		WwwPageCorporate,
	},
	mixins: [
		checkoutUtils
	],
	props: {
		dynamicRoute: {
			type: String,
			default: ''
		},
		formComplete: {
			type: String,
			default: ''
		},
		lendingReward: {
			type: String,
			default: ''
		},
		promoCode: {
			type: String,
			default: ''
		},
		upc: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			headerTheme: lightHeader,
			footerTheme: lightFooter,
			rawPageData: null,
			pageData: null,
			hasFreeCredits: null,
			lendingRewardOffered: null,
			preventLightboxClose: false,
			promoApplied: null,
			promoErrorMessage: null,
			promoData: null,
			filters: null,
			lastActiveLogin: 0,
			myId: null,
			activeLoginDuration: 3600,
			currentTime: Date.now(),
			currentTimeInterval: null,
			loadingPromotion: false,
			loans: [],
			basketTotals: {},
			basketTargetPromoCredit: () => [],
			basketLoans: [],
			donations: [],
			kivaCards: [],
			totalCount: 0,
			itemsInBasket: [],
			isVisitor: true,
			offset: 0,
			pageQuery: { page: '1' },
			showLoans: false,
			checkoutVisible: false,
			showVerification: false,
			showThanks: false,
			transactionId: null,
			showLoanRows: true,
			showTestFilters: false,
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
			// are there loans in the basket?
			// eslint-disable-next-line no-underscore-dangle
			// this.basketLoans = basketItems.filter(item => item.__typename === 'LoanReservation');
		}
	},
	created() {
		// extract query
		this.pageQuery = this.$route.query;
	},
	mounted() {
		this.loadingPromotion = true;
		// check for applied promo
		this.verifyOrApplyPromotion();
		// update basket state if any loans are already in the basket
		if (this.itemsInBasket.length) {
			this.updateBasketState();
		}

		if (this.$route.query && this.$route.query.testFilters === 'true') {
			this.showTestFilters = true;
		}
	},
	watch: {
		initialFilters(next) {
			this.filters = next;
		}
	},
	computed: {
		pageTitle() {
			// TODO: add field on Contentful Page for this
			return this.pageData?.page?.pageLayout?.name;
		},
		heroAreaContent() {
			return this.pageData?.page?.contentGroups?.mlCampaignHero;
		},
		partnerAreaContent() {
			return this.pageData?.page?.contentGroups?.mlCampaignPartnerCopy;
		},
		partnerThanksContent() {
			return this.pageData?.page?.contentGroups?.mlCampaignThanks;
		},
		promoAmount() {
			// TODO: get promoAmount from basket credit instead
			// - The promoPrice is currently hard-coded to 25
			// return this.promoData?.promoFund?.promoPrice ?? null;
			if (this.basketTargetPromoCredit.length) {
				const promoAmount = this.basketTargetPromoCredit[0]?.available ?? '0';
				return promoAmount;
			}
			return '0';
		},
		initialFilters() {
			const filters = this.promoData?.managedAccount?.loanSearchCriteria?.filters ?? {};
			return getSearchableFilters(filters);
		},
		isActivelyLoggedIn() {
			const lastLogin = (parseInt(this.lastActiveLogin, 10)) || 0;
			if (lastLogin + (this.activeLoginDuration * 1000) > this.currentTime) {
				return true;
			}
			return false;
		},
		contentfulPageId() {
			return this.promoData?.managedAccount?.pageid ?? null;
		},
		campaignPartnerName() {
			return this.promoData?.promoFund?.displayName ?? null;
		},
		verificationRequired() {
			if (this.promoData?.managedAccount?.isEmployee && this.promoData?.managedAccount?.formId) {
				return true;
			}
			return false;
		},
		isEmployee() {
			return this.promoData?.managedAccount?.isEmployee ?? false;
		},
		externalFormId() {
			return this.promoData?.managedAccount?.formId ?? null;
		},
		teamId() {
			return this.promoData?.promoGroup?.teamId ?? null;
		},
		verificationSumbitted() {
			return this.pageQuery?.formComplete === 'true' || false;
		},
		corporateLogoUrl() {
			return this.pageData?.page?.contentGroups?.mlCampaignLogo?.media?.[0]?.file?.url;
		}
	},
	methods: {
		verifyOrApplyPromotion() {
			// TODO: Establish control flow for applied promotional state
			// 1. Does route have a promo code? (done)
			// 2. check basket for loan items with ANY promotional credit applied
			// 	- applied promo credits reveal promotional state
			//		- check available + promoId to know if promo is applied to basket
			//		- check applied + promoId to know if promo is applied to a loan(s)
			//		- if this exists get detailed promo info
			// 	- loans in basket with credits applied reveal basket state
			//		- if this exist skip loading loans and show "Find more loans" link
			//		- Load and show Checkout
			// handle previously applied promo
			if (this.hasFreeCredits || this.lendingRewardOffered) {
				this.getPromoInformationFromBasket();
			} else if (Object.keys(this.$route.query).length) {
				// apply promo
				this.applyPromotion();
			}
		},
		applyPromotion() {
			// establish promotion state
			const applyPromo = validateQueryParams(this.$route.query, this.apollo);
			// handle applied promo state
			applyPromo.then(result => {
				// failed to apply promotion
				if (result.errors) {
					this.promoErrorMessage = result.errors[0].message;
					this.promoApplied = false;
					this.loadingPromotion = false;
				} else {
					this.promoApplied = true;
					// gather promo info
					this.getPromoInformationFromBasket();
				}
			}).catch(error => {
				console.error(error);
				this.promoErrorMessage = error;
				this.loadingPromotion = false;
			});
		},
		getPromoInformationFromBasket() {
			console.log('getting promotion info from basket');

			const basketItems = this.apollo.query({
				query: basketItemsQuery,
				variables: {
					basketId: cookieStore.get('kvbskt')
				}
			});

			// TEMPORARY Handling for patched in basket credits
			// TODO Extract as utility to get promo id from basket credits
			basketItems.then(({ data }) => {
				// console.log(data);
				// TODO: Handle success state (transition to checkout view, fallback to tipmsg)
				if (typeof data.shop === 'undefined') {
					console.error('missing shop basket');
					return false;
				}

				// Validate baseline promo + basket state (1 loan, 1 credit, 0 donation)
				this.validatePromoBasketState(data);
				const basketItemValues = data.shop?.basket?.items?.values ?? [];
				this.itemsInBasket = basketItemValues.length ? basketItemValues.map(item => item.id) : [];

				const credits = data.shop?.basket?.credits?.values;
				// TODO: target this check on the promoFund.id or creditType when possible
				const targetPromo = credits.filter(credit => {
					return credit.promoFund ? Object.keys(credit.promoFund).length > 0 : false;
				});
				this.basketTargetPromoCredit = targetPromo;
				// Primary PromoCampaign Query
				// Future usage will not require the promoFundId relying only on the basket id
				return getPromoFromBasket(targetPromo[0].promoFund?.id, this.apollo);
			}).then(response => {
				// TODO Handle response and any potential errors
				this.promoData = response.data?.shop?.promoCampaign;
				this.promoApplied = true;
				this.loadingPromotion = false;
				// Initialize loan query + observer there are no loans in the basket
				// TODO: Handle ability to add additional loans
				// if (!this.basketLoans.length) {
				this.showLoans = true;
				this.$refs.loandisplayref.activateLoanWatchQuery();
				// this.scrollToSection('campaignLoanDisplay');
				// }
				this.updateBasketState();
			});
		},
		// addToBasket() {
		// 	this.initializeBasketRefresh();
		// },
		handleAddToBasket(payload) {
			console.log(payload);
			// this.$emit('add-to-basket', payload);
			if (payload.eventSource === 'checkoutBtnClick') {
				console.log('checkout clicked');
				this.checkoutVisible = true;
			} else {
				this.initializeBasketRefresh();
			}
		},
		refreshTotals() {
			this.initializeBasketRefresh();
		},
		initializeBasketRefresh() {
			// Query to update basket state
			this.updateBasketState();
			// TEMPORARY: Obstruct ability to click the "Checkout" button on the loan card to prevent redirect
			this.$refs.loandisplayref.loadingLoans = true;
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

				const credits = data.shop?.basket?.credits?.values;
				// TODO: target this check on the promoFund.id or creditType when possible
				const targetPromo = credits.filter(credit => {
					return credit.promoFund ? Object.keys(credit.promoFund).length > 0 : false;
				});
				this.basketTargetPromoCredit = targetPromo;
			});
		},
		validatePromoBasketState(basketState) {
			// console.log(basketState);
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

			let simpleCheckoutEligible = true;
			let simpleCheckoutRestrictedMessage = '';

			// TODO: Log or notify for any of the following conditions
			if (numeral(donationTotal).value() > 0) {
				simpleCheckoutEligible = false;
				simpleCheckoutRestrictedMessage = 'There is a donation present on the basket.';
			}

			if (numeral(creditAmountNeeded).value() > 0) {
				simpleCheckoutEligible = false;
				simpleCheckoutRestrictedMessage = 'Additional credit or funds are needed to complete the transaction';
			}

			// TODO: Refine and document narrow in-context checkout conditions
			// TODO: Handle complex checkout scenarios
			if (numeral(creditAppliedTotal).value() !== numeral(loanReservationTotal).value()) {
				// simpleCheckoutEligible = false;
				simpleCheckoutRestrictedMessage = 'Promo Credit applied does not match loan reservation total';
			}

			if (numeral(itemTotal).value() !== numeral(loanReservationTotal).value()) {
				// simpleCheckoutEligible = false;
				simpleCheckoutRestrictedMessage = 'Item total does not match loan reservation total';
			}

			if (numeral(creditAvailableTotal).value() !== numeral(loanReservationTotal).value()) {
				// simpleCheckoutEligible = false;
				simpleCheckoutRestrictedMessage = 'Credit available total does not match loan reservation total.';
			}

			const basketItems = basketState.shop?.basket?.items?.values ?? [];
			// eslint-disable-next-line no-underscore-dangle
			this.basketLoans = basketItems.filter(item => item.__typename === 'LoanReservation');
			// eslint-disable-next-line no-underscore-dangle
			this.donations = basketItems.filter(item => item.__typename === 'Donation');
			// eslint-disable-next-line no-underscore-dangle
			this.kivaCards = basketItems.filter(item => item.__typename === 'KivaCard');

			// Basket is not eligible for simple incontext checkout
			if (!simpleCheckoutEligible) {
				console.log('ineligible for incontext checkout');
				// Temporary notice of failure condition that was hit
				// TODO: Create lightbox or other notice with action options for resolution
				if (simpleCheckoutRestrictedMessage && this.basketLoans.length) {
					this.$showTipMsg(simpleCheckoutRestrictedMessage, 'info');
				}
				// turn off loading state
				this.$refs.loandisplayref.loadingLoans = false;
				// exit method
				return false;
			}

			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus !== true) {
						console.error(validationStatus);
						// validation failed
						// this.showCheckoutError(validationStatus);
					}

					// TEMPORARY: turn off loading loans
					this.$refs.loandisplayref.loadingLoans = false;
					this.setAuthStatus(this.kvAuth0?.user ?? {});
					// signify checkout is ready
					this.handleBasketValidation();
					return true;
				}).catch(errorResponse => {
					console.error(errorResponse);
					return false;
				});
		},
		handleBasketValidation() {
			// check for verification form requirement
			if (
				this.isActivelyLoggedIn
				&& this.verificationRequired
				&& this.externalFormId
				&& !this.verificationSumbitted
			) {
				console.log('lender verification required');
				this.showVerification = true;
			} else if (this.teamId) {
				// check for team join optionality
				console.log(this.teamId);
			}

			// signify checkout is ready
			this.showCheckout();
		},
		showCheckout() {
			if (this.basketLoans.length) {
				this.checkoutVisible = true;
			}
		},
		transactionComplete(payload) {
			this.transactionId = payload.transactionId;
			this.showThanks = true;
			this.checkoutVisible = false;
			this.scrollToSection('campaignThanks');
		},

		verificationComplete() {
			// TODO: There is currently no way to know if someone has already submitted
			// maybe use localstorage
			this.showCheckout();
		},

		setAuthStatus(userState) {
			if (typeof userState !== 'undefined' && userState !== null) {
				this.lastActiveLogin = userState['https://www.kiva.org/last_login'] || 0;
				this.myId = userState['https://www.kiva.org/kiva_id'] || null;
			}
		},

		scrollToSection(section) {
			this.$router.push({
				query: {
					...this.$route.query,
					...this.urlParams
				},
				hash: section
			});
		},

		handleUpdatedFilters(payload) {
			console.log('top level handle updated filters: ', payload);
			this.filters = getSearchableFilters(payload);
		}
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
	&__status {
		$header-height: rem-calc(45); // same as TheHeader.vue
		$header-height-large: rem-calc(64); // same as TheHeader.vue

		position: sticky;
		top: $header-height;
		z-index: 1;

		@include breakpoint(large) {
			top: $header-height-large;
		}
	}
}

.loan-categories {
	& .row {
		max-width: 69.15rem;
	}

	&__header {
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}

.campaign-checkout {
	margin-top: 1rem;
}

.campaign-thanks {
	&__logos {
		height: rem-calc(20);
		margin-bottom: 2rem;

		@include breakpoint(large) {
			height: rem-calc(28);
		}
	}
}

.basket-bar {
	display: none;
}
</style>
