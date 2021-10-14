<template>
	<www-page-corporate
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
		:corporate-logo-url="corporateLogoUrl"
	>
		<div class="corporate-campaign-landing">
			<kv-loading-overlay
				v-if="loadingPage"
				class="corporate-campaign-landing__loading-page"
			/>
			<!-- TODO: Add promo code entry input, if no promo query params exist and  no promo is applied -->
			<campaign-status
				v-if="!hideStatusBar"
				class="corporate-campaign-landing__status"
				:active-credit-type="activeCreditType"
				:is-matching="isMatchingCampaign"
				:loading-promotion="loadingPromotion"
				:promo-error-message="promoErrorMessage"
				:promo-applied="promoApplied"
				:promo-amount="promoAmount"
				:promo-name="campaignPartnerName"
				:status-message-override="statusMessageOverride"
			/>

			<!-- TODO: Alter CTA if Checkout is ready -->
			<campaign-hero
				:hero-area-content="heroAreaContent"
				@add-to-basket="handleAddToBasket"
				@jump-to-loans="jumpToLoans"
			/>

			<hr>

			<section class="loan-categories section" id="campaignLoanSection" ref="campaignLoanSection">
				<div class="row">
					<div class="columns">
						<h2 class="loan-categories__header tw-text-center">
							Support causes you care about.
						</h2>

						<div class="loan-view-controls">
							<campaign-loan-filters
								class="loan-view-controls__filters"
								:applied-filters="filters"
								:initial-filters="initialFilters"
								:excluded-tags="excludedTags"
								:initial-sort-by="initialSortBy"
								:total-count="totalCount"
								@updated-filters="handleUpdatedFilters"
								@updated-sort-by="handleUpdatedSortBy"
								@set-loan-display="handleLoanDisplayType"
								@reset-loan-filters="handleResetLoanFilters"
							/>
						</div>

						<campaign-loan-row
							v-show="showLoanRows"
							id="campaignLoanRowDisplay"
							:filters="filters"
							:is-visitor="isVisitor"
							:items-in-basket="itemsInBasket"
							:is-logged-in="!isVisitor"
							:is-visible="showLoanRows"
							:key="'one-category'"
							:promo-only="promoOnlyQuery"
							:row-number="1"
							:show-loans="showLoans"
							:sort-by="sortBy"
							@add-to-basket="handleAddToBasket"
							@update-total-count="setTotalCount"
							@show-loan-details="showLoanDetails"
							@reset-loan-filters="handleResetLoanFilters"
						/>

						<campaign-loan-grid-display
							v-show="!showLoanRows"
							id="campaignLoanDisplay"
							ref="loandisplayref"
							:checkout-visible="checkoutVisible || showThanks"
							:filters="filters"
							:is-visible="!showLoanRows"
							:is-visitor="isVisitor"
							:items-in-basket="itemsInBasket"
							:show-loans="showLoans"
							:sort-by="sortBy"
							@add-to-basket="handleAddToBasket"
							@update-total-count="setTotalCount"
							@show-loan-details="showLoanDetails"
							@reset-loan-filters="handleResetLoanFilters"
						/>
					</div>
				</div>
			</section>

			<hr>

			<template v-if="partnerAreaContent">
				<campaign-partner :partner-area-content="partnerAreaContent" />
				<hr>
			</template>

			<campaign-how-kiva-works
				:is-matching-campaign="isMatchingCampaign"
			/>

			<campaign-join-team-form
				v-if="this.showTeamForm"
				:campaign-name="campaignPartnerName"
				:team-id="this.teamId"
				:promo-id="this.promoFundId"
				@team-process-complete="handleTeamJoinProcess"
			/>

			<campaign-verification-form
				v-if="showVerification"
				:form-id="externalFormId"
				:ma-id="String(managedAccountId)"
				:pf-id="String(promoFundId)"
				:user-id="this.myId"
				@verification-complete="verificationComplete"
				@opt-out="showVerifyRemovePromoCredit = true"
			/>

			<!-- Warn about removing promo credit -->
			<verify-remove-promo-credit
				:visible="showVerifyRemovePromoCredit"
				:applied-promo-total="promoAmount"
				:promo-fund-display-name="campaignPartnerName"
				:active-credit-type="activeCreditType"
				@credit-removed="handleCreditRemoved"
				@lightbox-closed="showVerifyRemovePromoCredit = false"
			/>

			<kv-lightbox
				class="loan-details-lightbox"
				:visible="loanDetailsVisible"
				:no-padding-top="true"
				:no-padding-bottom="true"
				:no-padding-sides="true"
				@lightbox-closed="loanDetailsVisible = false"
			>
				<!-- taken from CategoryRowHOver -->
				<loan-card-controller
					v-if="detailedLoan"
					class="campaign-loan-details"
					loan-card-type="DetailedLoanCard"
					:loan="detailedLoan"
					:items-in-basket="itemsInBasket"
					:enable-tracking="true"
					:disable-redirects="true"
					:is-visitor="isVisitor"
					@add-to-basket="handleAddToBasket"
				/>
			</kv-lightbox>

			<kv-lightbox
				:prevent-close="preventLightboxClose"
				:visible="checkoutVisible"
				@lightbox-closed="checkoutLightboxClosed"
				title="Checkout"
			>
				<campaign-status
					v-if="!hideStatusBar && activeCreditType === 'lending_reward'"
					class="corporate-campaign-landing__status--incontext collapse"
					:active-credit-type="activeCreditType"
					:in-context="true"
					:is-matching="isMatchingCampaign"
					:loading-promotion="loadingPromotion"
					:promo-error-message="promoErrorMessage"
					:promo-applied="promoApplied"
					:promo-amount="promoAmount"
					:promo-name="campaignPartnerName"
					:status-message-override="statusMessageOverride"
				/>
				<in-context-checkout
					class="campaign-checkout"
					:is-actively-logged-in="isActivelyLoggedIn"
					:loans="basketLoans"
					:disable-redirects="true"
					:donations="donations"
					:kiva-cards="kivaCards"
					:teams="myTeams"
					:totals="basketTotals"
					:show-donation="isMatchingCampaign"
					:auto-redirect-to-thanks="false"
					:promo-fund="promoFund"
					@transaction-complete="transactionComplete"
					@refresh-totals="refreshTotals"
					ref="inContextCheckoutRef"
				/>
			</kv-lightbox>

			<kv-lightbox
				class="campaign-thanks"
				:prevent-close="preventLightboxClose"
				:visible="showThanks"
				@lightbox-closed="thanksLightboxClosed"
			>
				<campaign-logo-group
					class="campaign-thanks__logos"
					:corporate-logo-url="corporateLogoUrl"
					:style="`--logo-color: ${headerTheme.logoColor}`"
				/>
				<campaign-status
					v-if="!hideStatusBar && hasFreeCredits && campaignPartnerName"
					class="corporate-campaign-landing__status--incontext collapse"
					:active-credit-type="activeCreditType"
					:in-context="true"
					:is-matching="isMatchingCampaign"
					:loading-promotion="loadingPromotion"
					:promo-error-message="promoErrorMessage"
					:promo-applied="promoApplied"
					:promo-amount="promoAmount"
					:promo-name="campaignPartnerName"
					:status-message-override="statusMessageOverride"
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
import { indexIn } from '@/util/comparators';
import logFormatter from '@/util/logFormatter';
import { processPageContentFlat } from '@/util/contentfulUtils';
import { validateQueryParams, getPromoFromBasket } from '@/util/campaignUtils';
import LoanSearchFilters, { getSearchableFilters } from '@/api/fixtures/LoanSearchFilters';
import syncDate from '@/util/syncDate';
import trackTransactionEvent from '@/util/trackTransactionEvent';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import { lightHeader, lightFooter } from '@/util/siteThemes';
import updateLoanReservationTeam from '@/graphql/mutation/updateLoanReservationTeam.graphql';
import CampaignHero from '@/components/CorporateCampaign/CampaignHero';
import CampaignHowKivaWorks from '@/components/CorporateCampaign/CampaignHowKivaWorks';
import CampaignJoinTeamForm from '@/components/CorporateCampaign/CampaignJoinTeamForm';
import CampaignLoanGridDisplay from '@/components/CorporateCampaign/CampaignLoanGridDisplay';
import CampaignLoanRow from '@/components/CorporateCampaign/CampaignLoanRow';
import CampaignLoanFilters from '@/components/CorporateCampaign/LoanSearch/LoanSearchFilters';
import CampaignLogoGroup from '@/components/CorporateCampaign/CampaignLogoGroup';
import CampaignPartner from '@/components/CorporateCampaign/CampaignPartner';
import CampaignStatus from '@/components/CorporateCampaign/CampaignStatus';
import CampaignVerificationForm from '@/components/CorporateCampaign/CampaignVerificationForm';
import CampaignThanks from '@/components/CorporateCampaign/CampaignThanks';
import InContextCheckout from '@/components/Checkout/InContext/InContextCheckout';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import WwwPageCorporate from '@/components/WwwFrame/WwwPageCorporate';
import VerifyRemovePromoCredit from '@/components/Checkout/VerifyRemovePromoCredit';

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
		lendingRewardOffered
		nonTrivialItemCount
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
							displayName
							displayDescription
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
						displayName
						displayDescription
					}
				}
			}
			totals {
				bonusAppliedTotal
				bonusAvailableTotal
				creditAmountNeeded
				creditAppliedTotal
				creditAvailableTotal
				donationTotal
				itemTotal
				freeTrialAppliedTotal
				freeTrialAvailableTotal
				kivaCardTotal
				kivaCreditAvailableTotal
				kivaCreditAppliedTotal
				kivaCreditRemaining
				kivaCreditToReapply
				loanReservationTotal
				redemptionCodeAppliedTotal
				redemptionCodeAvailableTotal
				universalCodeAppliedTotal
				universalCodeAvailableTotal
			}
		}
	}
}`;

// Query to gather user Teams
const myTeamsQuery = gql`query myTeamsQuery {
	my {
		lender {
			id
			teams(limit: 100) {
				values {
					id
					name
				}
			}
		}
	}
}`;

export default {
	inject: ['apollo', 'cookieStore', 'kvAuth0'],
	components: {
		CampaignHero,
		CampaignHowKivaWorks,
		CampaignJoinTeamForm,
		CampaignLoanGridDisplay,
		CampaignLoanFilters,
		CampaignLoanRow,
		CampaignLogoGroup,
		CampaignPartner,
		CampaignStatus,
		CampaignThanks,
		CampaignVerificationForm,
		InContextCheckout,
		KvLightbox,
		KvLoadingOverlay,
		LoanCardController,
		WwwPageCorporate,
		VerifyRemovePromoCredit
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
			myTeams: [],
			activeLoginDuration: 3600,
			currentTime: Date.now(),
			currentTimeInterval: null,
			loadingPromotion: false,
			loans: [],
			basketTotals: {},
			basketLoans: [],
			initialBasketCredits: [],
			basketCredits: [],
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
			showTeamForm: false,
			showThanks: false,
			sortBy: 'popularity',
			teamJoinStatus: null,
			transactionId: null,
			showLoanRows: true,
			loanDetailsVisible: false,
			detailedLoan: null,
			useMatcherAccountIds: true,
			initialFilters: {},
			verificationSumbitted: false,
			loadingPage: false,
			showVerifyRemovePromoCredit: false
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
			this.initialBasketCredits = data.shop?.basket?.credits?.values ?? [];

			const basketItems = data.shop?.basket?.items?.values ?? [];
			this.itemsInBasket = basketItems.length ? basketItems.map(item => item.id) : [];
			this.isVisitor = !data.my?.userAccount?.id ?? true;
		}
	},
	created() {
		// extract query
		this.pageQuery = this.$route.query;
		// startup campaign status loader
		this.loadingPromotion = true;

		// show a loading screen if the page loads with an loan in the basket.
		const basketItems = this.rawPageData?.shop?.basket?.items?.values ?? [];
		this.loadingPage = basketItems.some(item => item.__typename === 'LoanReservation'); // eslint-disable-line no-underscore-dangle, max-len
	},
	mounted() {
		// check for applied promo
		this.verifyOrApplyPromotion();

		// clean up show-basket process
		// TODO: Revisit this control flow
		if (this.$route.hash === '#show-basket') {
			this.$router.push(this.adjustRouteHash('')).catch(() => {});
		}

		// Ensure browser clock is correct before using current time
		syncDate().then(() => {
			// update current time every second for reactivity
			this.currentTimeInterval = setInterval(() => {
				this.currentTime = Date.now();
			}, 1000);
		});

		this.setAuthStatus(this.kvAuth0?.user ?? {});
	},
	watch: {
		initialFilters(next) {
			if (typeof next === 'object' && Object.keys(next).length > 0) {
				this.filters = next;
			}
			return false;
		},
		checkoutVisible(next) {
			if (next) {
				this.$kvTrackEvent(
					'ManagedLendingCampaign',
					'modal-show-in-context-checkout',
					this.isActivelyLoggedIn ? 'checkout-ready' : 'checkout-requires-login'
				);
			}

			if (!next && this.$route.hash === '#show-basket') {
				this.$nextTick(() => {
					this.$router.push(this.adjustRouteHash('')).catch(() => {});
				});
			}
		}
	},
	computed: {
		pageSettingData() {
			const settings = this.pageData?.page?.settings ?? [];
			const jsonDataArray = settings.map(setting => setting.dataObject || {});
			/* eslint-disable-next-line no-unused-vars, no-empty-pattern */
			const allJsonData = jsonDataArray.reduce((accumulator, settingDataObject) => {
				return { ...accumulator, ...settingDataObject };
			}, {});
			return allJsonData;
		},
		pageTitle() {
			const layoutTitle = this.pageData?.page?.pageLayout?.pageTitle;
			const pageTitle = this.pageData?.page?.pageTitle ?? 'Loans that change lives';
			return layoutTitle || pageTitle;
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
			if (this.prioritizedTargetCampaignCredit) {
				const promoAmount = this.prioritizedTargetCampaignCredit?.available ?? '0';
				return promoAmount;
			}
			return '0';
		},
		prioritizedBasketCredits() {
			const basketCredits = this.basketCredits.length ? this.basketCredits : this.initialBasketCredits;
			if (!basketCredits.length) return basketCredits;
			// establish precedence for credit types
			const sortBy = ['universal_code', 'redemption_code', 'bonus_credit', 'kiva_credit'];
			// copy and sort the credits
			const creditsArrayCopy = basketCredits.map(credit => credit);
			creditsArrayCopy.sort(indexIn(sortBy, 'creditType'));
			// return the 1st credit for presentation
			return creditsArrayCopy;
		},
		prioritizedTargetCampaignCredit() {
			if (this.pageSettingData?.promoFundId) {
				const targetPromos = this.basketCredits.filter(credit => {
					return credit.promoFund?.id === this.pageSettingData?.promoFundId;
				});
				return targetPromos.length ? targetPromos[0] : null;
			}
			if (this.prioritizedBasketCredits.length) {
				return this.prioritizedBasketCredits[0];
			}
			return null;
		},
		initialSortBy() {
			return this.promoData?.managedAccount?.loanSearchCriteria?.sortBy ?? 'popularity';
		},
		excludedTags() {
			return this.pageSettingData?.excludedTags ?? []; // tags that we don't want to show in the filter lightbox
		},
		isActivelyLoggedIn() {
			const lastLogin = (parseInt(this.lastActiveLogin, 10)) || 0;
			if (lastLogin + (this.activeLoginDuration * 1000) > this.currentTime) {
				return true;
			}
			return false;
		},
		isMatchingCampaign() {
			return this.pageSettingData?.matcherAccountId !== undefined;
		},
		contentfulPageId() {
			return this.promoData?.managedAccount?.pageid ?? null;
		},
		campaignPartnerName() {
			if (this.isMatchingCampaign) {
				return this.pageSettingData?.matchingAccountName ?? null;
			}
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
		managedAccountId() {
			return this.promoData?.managedAccount?.id ?? null;
		},
		promoFund() {
			return this.promoData?.promoFund ?? null;
		},
		promoFundId() {
			return this.promoData?.promoFund?.id ?? null;
		},
		promoOnlyQuery() {
			if (this.promoApplied && !this.isMatchingCampaign && !this.lendingRewardOffered) {
				return { basketId: this.cookieStore.get('kvbskt') };
			}
			return null;
		},
		teamId() {
			return this.promoData?.promoGroup?.teamId ?? null;
		},
		corporateLogoUrl() {
			return this.pageData?.page?.contentGroups?.mlCampaignLogo?.media?.[0]?.file?.url;
		},
		hideStatusBar() {
			return this.pageSettingData?.hideStatusBar ?? false;
		},
		statusMessageOverride() {
			return this.pageSettingData?.statusMessageOverride ?? null;
		},
		hasRedemptionCode() {
			return this.basketTotals?.redemptionCodeAppliedTotal !== '0.00';
		},
		hasUPCCode() {
			return this.basketTotals?.universalCodeAppliedTotal !== '0.00';
		},
		hasBonusCredit() {
			return this.basketTotals?.bonusAppliedTotal !== '0.00';
		},
		activeCreditType() {
			if (this.hasRedemptionCode) {
				return 'redemption_code';
			}
			if (this.hasUPCCode) {
				return 'universal_code';
			}
			if (this.hasBonusCredit) {
				return 'bonus_credit';
			}
			if (this.lendingRewardOffered) {
				return 'lending_reward';
			}
			return null;
		},
	},
	methods: {
		verifyOrApplyPromotion() {
			// Always apply a promo if activating query params exist
			const promoQueryKeys = ['upc', 'promoCode', 'lendingReward'];
			const targetParams = Object.keys(this.$route.query).filter(targetKey => {
				return promoQueryKeys.includes(targetKey);
			});
			if (targetParams.length) {
				// apply promo
				this.applyPromotion();

			// handle previously applied promo
			// There may be some additional processing we can do on initialBasketCredits
			// to further optimize and skip the first step
			} else if (this.hasFreeCredits || this.lendingRewardOffered || this.isMatchingCampaign) {
				this.getPromoInformationFromBasket();

			// handle no promo visit
			} else {
				this.promoApplied = false;
				this.loadingPromotion = false;
				// ensure updated basket state for promo-less visit
				this.getPromoInformationFromBasket();
			}
		},
		applyPromotion() {
			// establish promotion state
			const applyPromo = validateQueryParams(this.$route.query, this.apollo);
			// handle applied promo state
			applyPromo.then(result => {
				// failed to apply promotion
				if (result.errors) {
					// This error might arise if the promo is already applied
					// Store the error message here and handle visibility in getPromoInformationFromBasket
					this.promoErrorMessage = result.errors[0].message;
					this.promoApplied = false;
				}

				// gather promo info
				this.getPromoInformationFromBasket();
			}).catch(error => {
				logFormatter(error, 'error');
				this.promoErrorMessage = error;
				this.loadingPromotion = false;
				this.promoApplied = false;
			});
		},
		getPromoInformationFromBasket() {
			const basketItems = this.apollo.query({
				fetchPolicy: 'network-only',
				query: basketItemsQuery,
				variables: {
					basketId: this.cookieStore.get('kvbskt')
				}
			});

			// Handling for patched in basket credits
			// TODO Extract as utility to get promo id from basket credits
			basketItems.then(({ data }) => {
				// console.log(data);
				// TODO: Handle success state (transition to checkout view, fallback to tipmsg)
				if (typeof data.shop === 'undefined') {
					console.error('missing shop basket');
					return false;
				}

				// Validate baseline promo + basket state (1 loan, 1 credit, 0 donation)
				const basketItemValues = data.shop?.basket?.items?.values ?? [];
				this.itemsInBasket = basketItemValues.length ? basketItemValues.map(item => item.id) : [];
				this.lendingRewardOffered = data.shop?.lendingRewardOffered ?? false;
				this.basketCredits = data.shop?.basket?.credits?.values || [];
				this.hasFreeCredits = data.shop?.basket?.hasFreeCredits ?? false;

				// Primary PromoCampaign Query
				// > Previously > Future usage will not require the promoFundId relying only on the basket id
				// > Currently > Providing the Promo Id can help differentiate between existing credits on the baskset
				// Override promoFundId if provided in contentful setting
				const targetPromoId = this.pageSettingData?.promoFundId
					?? (this.prioritizedTargetCampaignCredit?.promoFund?.id ?? null);
				return getPromoFromBasket(targetPromoId, this.apollo);
			}).then(response => {
				// eslint-disable-next-line max-len
				const isLendingReward = response.data?.shop?.promoCampaign?.managedAccount?.managementType === 'lending_reward';
				// Verify that applied promotion is for current page
				if (this.verifyPromoMatchesPageId(response.data?.shop?.promoCampaign?.managedAccount?.pageId)) {
					this.promoData = response.data?.shop?.promoCampaign;
					// if this promo credit is already applied and matches we can clear the error
					if (this.prioritizedTargetCampaignCredit?.promoFund?.id
						=== response.data?.shop?.promoCampaign?.promoFund?.id) {
						this.promoApplied = true;
						this.promoErrorMessage = null;
					}
					// handle lending reward presence
					if (isLendingReward && response.data?.shop?.promoCampaign?.promoFund?.id) {
						this.promoApplied = true;
						this.promoErrorMessage = null;
					}
				} else if (this.isMatchingCampaign) {
					this.promoApplied = true;
				} else {
					// Handle response and any potential errors
					// > this reveals and prior error messages from the promo application
					this.promoApplied = false;
				}

				this.loadingPromotion = false;

				this.setInitialFilters();

				this.showLoans = true;

				this.setAuthStatus(this.kvAuth0?.user);

				this.updateBasketState();
			});
		},
		setInitialFilters() {
			// initialize filter object
			let filters = LoanSearchFilters();

			// fetch filters from promo if available
			const promoFilters = this.promoData?.managedAccount?.loanSearchCriteria?.filters ?? null;
			// update filters from promo if present and fetchting promo data is complete
			if (!this.loadingPromotion && promoFilters) {
				filters = promoFilters;
			}

			// initialize base filters with defaults
			const baseFilters = getSearchableFilters(filters);

			// check for matcherAccountId from Contentful
			let matcherAccounts = this.pageSettingData?.matcherAccountId ?? null;
			if (matcherAccounts && typeof matcherAccounts === 'number') {
				matcherAccounts = [matcherAccounts];
			}
			// apply matcherAccounts array if present
			if (this.useMatcherAccountIds && matcherAccounts && matcherAccounts.length) {
				baseFilters.matcherAccountId = matcherAccounts;
			}

			// set some always on filters
			baseFilters.status = 'fundraising';

			this.initialFilters = baseFilters;
		},
		handleAddToBasket(payload) {
			if (payload.eventSource === 'checkoutBtnClick') {
				this.loanDetailsVisible = false;
				this.checkoutVisible = true;
			} else {
				this.initializeBasketRefresh();
			}
		},
		handleCreditRemoved() {
			this.showVerification = false;
			this.$router.push(this.$route.path); // remove promo query param from url
			this.promoApplied = false;
			this.refreshTotals();
			this.verificationComplete();
		},
		refreshTotals() {
			this.initializeBasketRefresh();
		},
		initializeBasketRefresh() {
			// TDOO: Consider extending loading state for basket updates
			// Query to update basket state
			this.updateBasketState();
			// TEMPORARY: Obstruct ability to click the "Checkout" button on the loan card to prevent redirect
			this.$refs.loandisplayref.loadingLoans = true;
		},
		updateBasketState() {
			// Ensure basket state is loading
			if (this.$refs.inContextCheckoutRef) {
				this.$refs.inContextCheckoutRef.updatingTotals = true;
			}

			// get our basket id
			const basketId = decodeURIComponent(this.cookieStore.get('kvbskt'));

			// update basket state
			const basketItems = this.apollo.query({
				query: basketItemsQuery,
				variables: {
					basketId
				},
				fetchPolicy: 'network-only',
			});
			basketItems.then(({ data }) => {
				// Validate baseline promo + basket state (1 loan, 1 credit, 0 donation)
				this.validatePromoBasketState(data);
				const basketItemValues = data.shop?.basket?.items?.values ?? [];
				this.itemsInBasket = basketItemValues.length ? basketItemValues.map(item => item.id) : [];

				this.basketCredits = data.shop?.basket?.credits?.values ?? [];
				this.hasFreeCredits = data.shop?.basket?.hasFreeCredits ?? false;
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

			let simpleCheckoutRestrictedMessage = '';

			// TODO: Log or notify for any of the following conditions
			if (numeral(donationTotal).value() > 0) {
				simpleCheckoutRestrictedMessage = 'There is a donation present on the basket.';
			}

			if (numeral(creditAmountNeeded).value() > 0) {
				simpleCheckoutRestrictedMessage = 'Additional credit or funds are needed to complete the transaction';
			}

			// TODO: Refine and document narrow in-context checkout conditions
			// TODO: Handle complex checkout scenarios
			if (numeral(creditAppliedTotal).value() !== numeral(loanReservationTotal).value()) {
				simpleCheckoutRestrictedMessage = 'Promo Credit applied does not match loan reservation total';
			}

			if (numeral(itemTotal).value() !== numeral(loanReservationTotal).value()) {
				simpleCheckoutRestrictedMessage = 'Item total does not match loan reservation total';
			}

			if (numeral(creditAvailableTotal).value() !== numeral(loanReservationTotal).value()) {
				simpleCheckoutRestrictedMessage = 'Credit available total does not match loan reservation total.';
			}

			const basketItems = basketState.shop?.basket?.items?.values ?? [];
			// eslint-disable-next-line no-underscore-dangle
			this.basketLoans = basketItems.filter(item => item.__typename === 'LoanReservation');
			// eslint-disable-next-line no-underscore-dangle
			this.donations = basketItems.filter(item => item.__typename === 'Donation');
			// eslint-disable-next-line no-underscore-dangle
			this.kivaCards = basketItems.filter(item => item.__typename === 'KivaCard');

			// Temporary notice of failure condition that was hit
			// TODO: Create lightbox or other notice with action options for resolution
			if (simpleCheckoutRestrictedMessage && this.basketLoans.length) {
				console.log(simpleCheckoutRestrictedMessage);
				// this.$showTipMsg(simpleCheckoutRestrictedMessage, 'info');
			}

			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus !== true) {
						console.error(validationStatus);
						// validation failed
						// this.showCheckoutError(validationStatus);
					}

					// Update user Auth state
					this.setAuthStatus(this.kvAuth0?.user ?? {});

					// TEMPORARY: turn off loading loans
					this.$refs.loandisplayref.loadingLoans = false;
					if (this.$refs.inContextCheckoutRef) {
						this.$refs.inContextCheckoutRef.updatingTotals = false;
					}

					// signify checkout is ready
					this.handleBasketValidation();
				}).catch(errorResponse => {
					console.error(errorResponse);
				}).finally(() => {
					this.loadingPage = false;
				});
		},
		handleBasketValidation() {
			// check for verification form requirement
			if (
				this.isActivelyLoggedIn
				&& this.verificationRequired
				&& this.externalFormId
				&& !this.verificationSumbitted
				&& this.basketLoans.length
			) {
				this.showVerification = true;
			} else if (
				this.basketLoans.length
				&& this.isActivelyLoggedIn
				&& this.teamId
				&& !this.teamJoinStatus
			) {
				// check for team join optionality
				this.showTeamForm = true;
				this.checkoutVisible = false;
			} else {
				// signify checkout is ready
				this.showCheckout();
			}
		},
		showCheckout() {
			if (this.basketLoans.length) {
				this.checkoutVisible = true;
			} else {
				this.checkoutVisible = false;
			}
		},
		checkoutLightboxClosed() {
			this.checkoutVisible = false;
			if (this.$route.hash === '#show-basket') {
				this.$nextTick(() => {
					this.$router.push(this.adjustRouteHash('')).catch(() => {});
				});
			}
		},
		transactionComplete(payload) {
			this.transactionId = payload.transactionId;
			this.showThanks = true;
			this.checkoutVisible = false;
			trackTransactionEvent(payload.transactionId, this.apollo, this.cookieStore);
			// establish a new basket
			this.apollo.mutate({
				mutation: gql`mutation createNewBasketForUser { shop { id createBasket } }`,
			}).then(({ data }) => {
				// extract new basket id
				const newBasketId = data.shop?.createBasket ?? null;
				if (newBasketId) {
					this.cookieStore.set('kvbskt', newBasketId, { secure: true });
					this.getPromoInformationFromBasket();
				}
			});
		},
		thanksLightboxClosed() {
			// Consdier closing the lightbox
			// this.showThanks = false;
			// refresh the page
			// TODO: Revisit approaches to reset basket cookie and refetch queries
			window.location = window.location.origin + window.location.pathname;
		},
		// toggle visible loan types
		handleLoanDisplayType(state) {
			this.showLoanRows = state;
		},

		handleTeamJoinProcess(payload) {
			this.teamJoinStatus = payload.join;
			this.fetchMyTeams();
		},
		fetchMyTeams() {
			this.apollo.query({
				fetchPolicy: 'network-only',
				query: myTeamsQuery
			}).then(({ data }) => {
				this.myTeams = data.my?.lender?.teams?.values ?? [];
				this.addTeamToLoans();
			});
		},
		addTeamToLoans() {
			if (this.basketLoans.length && this.teamId) {
				const loans = [];
				// TODO Collect these promises and refresh basket once complete
				this.basketLoans.forEach((loan, index) => {
					loans[index] = this.apollo.mutate({
						mutation: updateLoanReservationTeam,
						variables: {
							teamId: this.teamId,
							loanid: loan.id
						}
					});
				});
				Promise.all(loans).then(() => {
					this.updateBasketState();
				});
			}
		},

		verificationComplete() {
			this.verificationSumbitted = true;
			this.handleBasketValidation();
		},
		verifyPromoMatchesPageId(pageId) {
			const promoPageId = pageId || this.promoData?.managedAccount?.pageId;
			// Current page path is a co-branded space and should match applied promo page path
			return this.$route?.params?.dynamicRoute === promoPageId;
		},
		checkInitialFiltersAgainstAppliedFilters() {
			// check that initial filters match what is currently applied
			if (JSON.stringify(this.initialFilters) === JSON.stringify(this.filters)) {
				return true;
			}
			return false;
		},

		setAuthStatus(userState) {
			if (typeof userState !== 'undefined' && userState !== null) {
				this.lastActiveLogin = userState['https://www.kiva.org/last_login'] || 0;
				this.myId = userState['https://www.kiva.org/kiva_id'] || null;
			}
		},
		jumpToLoans() {
			this.$refs.campaignLoanSection.scrollIntoView({ behavior: 'smooth' });
		},
		adjustRouteHash(hash) {
			const route = { ...this.$route };
			route.hash = hash;
			return route;
		},
		handleUpdatedFilters(payload) {
			this.filters = getSearchableFilters(payload);
		},
		handleResetLoanFilters() {
			this.filters = this.initialFilters;
		},
		handleUpdatedSortBy(sortBy) {
			if (sortBy && this.sortBy !== sortBy) {
				this.sortBy = sortBy;
			}
		},
		setTotalCount(payload) {
			this.totalCount = payload;

			// if this is a matching account and the original filters were used
			// we need to remove the matcherAccountId from the query to show loans
			if (payload === 0 && this.isMatchingCampaign && this.checkInitialFiltersAgainstAppliedFilters()) {
				this.useMatcherAccountIds = false;
				this.setInitialFilters();
			}
		},
		showLoanDetails(loan) {
			this.detailedLoan = loan;
			this.loanDetailsVisible = true;
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.$refs.loandisplayref.updateFromParams(to.query);
		});
	},
	beforeRouteUpdate(to, from, next) {
		this.$refs.loandisplayref.updateFromParams(to.query);
		if (to.hash === '#show-basket') {
			this.checkoutVisible = true;
		}

		next();
	},
	destroyed() {
		clearInterval(this.currentTimeInterval);
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.corporate-campaign-landing {
	&__status {
		$header-height: rem-calc(45); // same as TheHeader.vue
		$header-height-large: rem-calc(64); // same as TheHeader.vue

		position: sticky;
		top: $header-height;
		z-index: 2;

		@include breakpoint(large) {
			top: $header-height-large;
		}
	}

	&__status--incontext {
		position: relative;
		top: auto;
		z-index: 2;
		height: auto;
		margin-bottom: 2rem;
	}

	&__loading-page {
		z-index: 1;
	}
}

.loan-categories {
	margin-top: 2rem;

	& .row {
		max-width: 69.15rem;
	}

	&__header {
		font-weight: bold;
		margin-bottom: 2rem;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}

.campaign-checkout {
	margin-top: 1rem;

	@include breakpoint(large) {
		min-width: rem-calc(600);
	}
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

.loan-details-lightbox {
	::v-deep .kv-lightbox__header {
		button.kv-lightbox__close-btn {
			background: $white;
			border-radius: 1.25rem;
		}
	}
}

.campaign-loan-details {
	// Style overrides for the loan details lightbox content
	// Note, styles inside DetailedLoanCard.vue are not scoped
	border: 0;

	&.detailed-loan-card.row {
		max-width: 100%;
		border: 0;

		@include breakpoint(xlarge) {
			width: 58.75rem;
		}

		::v-deep {
			.full-details-link,
			.close-button-wrapper,
			.info-panel a,
			.borrower-info-body.loan-use a {
				display: none;
			}

			.name-location-sector .name {
				text-decoration: none;
				color: $body-font-color;
				cursor: text;
			}
		}
	}

	.overview-column {
		margin-bottom: 1.5rem;
	}
}

#campaignLoanSection {
	// ensure we scroll past the sticky header
	scroll-margin-top: rem-calc(85);
	@include breakpoint(large) {
		scroll-margin-top: rem-calc(116);
	}
}

</style>
