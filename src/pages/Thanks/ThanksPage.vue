<template>
	<www-page
		data-testid="thanks-page"
		:class="{ 'tw-bg-eco-green-1 !tw-h-auto': activeView === MARKETING_OPT_IN_VIEW }"
	>
		<template v-if="activeView === SINGLE_VERSION_VIEW">
			<ThanksPageSingleVersion
				:is-guest="isGuest"
				:is-opted-in="optedIn"
				:lender="lender"
				:loans="loans"
				:receipt="receipt"
				:monthly-donation-amount="monthlyDonationAmount"
				:badges-achieved="badgesAchieved"
				:my-kiva-enabled="myKivaExperimentEnabled"
				:guest-username="guestUsername"
				:achievements-completed="achievementsCompleted"
				:is-next-steps-exp-enabled="isNextStepsExpEnabled"
			/>
		</template>
		<template v-if="activeView === DONATION_ONLY_VIEW">
			<thanks-page-donation-only
				:monthly-donation-amount="monthlyDonationAmount"
				:show-daf-thanks="showDafThanks"
			/>
		</template>
		<template v-if="activeView === MY_KIVA_BADGES_VIEW">
			<thanks-badges
				:is-guest="isGuest"
				:is-opted-in="optedIn"
				:lender="lender"
				:loans="loans"
				:receipt="receipt"
				:badges-achieved="badgesAchieved"
				:guest-username="guestUsername"
				:my-kiva-enabled="myKivaExperimentEnabled"
			/>
		</template>
		<template v-if="activeView === MARKETING_OPT_IN_VIEW">
			<what-is-next-template
				:selected-loan="selectedLoan"
				:loans="loans"
				:receipt="receipt"
				:lender="lender"
				:is-guest="isGuest"
				:opted-in="optedIn"
				:guest-username="guestUsername"
			/>
		</template>
		<div v-if="challengeHeaderVisible" class="tw-bg-secondary">
			<challenge-header :goal="goal" :team-public-id="teamPublicId" />
		</div>
		<template v-if="showMayChallengeHeader">
			<div
				v-if="loans.length > 0"
				class="hide-for-print tw-text-center tw-bg-eco-green-1 tw-py-1 tw-text-small"
			>
				<template v-if="receipt">
					Thanks for supporting
					<span class="data-hj-suppress">{{ borrowerSupport }}</span>!
					We've emailed your order confirmation to
					<strong v-if="lender.email" class="data-hj-suppress ">{{ lender.email }}.</strong>
					<span v-else>you.</span>
				</template>
				<template v-else>
					Please log in to see your receipt.
					<kv-button
						:href="`/ui-login?force=true&doneUrl=${encodeURIComponent($route.fullPath)}`"
						class="tw-ml-1"
					>
						Log in to continue
					</kv-button>
				</template>
			</div>
			<share-challenge
				v-if="teamPublicId"
				:goal="goal"
				:loan="challengeLoan"
				:team-public-id="teamPublicId"
				:lender="lender"
				:is-guest="isGuest"
				:team-name="teamName"
			/>
		</template>
		<div class="row page-content" v-if="activeView === V2_VIEW">
			<div class="small-12 columns thanks">
				<div class="thanks__header hide-for-print">
					<h1
						class="tw-mt-1 tw-mb-3"
					>
						Thank you!
					</h1>
					<p
						v-if="loans.length > 0"
						class="thanks__header-subhead tw-text-subhead tw-mb-2"
						data-testid="thanks-message"
					>
						Thanks for supporting
						<span class="data-hj-suppress">{{ borrowerSupport }}</span>.<br>
					</p>
					<p v-if="lender.email" class="hide-for-print">
						We've emailed your order confirmation to
						<strong class="data-hj-suppress ">{{ lender.email }}</strong>
					</p>
					<p v-else class="hide-for-print">
						We've emailed your order confirmation to you.
					</p>
				</div>
			</div>
			<thanks-layout-v2
				:show-mg-cta="!isMonthlyGoodSubscriber && !isGuest && !hasModernSub"
				:show-guest-upsell="isGuest"
				:show-share="loans.length > 0"
				:show-receipt="printableKivaCards.length > 0"
			>
				<template #receipt>
					<checkout-receipt
						:lender="lender"
						:receipt="receipt"
					/>
				</template>
				<template #ad>
					<auto-deposit-c-t-a />
				</template>
				<template #mg>
					<monthly-good-c-t-a
						:headline="ctaHeadline"
						:body-copy="ctaBodyCopy"
						:button-text="ctaButtonText"
					/>
				</template>
				<template #share>
					<social-share-v2
						class="thanks__social-share"
						:lender="lender"
						:loans="loans"
					/>
				</template>
				<template #guest>
					<guest-upsell
						:loans="loans"
					/>
				</template>
			</thanks-layout-v2>
		</div>
		<template v-if="activeView === LOGIN_REQUIRED_VIEW">
			<div class="page-content tw-flex tw-flex-col tw-items-center tw-text-center">
				<h2 class="tw-m-4">
					Please log in to see your receipt.
				</h2>
				<kv-button
					:href="`/ui-login?force=true&doneUrl=${
						($route.query.kiva_transaction_id && $route.query.kiva_transaction_id !== null)
							? encodeURIComponent($route.fullPath)
							: encodeURIComponent('/portfolio')
					}`"
				>
					Log in to continue
				</kv-button>
			</div>
		</template>
		<thanks-page-comment-and-share
			v-if="activeView === COMMENT_AND_SHARE_VIEW"
			:receipt="receipt"
			:lender="lender"
			:loan="selectedLoan"
			:is-guest="isGuest"
			:is-first-loan="showFtdMessage"
			:ftd-credit-amount="ftdCreditAmount"
			@guest-create-account="createGuestAccount"
			:ask-for-comments="askForComments"
			:guest-username="guestUsername"
		/>
	</www-page>
</template>

<script>
import numeral from 'numeral';
import { readBoolSetting } from '#src/util/settingsUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import GuestUpsell from '#src/components/Checkout/GuestUpsell';
import AutoDepositCTA from '#src/components/Checkout/AutoDepositCTA';
import MonthlyGoodCTA from '#src/components/Checkout/MonthlyGoodCTA';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import ThanksLayoutV2 from '#src/components/Thanks/ThanksLayoutV2';
import ThanksPageCommentAndShare from '#src/components/Thanks/ThanksPageCommentAndShare';
import ThanksPageDonationOnly from '#src/components/Thanks/ThanksPageDonationOnly';
import ThanksBadges from '#src/components/Thanks/MyKiva/ThanksBadges';
import orderBy from 'lodash/orderBy';
import thanksPageQuery from '#src/graphql/query/thanksPage.graphql';
import thanksPageReceiptQuery from '#src/graphql/query/thanksPageReceipt.graphql';
import { processPageContentFlat } from '#src/util/contentfulUtils';
import { userHasLentBefore, userHasDepositBefore } from '#src/util/optimizelyUserMetrics';
import { setHotJarUserAttributes } from '#src/util/hotJarUtils';
import logFormatter from '#src/util/logFormatter';
import { joinArray } from '#src/util/joinArray';
import ChallengeHeader from '#src/components/Thanks/ChallengeHeader';
import ShareChallenge from '#src/components/Thanks/ShareChallenge';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import WhatIsNextTemplate from '#src/components/Thanks/WhatIsNextTemplate';
import { KvButton } from '@kiva/kv-components';
import { fetchGoals } from '#src/util/teamsUtil';
import teamsGoalsQuery from '#src/graphql/query/teamsGoals.graphql';
import { getIsMyKivaEnabled, fetchPostCheckoutAchievements, MY_KIVA_FOR_ALL_USERS_KEY } from '#src/util/myKivaUtils';
import ThanksPageSingleVersion from '#src/components/Thanks/ThanksPageSingleVersion';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import useBadgeData from '#src/composables/useBadgeData';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

const hasLentBeforeCookie = 'kvu_lb';
const hasDepositBeforeCookie = 'kvu_db';
const CHALLENGE_HEADER_EXP = 'filters_challenge_header';
const TY_SINGLE_VERSION_KEY = 'general.single_version_enable.value';
const NEXT_STEPS_EXP_KEY = 'mykiva_next_steps';

// Thanks views
const DONATION_ONLY_VIEW = 'donation_only';
const MY_KIVA_BADGES_VIEW = 'my_kiva_badges';
const MARKETING_OPT_IN_VIEW = 'marketing_opt_in';
const V2_VIEW = 'v2';
const COMMENT_AND_SHARE_VIEW = 'comment_and_share';
const LOGIN_REQUIRED_VIEW = 'login_required';
const SINGLE_VERSION_VIEW = 'thanks_single_version';

const getLoans = receipt => {
	const loansResponse = receipt?.items?.values ?? [];
	const loans = loansResponse
		.filter(item => item.basketItemType === 'loan_reservation')
		.map(item => {
			return {
				...item.loan,
				team: item.team,
			};
		});

	return loans;
};

const getTeamId = loans => {
	const teamsIds = loans.filter(loan => !!loan?.team?.id)
		.map(loan => loan.team.id) ?? [];
	return teamsIds?.[0] ?? null;
};

const getLoanIds = loans => (loans ?? []).map(l => l.id).filter(id => !!id);

export default {
	name: 'ThanksPage',
	components: {
		AutoDepositCTA,
		CheckoutReceipt,
		GuestUpsell,
		KvButton,
		MonthlyGoodCTA,
		SocialShareV2,
		ThanksLayoutV2,
		WwwPage,
		ThanksPageCommentAndShare,
		ThanksPageDonationOnly,
		ChallengeHeader,
		ShareChallenge,
		WhatIsNextTemplate,
		ThanksBadges,
		ThanksPageSingleVersion,
	},
	inject: ['apollo', 'cookieStore'],
	head() {
		return {
			title: 'Thank you!'
		};
	},
	data() {
		return {
			lender: {},
			loans: [],
			totalLoanCount: 0,
			receipt: null,
			isMonthlyGoodSubscriber: false,
			hasModernSub: false,
			isGuest: false,
			pageData: {},
			jumpToGuestUpsell: false,
			monthlyDonationAmount: '',
			isFirstLoan: false,
			isFtdMessageEnable: false,
			ftdCreditAmount: '',
			goal: null,
			showChallengeHeader: false,
			enableMayChallengeHeader: false,
			optedIn: false,
			DONATION_ONLY_VIEW,
			MY_KIVA_BADGES_VIEW,
			MARKETING_OPT_IN_VIEW,
			V2_VIEW,
			COMMENT_AND_SHARE_VIEW,
			LOGIN_REQUIRED_VIEW,
			myKivaExperimentEnabled: false,
			myKivaEnabled: false,
			badgesAchieved: [],
			thanksSingleVersionEnabled: false,
			SINGLE_VERSION_VIEW,
			guestUsername: '',
			achievementsCompleted: false,
			isNextStepsExpEnabled: false,
		};
	},
	apollo: {
		preFetch(config, client, { cookieStore, route }) {
			return Promise.all([
				client.query({ query: thanksPageQuery }),
				client.query({ query: experimentAssignmentQuery, variables: { id: 'share_ask_copy' } }),
				client.query({ query: userAchievementProgressQuery }),
			]).then(() => {
				const transactionId = route?.query?.kiva_transaction_id
					? numeral(route?.query.kiva_transaction_id).value()
					: null;
				// Check if transactionId is null, resolve the promise if missing
				if (!transactionId) {
					logFormatter(
						'Thanks page preFetch skipped due to missing transaction_id.',
						'warning',
					);
					return Promise.resolve();
				}

				return client.query({
					query: thanksPageReceiptQuery,
					variables: {
						checkoutId: transactionId,
						visitorId: cookieStore.get('uiv') || null,
					}
				}).then(({ data }) => {
				// Get teamId from receipt
					let teamId = null;
					const receipt = data?.shop?.receipt ?? null;
					const loans = getLoans(receipt);
					teamId = getTeamId(loans);

					const filters = {
						teamId,
					};
					const limit = 1;

					return Promise.all([
						teamId ? fetchGoals(client, limit, filters) : null,
						fetchPostCheckoutAchievements(client, getLoanIds(loans)),
					]);
				}).catch(errorResponse => {
					logFormatter(
						`Receipt thanks page preFetch failed: (transaction_id: ${transactionId})`,
						'error',
						{ errorResponse }
					);
				});
			}).catch(errorResponse => {
				logFormatter(
					'Thanks page preFetch failed',
					'error',
					{ errorResponse }
				);
			});
		}
	},
	computed: {
		showDafThanks() {
			return !!this.$route?.query?.show_daf_thanks;
		},
		askForComments() {
			// comments ask should be displayed for logged in users
			// checking out with a PFP loan or a loan that is attributed to a team.
			return this.hasPfpLoan || this.hasTeamAttributedPartnerLoan;
		},
		selectedLoan() {
			/**  We should select a loan if we are going to ask for comments for it.
			* The priority order is:
			* 1. PFP loan
			* 2. Partner loan With Team Attribution
			* 3. Loan with the highest unreservedAmount
			* loans should be sorted by unreservedAmount.
			*/
			const orderedLoans = orderBy(this.loans, ['unreservedAmount'], ['desc']);
			if (this.hasPfpLoan) {
				return orderedLoans.find(loan => loan.inPfp);
			}
			if (this.hasTeamAttributedPartnerLoan) {
				return orderedLoans.find(loan => loan?.team?.name);
			}
			return orderedLoans[0] || {};
		},
		hasPfpLoan() {
			return this.loans.some(loan => loan.inPfp);
		},
		hasTeamAttributedPartnerLoan() {
			return this.loans.some(loan => loan?.distributionModel === 'fieldPartner' && loan?.team?.name);
		},
		borrowerSupport() {
			const loanNames = this.loans.map(loan => loan.name);
			if (loanNames.length > 3) {
				return `these ${loanNames.length} borrowers`;
			}
			return joinArray(loanNames, 'and');
		},
		ctaContentGroup() {
			return this.pageData?.page?.contentGroups?.thanksMgCtaJan_2021;
		},
		ctaContentBlock() {
			return this.ctaContentGroup?.contents?.find(contentItem => contentItem.key === 'thanks-mg-cta');
		},
		ctaHeadline() {
			return this.ctaContentBlock?.headline;
		},
		ctaBodyCopy() {
			return this.ctaContentBlock?.subHeadline;
		},
		ctaButtonText() {
			return this.ctaContentBlock?.primaryCtaText;
		},
		isGuestUsCheckout() {
			// Is a guest checking out only with US loans?
			// eslint-disable-next-line no-underscore-dangle
			return this.isGuest && this.loans.every(loan => loan?.__typename === 'LoanDirect');
		},
		showFtdMessage() {
			return this.isFirstLoan && this.isFtdMessageEnable && this.ftdCreditAmount;
		},
		teamId() {
			return getTeamId(this.loans);
		},
		teamPublicId() {
			return this.loans?.[0]?.team?.teamPublicId;
		},
		challengeLoan() {
			return (this.loans?.filter(l => l?.team?.id === this.goal?.teamId) ?? [])?.[0];
		},
		showMayChallengeHeader() {
			return this.challengeLoan
				&& this.enableMayChallengeHeader
				&& this.activeView !== DONATION_ONLY_VIEW
				&& this.activeView !== MARKETING_OPT_IN_VIEW;
		},
		challengeHeaderVisible() {
			return !this.showMayChallengeHeader
				&& this.showChallengeHeader
				&& this.teamPublicId
				&& this.activeView !== DONATION_ONLY_VIEW
				&& this.activeView !== MARKETING_OPT_IN_VIEW;
		},
		teamName() {
			return this.loans?.[0]?.team?.name ?? '';
		},
		receiptValues() {
			return this.receipt?.items?.values ?? [];
		},
		kivaCards() {
			if (!this.receiptValues.length) return [];
			return this.receipt.items.values.filter(item => item.basketItemType === 'kiva_card');
		},
		printableKivaCards() {
			if (!this.kivaCards.length) return [];
			return this.kivaCards.filter(card => card.kivaCardObject.deliveryType === 'print');
		},
		activeView() {
			// Show the donation only view if the user has only subscribed to a donation
			if (this.showDafThanks || this.monthlyDonationAmount) {
				return DONATION_ONLY_VIEW;
			}
			// Show the login required view if we couldn't get the receipt
			if (!this.receipt) {
				return LOGIN_REQUIRED_VIEW;
			}
			// Show the single version view if the experiment is enabled
			if (this.thanksSingleVersionEnabled) {
				return SINGLE_VERSION_VIEW;
			}
			// Show the donation only view if the user has only donated and not lent
			if (this.receipt?.totals?.itemTotal === this.receipt?.totals?.donationTotal) {
				return DONATION_ONLY_VIEW;
			}
			// Show the MyKiva view if qualifications are met
			if (this.myKivaEnabled) {
				return MY_KIVA_BADGES_VIEW;
			}
			// Show the marketing opt-in view if the user has not opted in and has loans
			if (!this.optedIn && this.loans.length > 0) {
				return MARKETING_OPT_IN_VIEW;
			}
			// Show the comment and share view if jumpToGuestUpsell is not true, there are no printable Kiva cards, and
			// the user is either a guest who made a US loan, or a logged in user who made a loan.
			if (!this.jumpToGuestUpsell
				&& !this.printableKivaCards.length
				&& (this.isGuestUsCheckout || (this.selectedLoan.id && !this.isGuest))
			) {
				return COMMENT_AND_SHARE_VIEW;
			}
			// Show the v2 view by default
			return V2_VIEW;
		},
	},
	setup() {
		const { allAchievementsCompleted } = useBadgeData();

		return {
			allAchievementsCompleted,
		};
	},
	created() {
		// Retrieve and apply Page level data + experiment state
		let data = {};
		let receiptData = {};
		let userAchievements = {};

		try {
			data = this.apollo.readQuery({
				query: thanksPageQuery,
			});

			userAchievements = this.apollo.readQuery({
				query: userAchievementProgressQuery,
			});

			const achievements = userAchievements?.userAchievementProgress?.tieredLendingAchievements ?? [];
			this.achievementsCompleted = this.allAchievementsCompleted(achievements);
		} catch (e) {
			logReadQueryError(e, 'Thanks page readQuery failed');
		}

		const hasEverLoggedIn = data?.hasEverLoggedIn;
		const modernSubscriptions = data?.mySubscriptions?.values ?? [];
		this.hasModernSub = modernSubscriptions.length !== 0;
		this.lender = {
			...(data?.my?.userAccount ?? {}),
			publicName: data?.my?.lender?.name ?? '',
			teams: data?.my?.teams?.values?.map(value => value.team) ?? [],
			imageUrl: data?.my?.lender?.image?.url ?? '',
			publicId: data?.my?.lender?.publicId ?? '',
		};

		this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;

		// Enable FTDs message from settings
		this.isFtdMessageEnable = readBoolSetting(data, 'general.ftd_message_enable.value');
		// Credit amount for FTD message from settings
		const ftdCreditAmountData = data?.general?.ftd_message_amount ?? null;
		this.ftdCreditAmount = ftdCreditAmountData ? ftdCreditAmountData.value : '';

		// Enable single version TY page
		this.thanksSingleVersionEnabled = readBoolSetting(data, TY_SINGLE_VERSION_KEY);

		this.optedIn = (data?.my?.communicationSettings?.lenderNews && data?.my?.communicationSettings?.loanUpdates)
			|| this.$route.query?.optedIn === 'true';

		this.guestUsername = this.$route.query?.username ?? '';

		// MyKiva Badges Experiment
		this.myKivaExperimentEnabled = getIsMyKivaEnabled(
			this.apollo,
			this.$kvTrackEvent,
			readBoolSetting(data, MY_KIVA_FOR_ALL_USERS_KEY),
			this.cookieStore,
		);

		this.monthlyDonationAmount = this.$route.query?.monthly_donation_amount ?? null;
		const transactionId = this.$route.query?.kiva_transaction_id
			? numeral(this.$route.query?.kiva_transaction_id).value()
			: null;

		// Check if transactionId is null, exit if missing
		if (!transactionId) {
			logFormatter(
				'Thanks page readQuery skipped due to missing transaction_id.',
				'warning',
			);
			return false;
		}

		try {
			receiptData = this.apollo.readQuery({
				query: thanksPageReceiptQuery,
				variables: {
					checkoutId: transactionId,
					visitorId: this.cookieStore.get('uiv') || null,
				}
			});
		} catch (e) {
			logReadQueryError(e, `Receipt thanks page readQuery failed: (transaction_id: ${transactionId})`);
		}

		// The default empty object and the v-if will prevent the
		// receipt from rendering in the rare cases this query fails.
		// But it will not throw a server error.
		this.receipt = receiptData?.shop?.receipt ?? null;
		this.isGuest = this.receipt && !data?.my?.userAccount;

		this.loans = getLoans(this.receipt);

		// Fetch Goal Information
		try {
			if (this.teamId) {
				const filters = {
					teamId: this.teamId,
				};
				const limit = 1;

				const response = this.apollo.readQuery({
					query: teamsGoalsQuery,
					variables: { ...filters, limit },
				});

				this.goal = response.goals?.values.length ? response?.goals?.values[0] : null;

				const loansIds = this.loans.map(loan => loan.id) ?? [];
				this.showChallengeHeader = this.goal && this.goal?.targets?.values
					.findIndex(target => loansIds.includes(target.loanId)) !== -1;
			}
		} catch (e) {
			logReadQueryError(e, `Teams Goal readQuery failed: (team_id: ${this.teamId})`);
		}

		// MARS-194-User metrics A/B Optimizely experiment
		const depositTotal = this.receipt?.totals?.depositTotals?.depositTotal;

		const hasLentBefore = this.loans.length > 0;
		const hasDepositBefore = parseFloat(depositTotal) > 0;

		this.cookieStore.set(hasLentBeforeCookie, hasLentBefore, { path: '/' });
		this.cookieStore.set(hasDepositBeforeCookie, hasDepositBefore, { path: '/' });

		userHasLentBefore(hasLentBefore);
		userHasDepositBefore(hasDepositBefore);

		this.totalLoanCount = data?.my?.loans?.totalCount ?? 0;
		const isFirstLoan = this.loans.length && this.totalLoanCount === this.loans.length;
		this.isFirstLoan = isFirstLoan;
		const hasDirectLoan = this.loans.findIndex(loan => loan.distributionModel === 'direct') > -1;
		const hasCoreLoan = this.loans.findIndex(loan => loan.distributionModel === 'fieldPartner') > -1;

		// MARS-246 Hotjar user attributes
		setHotJarUserAttributes({
			userId: data?.my?.userAccountId?.id,
			hasEverLoggedIn,
			hasLentBefore,
			hasDepositBefore,
			isFirstLoan,
			hasDirectLoan,
			hasCoreLoan
		});

		if (!this.isGuest && !data?.my?.userAccount) {
			logFormatter(
				`Failed to get lender for transaction id: ${transactionId}`,
				'info',
				{ ...data, ...receiptData }
			);
		}
		if (!this.receipt) {
			logFormatter(
				`Failed to get receipt for transaction id: ${transactionId}`,
				'info',
				{ ...data, ...receiptData }
			);
		}

		// Check for contentful content
		const pageEntry = data?.contentful?.entries?.items?.[0] ?? null;
		this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;

		// Check for May challenge header experiment
		const shareChallengeExpData = this.apollo.readFragment({
			id: `Experiment:${CHALLENGE_HEADER_EXP}`,
			fragment: experimentVersionFragment,
		}) || {};
		this.enableMayChallengeHeader = shareChallengeExpData?.version === 'b';

		if (this.myKivaExperimentEnabled) {
			try {
				const response = this.apollo.readQuery({
					query: postCheckoutAchievementsQuery,
					variables: { loanIds: getLoanIds(this.loans) },
				});
				this.badgesAchieved = response?.postCheckoutAchievements?.overallProgress ?? [];
				// Don't show badges without a new tier achieved
				this.badgesAchieved = this.badgesAchieved.filter(b => {
					// The equality badge doesn't have tiers
					return b.preCheckoutTier === null || b.preCheckoutTier !== b.postCheckoutTier;
				});
				// MyKiva view only shown if user:
				// - Doesn't have a printable Kiva card and has a loan in checkout
				// - AND (is guest, is not opted-in, or checkout achieved badges)
				this.myKivaEnabled = !this.printableKivaCards.length && hasLentBefore
					&& (this.isGuest || !this.optedIn || this.badgesAchieved.length > 0);
			} catch (e) {
				logReadQueryError(e, 'ThanksPage postCheckoutAchievementsQuery');
			}
		}

		// Track Impact Goals Experiment
		if (this.thanksSingleVersionEnabled) {
			this.determineNextStepsExpEnabled();
		}

		// Track may challenge page view
		if (this.showMayChallengeHeader) {
			this.$kvTrackEvent('post-checkout', 'show', 'may-challenge-header', this.isGuest ? 'guest' : 'signed-in');
		}

		// Track login required view
		if (this.activeView === LOGIN_REQUIRED_VIEW) {
			this.$kvTrackEvent('post-checkout', 'show', 'need-to-login-view', this.isGuest ? 'guest' : 'signed-in');
		}

		this.$kvTrackEvent(
			'post-checkout',
			'show',
			`active-view-${this.activeView}`,
			this.isGuest ? 'guest' : 'signed-in'
		);
	},
	methods: {
		createGuestAccount() {
			// This is the only place this variable should be set.
			// When this is true, it will override all logic and show the thanks page v2
			this.jumpToGuestUpsell = true;
		},
		determineNextStepsExpEnabled() {
			const nextStepsExpData = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'event-tracking',
				NEXT_STEPS_EXP_KEY,
				'EXP-MP-1984-Sept2025'
			);

			this.isNextStepsExpEnabled = nextStepsExpData.version === 'b';
		}
	}
};

</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.page-content {
	padding: 1.625rem 0 0;

	@media print {
		padding: 0;
	}

	&:last-child {
		padding-bottom: 5rem;
	}
}

.thanks {
	&__header {
		text-align: left;
		margin-bottom: 2.5rem;

		@include breakpoint(medium) {
			text-align: center;
		}
	}

	&__social-share {
		margin-bottom: 0.5rem;
	}
}
</style>
