<template>
	<async-lender-section @visible="fetchLenderTeams">
		<section v-if="lenderTeams.length > 0" class="tw-my-8" id="lender-teams">
			<div v-if="!isLoading">
				<h2 class="data-hj-suppress tw-mb-1">
					{{ lenderTeamsTitle }}
				</h2>
				<p class="tw-mb-2">
					{{ showedTeams }}
				</p>
			</div>
			<kv-loading-placeholder
				v-else
				class="tw-mb-2"
				style="height: 55px; width: 250px;"
			/>
			<div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
				<div
					v-for="(team, index) in lenderTeams"
					:key="`team-${team.id}-${index}`"
					class="tw-flex tw-flex-col tw-gap-0.5"
				>
					<div v-if="!team.id">
						<kv-loading-placeholder class="tw-w-full tw-aspect-square" />
					</div>
					<div v-else>
						<a
							:href="`/team/${team.teamPublicId}`"
							v-kv-track-event="['lender-profile', 'click', 'lender-team', team.name, team.id]"
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
							v-kv-track-event="['lender-profile', 'click', 'lender-team', team.name, team.id]"
						>
							{{ team.name }}
						</a>
						<p>{{ team.category }}</p>
					</div>
				</div>
			</div>
			<kv-pagination
				class="tw-mt-4"
				v-if="totalCount > teamsLimit"
				:limit="teamsLimit"
				:total="totalCount"
				:offset="teamsOffset"
				:scroll-to-top="false"
				track-event-category="lender-profile-teams"
				@page-changed="pageChange"
			/>
		</section>
	</async-lender-section>
</template>

<script>
import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import numeral from 'numeral';
import { mdiAccountCircle } from '@mdi/js';
import logReadQueryError from '#src/util/logReadQueryError';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import smoothScrollMixin from '#src/plugins/smooth-scroll-mixin';
import lenderTeamsQuery from '#src/graphql/query/lenderTeams.graphql';
import { KvPagination, KvMaterialIcon, KvLoadingPlaceholder } from '@kiva/kv-components';
import AsyncLenderSection from './AsyncLenderSection';

export default {
	name: 'LenderTeamsList',
	mixins: [smoothScrollMixin],
	inject: ['apollo', 'cookieStore'],
	components: {
		KvPagination,
		KvMaterialIcon,
		KvLoadingPlaceholder,
		AsyncLenderSection,
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
			lenderTeams: new Array(6).fill({ id: 0 }),
			teamsLimit: 12,
			teamsOffset: 0,
			totalCount: 0,
			pageQuery: { teams: '1' },
			mdiAccountCircle,
			isLoading: true,
		};
	},
	computed: {
		lenderTeamsTitle() {
			return this.lenderInfo?.name
				? `${formatPossessiveName(this.lenderInfo.name)} teams`
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
				this.isLoading = false;
			} catch (e) {
				logReadQueryError(e, 'LenderTeamsList lenderTeamsQuery');
			}
		},
		pageChange({ pageOffset }) {
			this.teamsOffset = pageOffset;
			this.pushChangesToUrl();
			this.fetchLenderTeams();
			this.scrollToSection('#lender-teams');
		},
		updateFromParams(query) {
			const pageNum = numeral(query.teams).value() - 1;

			this.teamsOffset = pageNum > 0 ? this.teamsLimit * pageNum : 0;
		},
		pushChangesToUrl() {
			const currentQuery = this.$route?.query;
			if (!_isEqual(currentQuery, this.urlParams)) {
				this.$router.push({ query: { ...currentQuery, ...this.urlParams } });
			}
		},
		getImageUrl(team) {
			return team.image?.url ?? '';
		},
		scrollToSection(sectionId) {
			const elementToScrollTo = document.querySelector(sectionId);
			const topOfSectionToScrollTo = (elementToScrollTo?.offsetTop ?? 0) - 50 ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		}
	},
	created() {
		this.pageQuery = _get(this.$route, 'query');
		this.updateFromParams(this.pageQuery);
	},
};
</script>
