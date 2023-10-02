<template>
	<div>
		<div>
			<h3 class="tw-mb-0">
				Team Listing
			</h3>
			<p class="tw-text-small tw-mb-2">
				<!-- eslint-disable-next-line max-len -->
				<span v-if="!loading">{{ numeral(totalCount).format('0,0') }}</span> lending teams in {{ teamCategory ? teamCategoryFriendlyName(teamCategory) : 'all categories' }}
			</p>
		</div>
		<team-search-bar
			@search="handleSearchQuery"
			:initial-value="queryString"
			id="team-list-search-bar"
		/>
		<div
			class="tw-flex tw-flex-wrap tw-gap-1 tw-items-center tw-mt-2 tw-mb-4"
		>
			<div>
				<kv-select
					id="category"
					v-model="teamCategory"
					@update:modelValue="pushChangesToUrl"
					v-kv-track-event="['teams', 'filter', 'teams-search', teamCategory]"
				>
					<option v-for="(category, index) in teamCategories" :key="index" :value="category.value">
						{{ category.label }}
					</option>
				</kv-select>
			</div>
			<div>
				<kv-select
					id="categoryTeams"
					v-model="teamOption"
					@update:modelValue="pushChangesToUrl"
					v-kv-track-event="['teams', 'filter', 'teams-search', teamOption]"
				>
					<option value="">
						-- All Teams --
					</option>
					<option value="open">
						Open Teams
					</option>
					<option value="closed">
						Closed Teams
					</option>
				</kv-select>
			</div>
			<div class="tw-flex tw-items-center">
				<label
					class="tw-text-small tw-w-fit tw-flex-none tw-mx-1"
				>
					Sort by:
				</label>
				<div>
					<kv-select
						id="categorySort" v-model="teamSort"
						@update:modelValue="pushChangesToUrl"
					>
						<option value="newest">
							Newest
						</option>
						<option value="overallLoanedAmount">
							Total Funded
						</option>
						<option value="memberCount">
							Number of Members
						</option>
						<option value="overallLoanCount">
							Number of Loans
						</option>
						<option value="oldest">
							Oldest
						</option>
					</kv-select>
				</div>
			</div>
		</div>
		<template
			v-if="loading"
		>
			<div
				v-for="(n,index) in 3"
				:key="index"
				class="tw-mb-4 tw-bg-primary tw-rounded tw-p-2 tw-drop-shadow-lg"
			>
				<div class="tw-flex tw-flex-row">
					<kv-loading-placeholder class="tw-flex-none" :style="{height: '6rem', width: '6rem'}" />
					<div class="tw-ml-1 tw-w-full">
						<kv-loading-placeholder
							class="tw-mb-1"
							:style="{width: 70 + (Math.random() * 15) + '%', height: '2rem'}"
						/>
						<kv-loading-placeholder
							class="tw-mb-1"
							:style="{width: 60 + (Math.random() * 25) + '%', height: '1.25rem'}"
						/>
						<kv-loading-placeholder
							class="tw-mb-1"
							:style="{width: 70 + (Math.random() * 25) + '%', height: '1.25rem'}"
						/>
					</div>
				</div>
			</div>
		</template>
		<div
			v-else
			v-for="team in teams"
			:key="team.id"
			class="tw-mb-4 tw-bg-primary tw-rounded tw-p-2 tw-drop-shadow-lg"
		>
			<div class="tw-flex tw-flex-row">
				<img
					v-if="team.image && team.image.url"
					class="tw-w-12 tw-h-12 tw-flex-none tw-rounded-sm"
					:src="team.image.url"
				>
				<img
					v-else class="tw-w-12 tw-h-12 tw-flex-none tw-rounded-sm"
					:src="teamNoImage"
				>

				<div
					class="tw-flex tw-flex-row tw-ml-2 tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap"
				>
					<div
						class="tw-overflow-hidden tw-text-ellipsis"
					>
						<router-link
							:to="`/team/${team.teamPublicId}`"
							v-kv-track-event="[
								'teams',
								'click',
								'team-page',
								team.teamPublicId
							]"
						>
							<h3
								class="tw-font-medium tw-text-h3 tw-text-primary tw-overflow-hidden tw-text-ellipsis"
							>
								{{ team.name }}
							</h3>
						</router-link>
						<p v-if="team.name && team.whereabouts" class="tw-text-small tw-text-secondary">
							{{ team.whereabouts }} | Category: {{ team.category }} |
							{{ format(new Date(team.createdDate), 'MMM, yyyy') }}
						</p>
						<p v-else class="tw-text-small tw-text-secondary">
							Category: {{ team.category }} | {{ format(new Date(team.createdDate), 'MMM, yyyy') }}
						</p>
						<p class="tw-text-small tw-text-secondary">
							{{ numeral(team.lenderCount).format('0,0') }} members have funded
							{{ numeral(team.lentAmount).format('$0,0') }} in loans
						</p>
					</div>
				</div>
			</div>
			<div
				class="tw-mt-2"
			>
				<p
					class="tw-text-small tw-text-primary tw-flex-1"
				>
					We loan because: {{ shortLoanBecause(team.loanBecause) }}
				</p>
			</div>
			<div class="tw-mt-2">
				<div v-if="userIsTeamMember(team.id)" class="tw-flex tw-w-full tw-justify-end">
					<kv-button
						variant="secondary"
						:href="`/team/${team.teamPublicId}/recruit`"
						v-kv-track-event="[
							'teams',
							'click',
							'team-recruit',
							team.teamPublicId
						]"
					>
						Recruit friends
					</kv-button>
					<kv-button
						class="tw-ml-2"
						variant="secondary"
						:href="`/teams/quit/process?team_id=${team.id}`"
						v-kv-track-event="[
							'teams',
							'click',
							'team-quit',
							team.teamPublicId
						]"
					>
						Quit team
					</kv-button>
				</div>
				<div v-else class="tw-flex tw-flex-col tw-w-full tw-items-end">
					<!-- Join or request buttons -->
					<kv-button
						v-if="team.membershipType != 'closed'"
						variant="primary"
						:to="`/process-join-team?teamPublicId=${team.teamPublicId}`"
						v-kv-track-event="[
							'teams',
							'click',
							'team-join',
							team.teamPublicId
						]"
					>
						Join Team
					</kv-button>

					<kv-button
						v-else variant="primary"
						:to="`/process-join-team?teamPublicId=${team.teamPublicId}`"
						v-kv-track-event="[
							'teams',
							'click',
							'team-request-join',
							team.teamPublicId
						]"
					>
						Request to Join
					</kv-button>
				</div>
			</div>
		</div>
		<div v-if="teams.length === 0 && !loading">
			<h3 class="tw-text-h3 tw-mb-4 tw-text-secondary tw-text-center">
				No teams found
			</h3>
		</div>
		<kv-pagination
			v-if="totalCount > 0 && !loading"
			:limit="limit"
			:total="totalCount"
			:offset="offset"
			:kv-track-function="$kvTrackEvent"
			track-event-category="teams"
			@page-changed="pageChange"
		/>
	</div>
</template>

<script>

import { format } from 'date-fns';
import numeral from 'numeral';
import _mapValues from 'lodash/mapValues';
import teamNoImage from '@/assets/images/team_s135.png';
import { gql } from '@apollo/client';
import KvPagination from '~/@kiva/kv-components/vue/KvPagination';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import { fetchTeams, teamCategories, teamCategoryFriendlyName } from '../../util/teamsUtil';
import TeamSearchBar from './TeamSearchBar';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

const teamsPerPage = 10;

const urlParamTransform = {
	page: {
		to({ offset }) {
			const page = Math.floor(offset / teamsPerPage) + 1;
			return page > 1 ? String(page) : undefined;
		}
	},
	teamCategory: {
		to({ teamCategory }) {
			return teamCategory;
		}
	},
	teamOption: {
		to({ teamOption }) {
			return teamOption;
		}
	},
	teamSort: {
		to({ teamSort }) {
			return teamSort;
		}
	},
	queryString: {
		to({ queryString }) {
			return queryString;
		}
	},

};

function toUrlParams(variables) {
	return _mapValues(urlParamTransform, ({ to }) => to(variables));
}

function getPageOffset(query, limit) {
	const pageNum = numeral(query.page).value() - 1;

	return pageNum > 0 ? limit * pageNum : 0;
}

const pageQuery = gql`query usersTeams {
	my {
		id
		lender {
			id
			teams(limit: 100) {
				values {
					id
				}
			}
		}
	}
}`;

export default {
	name: 'TeamListing',
	components: {
		KvButton,
		KvLoadingPlaceholder,
		KvPagination,
		KvSelect,
		TeamSearchBar,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			teamCategories,
			teamCategory: '',
			teamOption: '',
			teamSort: 'overallLoanedAmount',
			teams: [],
			totalCount: 0,
			queryString: '',
			teamNoImage,
			format,
			numeral,
			offset: 0,
			limit: teamsPerPage,
			pageQuery: { page: '1' },
			loading: true,
			myTeams: [],
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.myTeams = data.my?.lender?.teams?.values ?? [];
		},
	},
	computed: {
		urlParams() {
			return toUrlParams({
				offset: this.offset,
				...(this.teamCategory !== '' && { teamCategory: this.teamCategory }),
				...(this.teamOption !== '' && { teamOption: this.teamOption }),
				teamSort: this.teamSort,
				queryString: this.queryString,
			});
		},
		lastTeamPage() {
			return Math.ceil(this.totalCount / this.limit);
		}
	},
	methods: {
		handleSearchQuery(queryString) {
			this.queryString = queryString;
			this.pushChangesToUrl();
		},
		// Pagination Related methods
		checkIfPageIsOutOfRange(teamArrayLength, pageQueryParam) {
			// determines if the page query param is for a page that is out of bounds.
			// if it is, changes page to the last page
			const teamsOutOfRange = teamArrayLength === 0 && pageQueryParam;
			if (teamsOutOfRange) {
				this.pageChange({ pageOffset: this.limit * (this.lastTeamPage - 1) });
			}
		},
		pageChange({ pageOffset }) {
			this.offset = pageOffset;
			this.pageQuery = { page: this.offset / this.limit };
			this.pushChangesToUrl();
		},
		pushChangesToUrl() {
			const pushToRouter = variable => {
				this.$router.push({
					query: {
						...this.$route.query,
						[variable]: this.urlParams[variable]
					},
				});
			};
			const { page } = this.$route?.query ?? { page: '0' };
			if (page !== this.urlParams.page) {
				pushToRouter('page');
				return;
			}
			if (this.teamCategory && this.teamCategory !== this.$route.query?.teamCategory) {
				pushToRouter('teamCategory');
				return;
			}
			if (this.teamCategory === '' && this.teamCategory !== this.$route.query?.teamCategory) {
				const query = { ...this.$route.query };
				delete query?.teamCategory;
				this.$router.replace({ query });
			}
			if (this.teamOption && this.teamOption !== this.$route.query?.teamOption) {
				pushToRouter('teamOption');
				return;
			}
			if (this.teamOption === '' && this.teamOption !== this.$route.query?.teamOption) {
				const query = { ...this.$route.query };
				delete query?.teamCategory;
				this.$router.replace({ query });
			}
			if (this.queryString && this.queryString !== this.$route.query?.queryString) {
				pushToRouter('queryString');
				return;
			}
			if (this.teamSort && this.teamSort !== this.$route.query?.teamSort) {
				pushToRouter('teamSort');
			}
		},
		updateFromParams(query) {
			this.offset = getPageOffset(query, this.limit);
			this.teamCategory = query.teamCategory ?? '';
			this.teamOption = query.teamOption ?? '';
			this.teamSort = query.teamSort ?? 'overallLoanedAmount';
			this.queryString = query.queryString ?? '';
		},
		async getTeams({
			teamSort, teamCategory, teamOption, queryString, offset
		}) {
			this.loading = true;
			await fetchTeams(this.apollo, teamSort, teamCategory, teamOption,
				queryString, offset, this.limit).then(teams => {
				this.teams = teams.values;
				this.totalCount = teams.totalCount;
				if (this.teams.length === 0 && this.totalCount > 0) {
					this.checkIfPageIsOutOfRange(this.teams.length, this.pageQuery.page);
				}
			});
			this.loading = false;
		},
		shortLoanBecause(teamLoanBecause) {
			if (teamLoanBecause?.length > 250) {
				return `${teamLoanBecause?.substring(0, 250)}... `;
			}
			return teamLoanBecause;
		},
		userIsTeamMember(teamId) {
			return this.myTeams.some(team => team.id === teamId);
		},
		teamCategoryFriendlyName
	},
	created() {
		// extract query
		this.pageQuery = this.$route.query;
		this.updateFromParams(this.pageQuery);
	},
	mounted() {
		this.$watch(() => ({
			teamSort: this.teamSort,
			teamCategory: this.teamCategory,
			teamOption: this.teamOption,
			queryString: this.queryString,
			offset: this.offset
		}), vars => {
			this.getTeams(vars);
		}, { immediate: true });
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
