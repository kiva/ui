<template>
	<section v-if="lenderTeams.length > 0" class="tw-my-8">
		<h4 class="data-hj-suppress tw-mb-1">
			{{ lenderTeamsTitle }}
		</h4>
		<p class="tw-mb-2">
			{{ showedTeams }}
		</p>

		<div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
			<div
				v-for="team in lenderTeams"
				:key="`team-${team.id}`"
				class="tw-flex tw-flex-col tw-gap-0.5"
			>
				<a
					:href="`/team/${team.teamPublicId}`"
				>
					<kv-material-icon
						v-if="!getImageUrl(team)"
						:icon="mdiAccountCircle"
						class="!tw-block tw-mx-auto tw-w-3/4"
					/>
					<img
						v-else
						:src="getImageUrl(team)"
						style="width: 200px;"
						class="tw-object-cover tw-aspect-square"
					>
				</a>
				<a
					:href="`/team/${team.teamPublicId}`"
				>
					{{ team.name }}
				</a>
				<p>{{ team.category }}</p>
			</div>
		</div>
		<kv-pagination
			class="tw-mt-4"
			v-if="totalCount > teamsLimit"
			:limit="teamsLimit"
			:total="totalCount"
			:offset="teamsOffset"
			:scroll-to-top="false"
			@page-changed="pageChange"
		/>
	</section>
</template>

<script>
import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import numeral from 'numeral';
import { mdiAccountCircle } from '@mdi/js';
import logReadQueryError from '@/util/logReadQueryError';
import lenderTeamsQuery from '@/graphql/query/lenderTeams.graphql';
import KvPagination from '~/@kiva/kv-components/vue/KvPagination';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LenderTeamsList',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvPagination,
		KvMaterialIcon,
	},
	props: {
		publicId: {
			type: String,
			required: true,
		},
		lenderInfo: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			lenderTeams: [],
			teamsLimit: 12,
			teamsOffset: 0,
			totalCount: 0,
			pageQuery: { teams: '1' },
			mdiAccountCircle,
		};
	},
	computed: {
		lenderTeamsTitle() {
			return this.lenderInfo?.name
				? `${this.lenderInfo.name}'s teams`
				: 'Teams';
		},
		showedTeams() {
			return this.totalCount > 1
				? `${this.totalCount} teams`
				: `${this.totalCount} team`;
		},
		urlParams() {
			const teamsPage = Math.floor(this.teamsOffset / this.teamsLimit) + 1;

			return { teams: teamsPage > 1 ? String(teamsPage) : undefined };
		},
	},
	methods: {
		async fetchLenderTeams() {
			try {
				const { data } = await this.apollo.query({
					query: lenderTeamsQuery,
					variables: {
						publicId: this.publicId,
						limit: this.teamsLimit,
						offset: this.teamsOffset
					},
				});

				this.lenderTeams = data.community?.lender?.teams?.values ?? [];
				this.totalCount = data.community?.lender?.teams?.totalCount ?? 0;
			} catch (e) {
				logReadQueryError(e, 'LenderTeamsList lenderTeamsQuery');
			}
		},
		pageChange({ pageOffset }) {
			this.teamsOffset = pageOffset;
			this.pushChangesToUrl();
			this.fetchLenderTeams();
		},
		updateFromParams(query) {
			const pageNum = numeral(query.teams).value() - 1;

			this.teamsOffset = pageNum > 0 ? this.teamsLimit * pageNum : 0;
		},
		pushChangesToUrl() {
			if (!_isEqual(this.$route?.query, this.urlParams)) {
				this.$router.push({ query: this.urlParams });
			}
		},
		getImageUrl(team) {
			return team.image?.url ?? '';
		},
	},
	mounted() {
		this.fetchLenderTeams();
	},
	created() {
		this.pageQuery = _get(this.$route, 'query');
		this.updateFromParams(this.pageQuery);
	}
};
</script>
