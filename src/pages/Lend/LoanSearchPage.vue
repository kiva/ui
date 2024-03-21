<template>
	<www-page id="lend-filter">
		<challenge-callout
			class="tw-bg-secondary md:tw-pt-4 md:tw-pb-1 tw-pb-4"
			v-if="showChallengeHeader && lender"
			:lender="lender"
			:team-name="teamData.name"
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
					:show-challenge-header="showChallengeHeader"
					@add-to-basket="addLoanToChallengeCookie"
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
import lenderPublicProfile from '@/graphql/query/lenderPublicProfile.graphql';
import logReadQueryError from '@/util/logReadQueryError';
import ChallengeCallout from '@/components/Lend/LoanSearch/ChallengeCallout';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import { setChallengeCookieData } from '../../util/teamChallengeUtils';

const FLSS_ONGOING_EXP_KEY = 'EXP-FLSS-Ongoing-Sitewide-2';
const CATEGORY_REDIRECT_EXP_KEY = 'category_filter_redirect';
const CHALLENGE_HEADER_EXP = 'filters_challenge_header';

const getHasEverLoggedIn = client => !!(client.readQuery({ query: hasEverLoggedInQuery })?.hasEverLoggedIn);

const reduceAmountLentTeamArray = userTeams => {
	return userTeams?.reduce((prev, current) => {
		const prevAmountLent = parseFloat(prev?.amountLent) ?? 0;
		const currentAmountLent = parseFloat(current?.amountLent) ?? 0;
		return (prev && prevAmountLent > currentAmountLent) ? prev : current;
	});
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
			lender: null,
		};
	},
	mixins: [fiveDollarsTest],
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
				const activeChallengeHeaderExp = challengeHeaderExpData?.version === 'b';
				if (activeChallengeHeaderExp && !teamPublicId && loggedInUser) {
					userPromise = client.query({
						query: myTeamsQuery,
					});
				}

				const lenderName = query?.lenderName ?? '';
				const lenderPublicId = query?.lender ?? '';

				return Promise.all([
					client.query({ query: experimentQuery, variables: { id: 'extend_flss_filters' } }),
					client.query({ query: experimentQuery, variables: { id: FLSS_ONGOING_EXP_KEY } }),
					client.query({ query: experimentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } }),
					teamPublicId,
					userPromise,
					activeChallengeHeaderExp,
					lenderName && lenderPublicId
						? client.query({ query: lenderPublicProfile, variables: { publicId: lenderPublicId } })
						: null,
				]);
			}).then(response => {
				const teamPublicId = response[3];
				const userTeams = response[4]?.data?.my?.teams?.values ?? [];
				const activeChallengeHeaderExp = response[5];

				let maxAmountLentTeam = {};
				if (!teamPublicId && userTeams.length > 0 && activeChallengeHeaderExp) {
					maxAmountLentTeam = reduceAmountLentTeamArray(userTeams);
				}

				let teamDataPromise = Promise.resolve();
				if (teamPublicId && activeChallengeHeaderExp) {
					teamDataPromise = client.query({ query: TeamInfoFromId, variables: { team_public_id: teamPublicId } }); // eslint-disable-line max-len
				}
				const userTeamId = maxAmountLentTeam?.team?.id ?? null;

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

				if (teamId && activeChallengeHeaderExp) {
					return Promise.all([
						client.query({ query: teamsGoalsQuery, variables: { teamId, limit: 1 } }),
						client.query({ query: TeamInfoFromId, variables: { team_id: teamId } })
					]);
				}
			});
		},
	},
	computed: {
		showChallengeHeader() {
			return this.enableChallengeHeader && !!this.challengeData?.id;
		},
	},
	methods: {
		addLoanToChallengeCookie(loanId) {
			if (this.enableChallengeHeader) {
				const challenge = {
					teamId: this.teamData?.id,
					teamName: this.teamData?.name ?? '',
					loanId
				};
				setChallengeCookieData(this.cookieStore, challenge);
			}
		},
	},
	created() {
		this.initializeFiveDollarsNotes();

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
				const userTeams = userTeamsData.my?.teams?.values ?? [];

				let maxAmountLentTeam = {};
				if (userTeams.length > 0) {
					maxAmountLentTeam = reduceAmountLentTeamArray(userTeams);
				}

				teamId = maxAmountLentTeam?.team?.id ?? null;
			}
			if (teamId) {
				const goalsData = this.apollo.readQuery({ query: teamsGoalsQuery, variables: { teamId, limit: 1 } });
				this.challengeData = goalsData?.goals?.values?.[0] || {};
				const teamData = this.apollo.readQuery({ query: TeamInfoFromId, variables: { team_id: teamId } });
				this.teamData = teamData?.community?.team || {};

				try {
					const publicId = this.$route.query.lender;
					const data = this.apollo.readQuery({
						query: lenderPublicProfile,
						variables: {
							publicId,
						}
					});
					this.lender = data?.community?.lender ?? {};
				} catch (e) {
					logReadQueryError(
						e,
						`Lender public profile readQuery failed: (publicId: ${this.publicId})`,
					);
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
			'EXP-ACK-1038-Mar2024',
		);
	},
};
</script>
