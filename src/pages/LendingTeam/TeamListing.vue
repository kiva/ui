<template>
	<div>
		<div class="tw-flex
		tw-justify-between
		tw-items-baseline
		tw-mb-4"
		>
			<h2 class="tw-text-h3">
				Team Listing
			</h2>
			<p class="tw-text-small">
				{{ numeral(totalCount).format('0,0') }} lending teams in all categories
			</p>
		</div>
		<team-search-bar @search="handleSearchQuery"
			id="team-list-search-bar"
		/>
		<div class="md:tw-flex
		md:tw-flex-row
		tw-items-baseline
		tw-mb-4
		md:tw-justify-between"
		>
			<div class="tw-w-full
			md:tw-w-auto "
			>
				<kv-select class="tw-mt-2"
					id="category"
					v-model="teamCategory"
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
						Religous Congregations
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
			<div class="tw-w-full md:tw-w-auto ">
				<kv-select class="tw-mt-2" id="categoryTeams" v-model="teamOption">
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
			<div class="tw-text-small
			tw-mt-4
			tw-whitespace-nowrap
			tw-w-full md:tw-w-auto"
			>
				Sort by:
			</div>
			<div class="tw-w-full md:tw-w-auto">
				<kv-select class="tw-mt-2" id="categorySort" v-model="teamSort">
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
		<div v-for="team in teams"
			:key="team.id"
			class="tw-mb-4 tw-bg-primary tw-rounded tw-p-2"
			style="filter: drop-shadow(0px 4px 15px rgba(0, 0, 0, 0.25));"
		>
			<div class="tw-flex tw-flex-row">
				<img v-if="team.image && team.image.url"
					class="tw-w-12 tw-h-12 tw-flex-none"
					:src="team.image.url"
				>
				<img v-else class="tw-w-12 tw-h-12 tw-flex-none"
					:src="teamNoImage"
				>

				<div class="tw-flex
				tw-flex-row
				tw-mt-1
				tw-ml-1
				tw-overflow-hidden
				tw-text-ellipsis
				tw-whitespace-nowrap"
				>
					<div class="tw-pt-1
					tw-overflow-hidden
					tw-text-ellipsis"
					>
						<router-link :to="`/team/${team.teamPublicId}`"
							state=""
							class=""
						>
							<h3 class="tw-font-medium
							tw-text-h3
							tw-text-primary
							tw-overflow-hidden
							tw-text-ellipsis"
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
			<div class="tw-flex
			tw-justify-between
			tw-mt-1"
			>
				<div>
					<p class="tw-text-small
					tw-text-tertiary
					tw-flex-1"
					>
						We loan because: {{ team.loanBecause }}
					</p>
				</div>
				<div class="tw-flex-none tw-ml-2 tw-self-end">
					<kv-button v-if="team.membershipType != 'closed' "
						variant="primary"
						to="/teams/create"
					>
						Join Team
					</kv-button>

					<kv-button v-else variant="primary"
						to="/teams/create"
					>
						Request to Join
					</kv-button>
				</div>
			</div>
		</div>
		<kv-pagination v-if="totalCount > 0"
			:total="totalCount"
			:limit="limit"
			@page-change="pageChange"
		/>
	</div>
</template>

<script>

import { format } from 'date-fns';
import numeral from 'numeral';
import KvPagination from '@/components/Kv/KvPagination';
import _mapValues from 'lodash/mapValues';
import _isEqual from 'lodash/isEqual';
import teamNoImage from '@/assets/images/team_s135.png';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import { fetchTeams } from '../../util/teamsUtil';
import TeamSearchBar from './TeamSearchBar';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

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

export default {
	name: 'TeamListing',
	components: {
		KvSelect,
		TeamSearchBar,
		KvButton,
		KvPagination,
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
			pageQuery: { page: '1' }
		};
	},
	computed: {
		urlParams() {
			return toUrlParams({
				offset: this.offset,
			});
		},
	},
	methods: {
		handleSearchQuery(queryString) {
			this.queryString = queryString;
			console.log(this.queryString);
		},
		pageChange(number) {
			const offset = teamsPerPage * (number - 1);
			this.offset = offset;
			this.pushChangesToUrl();
		},
		pushChangesToUrl() {
			if (!_isEqual(this.$route.query, this.urlParams)) {
				this.$router.push({ query: this.urlParams, hash: 'team-list-search-bar' });
			}
		},
	},
	mounted() {
		this.$watch(() => ({
			teamSort: this.teamSort,
			teamCategory: this.teamCategory,
			teamOption: this.teamOption,
			queryString: this.queryString,
			offset: this.offset
		}), vars => {
			fetchTeams(this.apollo, vars.teamSort, vars.teamCategory, vars.teamOption,
				vars.queryString, vars.offset, this.limit).then(teams => {
				this.teams = teams.values;
				this.totalCount = teams.totalCount;
			});
		}, { immediate: true });
	},
};
</script>
