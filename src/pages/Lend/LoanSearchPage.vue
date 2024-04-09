<template>
	<www-page id="lend-filter" class="tw-bg-secondary">
		<challenge-callout
			v-if="showChallengeHeader && !!teamData"
			:class="{'tw-sticky tw-top-0 tw-z-sticky' : showAddedToCartMessage}"
			class="tw-pb-1.5"
			:share-lender="shareLender"
			:current-lender="currentLender"
			:team-name="teamData.name"
			:show-added-to-cart-message="showAddedToCartMessage"
			:goal-participation-for-loan="goalParticipationForLoan"
			:borrower-name="borrowerName"
		/>
		<article
			class="tw-bg-secondary tw-relative"
			:class="{'tw-pt-6': !showChallengeHeader, 'tw-pt-3 lg:tw-pt-5': showChallengeHeader }"
		>
			<kv-page-container>
				<challenge-header
					v-if="showChallengeHeader"
					:challenge-data="challengeData"
					:team-data="teamData"
				/>
				<div v-else class="tw-flex tw-items-start tw-pb-8">
					<div class="tw-flex-1">
						<h1 class="tw-mb-2">
							Make a loan, change a life
						</h1>
						<p class="tw-text-h3 tw-text-secondary md:tw-w-2/3 tw-mb-3p tw-hidden md:tw-block">
							Each Kiva loan helps people build a better future for themselves and their families.
						</p>
					</div>
					<a
						href="/lend-by-category"
						class="
							tw-mb-2 tw-mt-3 tw-px-1 md:tw-px-2
							tw-border-r tw-border-tertiary
							tw-text-secondary hover:tw-text-action
							tw-text-center hover:tw-no-underline"
					>
						<kv-material-icon :icon="mdiEarth" class=" tw-w-3 tw-h-3" />
						<span class="tw-hidden md:tw-block">
							Explore
						</span>
					</a>
					<a class="tw-mb-2 tw-mt-3 tw-px-1 md:tw-px-2 tw-text-center hover:tw-no-underline">
						<kv-material-icon :icon="mdiFilter" class="tw-text-brand tw-w-3 tw-h-3" />
						<span class="tw-text-secondary tw-hidden md:tw-block">
							Filters
						</span>
					</a>
				</div>
				<loan-search-interface
					:extend-flss-filters="extendFlssFilters"
					:enable-saved-search="enableSavedSearch"
					:enable-five-dollars-notes="enableFiveDollarsNotes"
					:challenge-data="challengeData"
					:show-loans-activity-feed="showLoansActivityFeed"
					:enable-huge-amount="enableHugeLendAmount"
					@add-to-basket="addToBasketCallback"
					:team-name="teamName"
				/>
			</kv-page-container>
		</article>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanSearchInterface from '@/components/Lend/LoanSearch/LoanSearchInterface';
import ChallengeHeader from '@/components/Lend/LoanSearch/ChallengeHeader';
import { mdiEarth, mdiFilter, mdiClose } from '@mdi/js';
import { trackExperimentVersion } from '@/util/experiment/experimentUtils';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import TeamInfoFromId from '@/graphql/query/teamInfoFromId.graphql';
import teamsGoalsQuery from '@/graphql/query/teamsGoals.graphql';
import myTeamsQuery from '@/graphql/query/myTeams.graphql';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '@/plugins/five-dollars-test-mixin';
import hugeLendAmount from '@/plugins/huge-lend-amount-mixin';
import lenderPublicProfileQuery from '@/graphql/query/lenderPublicProfile.graphql';
import goalParticipationForLoanQuery from '@/graphql/query/goalParticipationForLoan.graphql';
import myPublicLenderInfoQuery from '@/graphql/query/myPublicLenderInfo.graphql';
import logReadQueryError from '@/util/logReadQueryError';
import ChallengeCallout from '@/components/Lend/LoanSearch/ChallengeCallout';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import { setChallengeCookieData } from '../../util/teamChallengeUtils';

const FLSS_ONGOING_EXP_KEY = 'EXP-FLSS-Ongoing-Sitewide-2';
const CATEGORY_REDIRECT_EXP_KEY = 'category_filter_redirect';
const CHALLENGE_HEADER_EXP = 'filters_challenge_header';
const SHOW_LOANS_ACTIVITY_FEED_EXP = 'filter_loans_activity_feed';

const getHasEverLoggedIn = client => !!(client.readQuery({ query: hasEverLoggedInQuery })?.hasEverLoggedIn);

const sortAmountLentTeamArray = userTeams => {
	return [...userTeams].sort((a, b) => {
		const aAmountLent = parseFloat(a?.amountLent) ?? 0;
		const bAmountLent = parseFloat(b?.amountLent) ?? 0;
		return aAmountLent > bAmountLent ? -1 : 1;
	});
};

const getUserChallengeTeam = (userTeams, activeGoals) => {
	let sortedAmountLentTeams = [];
	let userChallengeTeam = {};
	if (userTeams.length > 0) {
		sortedAmountLentTeams = sortAmountLentTeamArray(userTeams);
		for (let index = 0; index < sortedAmountLentTeams.length; index += 1) {
			const team = sortedAmountLentTeams[index];
			const goal = activeGoals.find(g => g?.teamId === team?.team?.id);
			if (goal && Object.keys(goal).length > 0) {
				userChallengeTeam = team;
				break;
			}
		}
	}
	return userChallengeTeam;
};

export default {
	name: 'LoanSearchPage',
	components: {
		WwwPage,
		KvPageContainer,
		KvMaterialIcon,
		LoanSearchInterface,
		ChallengeHeader,
		ChallengeCallout,
	},
	data() {
		return {
			extendFlssFilters: false,
			enableSavedSearch: true,
			mdiEarth,
			mdiFilter,
			mdiClose,
			savedSearchName: '',
			enableChallengeHeader: false,
			challengeData: {},
			teamData: {},
			shareLender: null,
			showAddedToCartMessage: false,
			goalParticipationForLoan: null,
			borrowerName: undefined,
			currentLender: undefined,
			showLoansActivityFeed: false,
		};
	},
	mixins: [fiveDollarsTest, hugeLendAmount],
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client, args) {
			return Promise.all([
				client.query({ query: experimentQuery, variables: { id: CATEGORY_REDIRECT_EXP_KEY } }),
				client.query({ query: experimentQuery, variables: { id: CHALLENGE_HEADER_EXP } }),
			]).then(() => {
				const query = args?.route?.query ?? {};
				const loggedInUser = getHasEverLoggedIn(client);

				// Redirect to /lend-category-beta if user has previously signed in and experiment is assigned
				const { version } = client.readFragment({
					id: `Experiment:${CATEGORY_REDIRECT_EXP_KEY}`,
					fragment: experimentVersionFragment,
				}) ?? {};

				if (version === 'b' && loggedInUser) {
					return Promise.reject({ path: '/lend-category-beta', query });
				}

				// Fetch challenge header experiment data
				const challengeHeaderExpData = client.readFragment({
					id: `Experiment:${CHALLENGE_HEADER_EXP}`,
					fragment: experimentVersionFragment,
				}) ?? {};

				const teamPublicId = query?.team ?? '';
				let userPromise = Promise.resolve();
				let goalsPromise = Promise.resolve();
				const activeChallengeHeaderExp = challengeHeaderExpData?.version === 'b';
				if (activeChallengeHeaderExp && !teamPublicId && loggedInUser) {
					userPromise = client.query({
						query: myTeamsQuery,
					});
					goalsPromise = client.query({
						query: teamsGoalsQuery,
						variables: { isActive: true, status: 'IN_PROGRESS' }
					});
				}

				return Promise.all([
					client.query({ query: experimentQuery, variables: { id: 'extend_flss_filters' } }),
					client.query({ query: experimentQuery, variables: { id: FLSS_ONGOING_EXP_KEY } }),
					client.query({ query: experimentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } }),
					teamPublicId,
					userPromise,
					activeChallengeHeaderExp,
					goalsPromise,
				]);
			}).then(response => {
				const teamPublicId = response[3];
				const userTeams = response[4]?.data?.my?.teams?.values ?? [];
				const activeChallengeHeaderExp = response[5];
				const activeGoals = response[6]?.data?.goals?.values ?? [];

				let userChallengeTeam = {};
				if (!teamPublicId && userTeams.length > 0 && activeChallengeHeaderExp) {
					userChallengeTeam = getUserChallengeTeam(userTeams, activeGoals);
				}

				let teamDataPromise = Promise.resolve();
				if (teamPublicId && activeChallengeHeaderExp) {
					teamDataPromise = client.query({ query: TeamInfoFromId, variables: { team_public_id: teamPublicId } }); // eslint-disable-line max-len
				}
				const userTeamId = userChallengeTeam?.team?.id ?? null;

				return Promise.all([
					teamDataPromise,
					userTeamId,
					activeChallengeHeaderExp,
				]);
			}).then(responseTeams => {
				const queryTeamId = responseTeams[0]?.data?.community?.team?.id ?? null;
				const userTeamId = responseTeams[1] ?? null;
				const activeChallengeHeaderExp = responseTeams[2];
				const teamId = queryTeamId || userTeamId;

				const lenderPublicId = args?.route?.query?.lender ?? '';

				if (teamId && activeChallengeHeaderExp) {
					return Promise.all([
						client.query({ query: teamsGoalsQuery, variables: { teamId, limit: 1 } }),
						client.query({ query: TeamInfoFromId, variables: { team_id: teamId } }),
						lenderPublicId
							? client.query({ query: lenderPublicProfileQuery, variables: { publicId: lenderPublicId } })
							: null,
					]);
				}
			});
		},
	},
	computed: {
		showChallengeHeader() {
			return this.enableChallengeHeader && !!this.challengeData?.id;
		},
		teamName() {
			return this.teamData?.name ?? '';
		}
	},
	methods: {
		async addToBasketCallback({ loanId, name }) {
			if (this.showChallengeHeader) {
				this.borrowerName = name;

				// Add challenge override cookie for team attribution on checkout
				const challenge = {
					teamId: this.teamData?.id,
					teamName: this.teamData?.name ?? '',
					loanId
				};
				setChallengeCookieData(this.cookieStore, challenge);

				// Trigger challenge header message about other lenders
				try {
					const goalParticipationPromise = this.apollo.query({
						query: goalParticipationForLoanQuery,
						variables: {
							goalId: this.challengeData.id,
							loanId: loanId.toString(),
						}
					});
					const myPublicLenderInfoPromise = this.apollo.query({ query: myPublicLenderInfoQuery });
					const [participationData, myData] = await Promise.all([
						goalParticipationPromise,
						myPublicLenderInfoPromise,
					]);
					this.goalParticipationForLoan = participationData?.data?.goalParticipationForLoan?.values ?? [];
					this.currentLender = myData?.data?.my ?? {};
				} catch (e) {
					console.error(e);
				}

				this.showAddedToCartMessage = true;
			}
		},
	},
	created() {
		this.initializeFiveDollarsNotes();

		// Enable huge lend amount
		this.initializeHugeLendAmount();

		// Extended FLSS Loan Filter Experiment
		const showMoreFiltersExp = this.apollo.readFragment({
			id: 'Experiment:extend_flss_filters',
			fragment: experimentVersionFragment,
		}) || {};
		this.extendFlssFilters = showMoreFiltersExp.version === 'b';
		if (showMoreFiltersExp.version) {
			this.$kvTrackEvent(
				'Lending',
				'EXP-VUE-1323-Nov-2022',
				showMoreFiltersExp.version
			);
		}

		// Show loans activity feed experiment
		const showLoansActivityFeedExp = this.apollo.readFragment({
			id: `Experiment:${SHOW_LOANS_ACTIVITY_FEED_EXP}`,
			fragment: experimentVersionFragment,
		}) || {};
		this.showLoansActivityFeed = showLoansActivityFeedExp.version === 'b';

		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			FLSS_ONGOING_EXP_KEY,
			'EXP-VUE-FLSS-Ongoing-Sitewide'
		);

		const challengeHeaderExpData = this.apollo.readFragment({
			id: `Experiment:${CHALLENGE_HEADER_EXP}`,
			fragment: experimentVersionFragment,
		}) || {};
		this.enableChallengeHeader = challengeHeaderExpData?.version === 'b';

		if (this.enableChallengeHeader) {
			const teamPublicId = this.$route?.query?.team ?? '';
			let teamId = null;
			if (teamPublicId) {
				const teamInfo = this.apollo.readQuery({ query: TeamInfoFromId, variables: { team_public_id: teamPublicId } }); // eslint-disable-line max-len
				teamId = teamInfo?.community?.team?.id ?? null;
			} else {
				const userTeamsData = this.apollo.readQuery({ query: myTeamsQuery });
				const goalsData = this.apollo.readQuery({ query: teamsGoalsQuery, variables: { isActive: true, status: 'IN_PROGRESS' } }); // eslint-disable-line max-len
				const userTeams = userTeamsData.my?.teams?.values ?? [];
				const activeGoals = goalsData?.goals?.values ?? [];

				let userChallengeTeam = {};
				if (userTeams.length > 0) {
					userChallengeTeam = getUserChallengeTeam(userTeams, activeGoals);
				}

				teamId = userChallengeTeam?.team?.id ?? null;
			}
			if (teamId) {
				const goalsData = this.apollo.readQuery({ query: teamsGoalsQuery, variables: { teamId, limit: 1 } });
				this.challengeData = goalsData?.goals?.values?.[0] || {};
				if (this.challengeData?.id) {
					const teamData = this.apollo.readQuery({ query: TeamInfoFromId, variables: { team_id: teamId } });
					this.teamData = teamData?.community?.team || {};

					try {
						const publicId = this.$route.query.lender;
						const data = this.apollo.readQuery({
							query: lenderPublicProfileQuery,
							variables: {
								publicId,
							}
						});
						this.shareLender = data?.community?.lender ?? {};
					} catch (e) {
						logReadQueryError(
							e,
							`Lender public profile readQuery failed: (publicId: ${this.publicId})`,
						);
					}
				}
			}
		}
	},
	mounted() {
		if (getHasEverLoggedIn(this.apollo)) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				CATEGORY_REDIRECT_EXP_KEY,
				'EXP-CORE-1205-May2023'
			);
		}

		// Track experiment version for challenge header
		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			CHALLENGE_HEADER_EXP,
			'EXP-ACK-1038-May2024',
		);

		// Track experiment version for loans activity feed
		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			SHOW_LOANS_ACTIVITY_FEED_EXP,
			'EXP-ACK-1098-May2024',
		);
	},
};
</script>
