<template>
	<www-page-minimal
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div class="corporate-campaign-landing">
			<!-- TODO: Alter CTA if Checkout is ready -->
			<campaign-header
				:header-area-content="headerAreaContent"
				@jump-to-loans="scrollToSection('campaignLoanDisplay')"
			/>

			<!-- TODO: Add promo code entry input, if no promo query params exist and  no promo is applied -->
			<campaign-status
				:loading-promotion="loadingPromotion"
				:promo-error-message="promoErrorMessage"
				:promo-applied="promoApplied"
				:promo-amount="promoAmount"
			/>

			<campaign-how-kiva-works />

			<campaign-loan-display
				id="campaignLoanDisplay"
				ref="loandisplayref"
				:show-loans="showLoans"
				:checkout-visible="checkoutVisible || showThanks"
				:filters="filters"
				:is-visitor="isVisitor"
				:items-in-basket="itemsInBasket"
				@add-to-basket="addToBasket"
			/>

			<campaign-verification-form
				v-if="this.showVerification"
				:form-id="this.externalFormId"
				:user-id="this.myId"
				@verification-complete="verificationComplete"
			/>

			<section
				v-if="checkoutVisible"
				id="campaignCheckout"
				class="campaign-checkout section row align-center"
			>
				<div class="small-10 large-8 align-self-middle columns">
					<in-context-checkout
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
				</div>
			</section>

			<section
				v-if="showThanks"
				id="campaignThanks"
				class="campaign-thanks section row align-center"
			>
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
import CampaignHeader from '@/components/CorporateCampaign/CampaignHeader';
import CampaignHowKivaWorks from '@/components/CorporateCampaign/CampaignHowKivaWorks';
import CampaignLoanDisplay from '@/components/CorporateCampaign/CampaignLoanDisplay';
import CampaignStatus from '@/components/CorporateCampaign/CampaignStatus';
import CampaignVerificationForm from '@/components/CorporateCampaign/CampaignVerificationForm';
import InContextCheckout from '@/components/Checkout/InContext/InContextCheckout';
import CampaignThanks from '@/components/CorporateCampaign/CampaignThanks';
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
		CampaignHeader,
		CampaignHowKivaWorks,
		CampaignLoanDisplay,
		CampaignStatus,
		CampaignThanks,
		CampaignVerificationForm,
		InContextCheckout,
		WwwPageMinimal,
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
			loans: [],
			basketTotals: {},
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
			this.basketLoans = basketItems.filter(item => item.__typename === 'LoanReservation');
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
				this.promoApplied = true;
				this.loadingPromotion = false;
				// Initialize loan query + observer there are no loans in the basket
				// TODO: Handle ability to add additional loans
				if (!this.basketLoans.length) {
					this.showLoans = true;
					this.$refs.loandisplayref.activateLoanWatchQuery();
					// this.scrollToSection('campaignLoanDisplay');
				}
				this.updateBasketState();
			});
		},
		addToBasket() {
			this.initializeBasketRefresh();
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

			// TODO: Log or notify for any of the following conditions
			if (numeral(donationTotal).value() > 0) {
				simpleCheckoutEligible = false;
			}

			if (numeral(creditAmountNeeded).value() > 0) {
				simpleCheckoutEligible = false;
			}

			// TODO: Refine and document narrow in-context checkout conditions
			// TODO: Handle complex checkout scenarios
			if (numeral(creditAppliedTotal).value() !== numeral(loanReservationTotal).value()
				|| numeral(itemTotal).value() !== numeral(loanReservationTotal).value()
				|| numeral(creditAvailableTotal).value() !== numeral(loanReservationTotal).value()) {
				simpleCheckoutEligible = false;
			}

			// Basket is not eligible for simple incontext checkout
			if (!simpleCheckoutEligible) {
				// turn off loading state
				this.$refs.loandisplayref.loadingLoans = false;
				// exit method
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
			// } else if (this.teamId) {
			// 	// check for team join optionality
			// 	console.log(this.teamId);
			} else {
				// signify checkout is ready
				this.checkoutVisible = true;
				this.scrollToSection('campaignCheckout');
			}
		},
		transactionComplete(payload) {
			// console.log('transaction complete', payload);
			this.transactionId = payload.transactionId;
			this.showThanks = true;
			this.checkoutVisible = false;
			this.scrollToSection('campaignThanks');
		},

		verificationComplete() {
			// TODO: There is currently no way to know if someone has already submitted
			// maybe use localstorage
			this.checkoutVisible = true;
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
	.campaign-checkout,
	.campaign-thanks {
		padding: 3rem 0;
	}
}

.basket-bar {
	display: none;
}
</style>
