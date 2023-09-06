<template>
	<div>
		<div
			class="tw-flex tw-justify-between tw-items-baseline tw-mb-3"
		>
			<h3>
				Team Listing
			</h3>
			<p class="tw-text-small">
				<!-- eslint-disable-next-line max-len -->
				{{ numeral(totalCount).format('0,0') }} lending teams in {{ teamCategory ? teamCategory : 'all categories' }}
			</p>
		</div>
		<team-search-bar
			@search="handleSearchQuery"
			id="team-list-search-bar"
		/>
		<div
			class="tw-flex tw-flex-wrap tw-gap-1 tw-items-center tw-mt-2 tw-mb-4"
		>
			<div>
				<kv-select
					id="category"
					v-model="teamCategory"
					v-kv-track-event="['teams', 'filter', 'teams-search', teamCategory]"
				>
					<option value="">
						-- All Categories --
					</option>
					<option value="AlumniGroups">
						Alumni Groups
					</option>
					<option value="Businesses">
						Businesses
					</option>
					<option value="BusinessesInternalGroups">
						Business - Internal Groups
					</option>
					<option value="Clubs">
						Clubs
					</option>
					<option value="CollegesUniversities">
						Colleges/Universities
					</option>
					<option value="CommonInterest">
						Common Interest
					</option>
					<option value="Events">
						Events
					</option>
					<option value="Families">
						Families
					</option>
					<option value="FieldPartnerFans">
						Field Partner Fans
					</option>
					<option value="Friends">
						Friends
					</option>
					<option value="LocalArea">
						Local Area
					</option>
					<option value="Memorials">
						Memorials
					</option>
					<option value="ReligiousCongregations">
						Religious Congregations
					</option>
					<option value="Schools">
						Schools
					</option>
					<option value="SportsGroups">
						Sports Groups
					</option>
					<option value="YouthGroups">
						Youth Groups
					</option>
					<option value="Other">
						Other
					</option>
				</kv-select>
			</div>
			<div>
				<kv-select
					id="categoryTeams"
					v-model="teamOption"
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
					<kv-select id="categorySort" v-model="teamSort">
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
					class="tw-flex tw-flex-row tw-mt-1 tw-ml-1 tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap"
				>
					<div
						class="tw-pt-1 tw-overflow-hidden tw-text-ellipsis"
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
						<p v-if="team.name && team.whereabouts" class="tw-text-small tw-text-tertiary">
							{{ team.whereabouts }} | Category: {{ team.category }} |
							{{ format(new Date(team.createdDate), 'MMM, yyyy') }}
						</p>
						<p v-else class="tw-text-small tw-text-tertiary">
							Category: {{ team.category }} | {{ format(new Date(team.createdDate), 'MMM, yyyy') }}
						</p>
						<p class="tw-text-small tw-text-tertiary">
							{{ numeral(team.lenderCount).format('0,0') }} members have funded
							{{ numeral(team.lentAmount).format('$0,0') }} in loans
						</p>
					</div>
				</div>
			</div>
			<div
				class="tw-flex tw-justify-between tw-mt-1"
			>
				<div>
					<p
						class="tw-text-small tw-text-secondary tw-flex-1"
					>
						We loan because: {{ shortLoanBecause(team.loanBecause) }}
					</p>
				</div>
				<div class="tw-flex-none tw-ml-2 tw-self-end">
					<!-- !TODO add functionality to these buttons !
					<kv-button
						v-if="team.membershipType != 'closed' "
						variant="primary"
						to=""
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
						to=""
						v-kv-track-event="[
							'teams',
							'click',
							'team-request-join',
							team.teamPublicId
						]"
					>
						Request to Join
					</kv-button>-->
				</div>
			</div>
		</div>
		<kv-pagination
			v-if="totalCount > 0"
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
import KvPagination from '~/@kiva/kv-components/vue/KvPagination';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import { fetchTeams } from '../../util/teamsUtil';
import TeamSearchBar from './TeamSearchBar';
// import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

const teamsPerPage = 10;

const urlParamTransform = {
	page: {
		to({ offset }) {
			const page = Math.floor(offset / teamsPerPage) + 1;
			return page > 1 ? String(page) : undefined;
		},
		from({ page }) {
			const pagenum = numeral(page).value() - 1;
			return { offset: pagenum > 0 ? teamsPerPage * pagenum : 0 };
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

export default {
	name: 'TeamListing',
	components: {
		// KvButton,
		KvLoadingPlaceholder,
		KvPagination,
		KvSelect,
		TeamSearchBar,
	},
	inject: ['apollo'],
	data() {
		return {
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
			loading: true
		};
	},
	computed: {
		urlParams() {
			return toUrlParams({
				offset: this.offset,
			});
		},
		lastTeamPage() {
			return Math.ceil(this.totalCount / this.limit);
		},
	},
	methods: {
		handleSearchQuery(queryString) {
			this.queryString = queryString;
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
			const { page } = this.$route?.query ?? { page: '0' };
			if (page !== this.urlParams.page) {
				this.$router.push({
					query: {
						...this.$route.query,
						...this.urlParams
					},
				});
			}
		},
		updateFromParams(query) {
			this.offset = getPageOffset(query, this.limit);
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
