<template>
	<www-page data-testid="thanks-page">
		<template v-if="activeView === SINGLE_VERSION_VIEW">
			<ThanksPageSingleVersion
				:is-guest="isGuest"
				:is-opted-in="optedIn"
				:lender="lender"
				:loans="loans"
				:receipt="receipt"
				:monthly-donation-amount="monthlyDonationAmount"
				:badges-achieved="badgesAchieved"
				:guest-username="guestUsername"
				:achievements-completed="achievementsCompleted"
				:is-next-steps-exp-enabled="isNextStepsExpEnabled"
				:goals-v2-enabled="goalsV2Enabled"
				:total-loans="totalLoanCount"
				:tiered-achievements="achievements"
			/>
		</template>
		<template v-if="activeView === DONATION_ONLY_VIEW">
			<thanks-page-donation-only
				:monthly-donation-amount="monthlyDonationAmount"
				:show-daf-thanks="showDafThanks"
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
	</www-page>
</template>

<script>
import numeral from 'numeral';
import logReadQueryError from '#src/util/logReadQueryError';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import ThanksPageDonationOnly from '#src/components/Thanks/ThanksPageDonationOnly';
import thanksPageQuery from '#src/graphql/query/thanksPage.graphql';
import thanksPageReceiptQuery from '#src/graphql/query/thanksPageReceipt.graphql';
import { userHasLentBefore, userHasDepositBefore } from '#src/util/optimizelyUserMetrics';
import { setHotJarUserAttributes } from '#src/util/hotJarUtils';
import logFormatter from '#src/util/logFormatter';
import { joinArray } from '#src/util/joinArray';
import ChallengeHeader from '#src/components/Thanks/ChallengeHeader';
import ShareChallenge from '#src/components/Thanks/ShareChallenge';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import { KvButton } from '@kiva/kv-components';
import { fetchGoals } from '#src/util/teamsUtil';
import teamsGoalsQuery from '#src/graphql/query/teamsGoals.graphql';
import { fetchPostCheckoutAchievements } from '#src/util/myKivaUtils';
import ThanksPageSingleVersion from '#src/components/Thanks/ThanksPageSingleVersion';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import useBadgeData, { ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';
import { initializeExperiment } from '#src/util/experiment/experimentUtils';
import { readBoolSetting } from '#src/util/settingsUtils';
import { isGoalsV2Enabled, LAST_YEAR_KEY, GOALS_V2_START_YEAR } from '#src/composables/useGoalData';
import userYearlyProgressQuery from '#src/graphql/query/userYearlyProgress.graphql';
import { clearPromoCreditBannerCookie, getPromoCreditBannerCookie } from '#src/util/promoCreditCookie';

const hasLentBeforeCookie = 'kvu_lb';
const hasDepositBeforeCookie = 'kvu_db';
const CHALLENGE_HEADER_EXP = 'filters_challenge_header';
const NEXT_STEPS_EXP_KEY = 'mykiva_next_steps';
const THANK_YOU_PAGE_GOALS_ENABLE_KEY = 'thankyou_page_goals_enable';

// Thanks views
const DONATION_ONLY_VIEW = 'donation_only';
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
		KvButton,
		WwwPage,
		ThanksPageDonationOnly,
		ChallengeHeader,
		ShareChallenge,
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
			receipt: null,
			isGuest: false,
			monthlyDonationAmount: '',
			goal: null,
			showChallengeHeader: false,
			enableMayChallengeHeader: false,
			optedIn: false,
			DONATION_ONLY_VIEW,
			LOGIN_REQUIRED_VIEW,
			badgesAchieved: [],
			SINGLE_VERSION_VIEW,
			guestUsername: '',
			achievementsCompleted: false,
			isNextStepsExpEnabled: false,
			thanksPageGoalsEntrypointEnable: false,
			totalLoanCount: 0,
			achievements: [],
		};
	},
	apollo: {
		preFetch(_config, client, { cookieStore, route }) {
			return Promise.all([
				client.query({ query: thanksPageQuery }),
				client.query({ query: experimentAssignmentQuery, variables: { id: NEXT_STEPS_EXP_KEY } }),
				// Query returns both progressForYear (for specified year) and totalProgressToAchievement (all-time)
				client.query({
					query: userAchievementProgressQuery,
					variables: { year: LAST_YEAR_KEY },
					fetchPolicy: 'network-only',
				}),
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
					const loanIds = getLoanIds(loans);

					return Promise.all([
						teamId ? fetchGoals(client, limit, filters) : null,
						fetchPostCheckoutAchievements(client, loanIds),
						client.query({
							query: userYearlyProgressQuery,
							variables: { loanIds, year: GOALS_V2_START_YEAR },
						}),
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
		goalsV2Enabled() {
			return isGoalsV2Enabled(this.thanksPageGoalsEntrypointEnable);
		},
		showDafThanks() {
			return !!this.$route?.query?.show_daf_thanks;
		},
		borrowerSupport() {
			const loanNames = this.loans.map(loan => loan.name);
			if (loanNames.length > 3) {
				return `these ${loanNames.length} borrowers`;
			}
			return joinArray(loanNames, 'and');
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
				&& this.activeView !== DONATION_ONLY_VIEW;
		},
		challengeHeaderVisible() {
			return !this.showMayChallengeHeader
				&& this.showChallengeHeader
				&& this.teamPublicId
				&& this.activeView !== DONATION_ONLY_VIEW;
		},
		teamName() {
			return this.loans?.[0]?.team?.name ?? '';
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
			return SINGLE_VERSION_VIEW;
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

			// Query with LAST_YEAR_KEY returns progressForYear for last year (goal suggestions)
			// and tiers.completedDate for all-time achievement completion check
			userAchievements = this.apollo.readQuery({
				query: userAchievementProgressQuery,
				variables: { year: LAST_YEAR_KEY },
			});

			this.achievements = userAchievements?.userAchievementProgress?.tieredLendingAchievements ?? [];
			this.achievementsCompleted = this.allAchievementsCompleted(this.achievements);
			this.thanksPageGoalsEntrypointEnable = readBoolSetting(data, `general.${THANK_YOU_PAGE_GOALS_ENABLE_KEY}.value`) ?? false; // eslint-disable-line max-len
		} catch (e) {
			logReadQueryError(e, 'Thanks page readQuery failed');
		}

		const hasEverLoggedIn = data?.hasEverLoggedIn;
		this.lender = {
			...(data?.my?.userAccount ?? {}),
			publicName: data?.my?.lender?.name ?? '',
			teams: data?.my?.teams?.values?.map(value => value.team) ?? [],
			imageUrl: data?.my?.lender?.image?.url ?? '',
			publicId: data?.my?.lender?.publicId ?? '',
		};

		this.optedIn = (data?.my?.communicationSettings?.lenderNews && data?.my?.communicationSettings?.loanUpdates)
			|| this.$route.query?.optedIn === 'true';

		this.guestUsername = this.$route.query?.username ?? '';

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

		// It is likely that achievement service have some loan count delay.
		// This ensures loan count is correct for women category
		const loanIds = getLoanIds(this.loans);
		try {
			const response = this.apollo.readQuery({
				query: userYearlyProgressQuery,
				variables: { loanIds, year: GOALS_V2_START_YEAR },
			});
			const progress = response?.postCheckoutAchievements?.yearlyProgress || [];
			const womenProgress = progress.find(p => p.achievementId === ID_WOMENS_EQUALITY);

			if (womenProgress) {
				this.achievements = this.achievements.map(achievement => {
					if (achievement.id === ID_WOMENS_EQUALITY && womenProgress) {
						return {
							...achievement,
							progressForYear: womenProgress.totalProgress,
						};
					}
					return achievement;
				});
			}
		} catch (e) {
			logReadQueryError(e, 'User yearly progress readQuery failed');
		}

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

		// Check for May challenge header experiment
		const shareChallengeExpData = this.apollo.readFragment({
			id: `Experiment:${CHALLENGE_HEADER_EXP}`,
			fragment: experimentVersionFragment,
		}) || {};
		this.enableMayChallengeHeader = shareChallengeExpData?.version === 'b';

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
		} catch (e) {
			logReadQueryError(e, 'ThanksPage postCheckoutAchievementsQuery');
		}

		initializeExperiment(
			this.cookieStore,
			this.apollo,
			this.$route,
			NEXT_STEPS_EXP_KEY,
			version => {
				this.isNextStepsExpEnabled = version === 'b';
			},
			this.$kvTrackEvent,
			'EXP-MP-1984-Sept2025',
		);

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
	mounted() {
		// If bonus was applied and showPromoCreditPill cookie exists, remove promo credit pill
		if (this.receipt?.total?.bonusAvailableTotal > 0 && getPromoCreditBannerCookie(this.cookieStore)) {
			clearPromoCreditBannerCookie(this.cookieStore);
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
</style>
