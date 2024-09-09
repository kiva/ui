<template>
	<div>
		<lender-summary
			:public-id="publicId"
			:lender-info="lenderInfo"
		/>

		<lender-loans-list
			:public-id="publicId"
			:lender-info="lenderInfo"
		/>

		<lender-badges
			:total-possible-badges="allAchievements.length"
			:completed-achievements="completedAchievements"
			:lender-info="lenderInfo"
		/>

		<lender-dedications-list
			:public-id="publicId"
			:lender-info="lenderInfo"
		/>

		<lender-teams-list
			:public-id="publicId"
			:lender-info="lenderInfo"
		/>

		<lender-invitees-list
			:public-id="publicId"
			:lender-info="lenderInfo"
		/>

		<lender-stats
			:public-id="publicId"
			:lender-stats="lenderStats"
			@get-lender-stats="fetchLenderStats"
		/>

		<!-- TODO: try disabling map to identify memory leak -->
		<!-- <lender-map
			:lender-info="lenderInfo"
			:lender-stats="lenderStats"
		/> -->
	</div>
</template>

<script>
import lenderStatsQuery from '@/graphql/query/lenderStats.graphql';
import logReadQueryError from '@/util/logReadQueryError';
import LenderSummary from '@/components/LenderProfile/LenderSummary';
import LenderLoansList from '@/components/LenderProfile/LenderLoansList';
import LenderStats from '@/components/LenderProfile/LenderStats';
import LenderTeamsList from '@/components/LenderProfile/LenderTeamsList';
import LenderBadges from '@/components/LenderProfile/LenderBadges';
import LenderInviteesList from '@/components/LenderProfile/LenderInviteesList';
import LenderDedicationsList from '@/components/LenderProfile/LenderDedicationsList';
// TODO: try disabling map to identify memory leak
// import LenderMap from '@/components/LenderProfile/LenderMap';

export default {
	name: 'LenderProfileWrapper',
	inject: ['apollo', 'cookieStore'],
	props: {
		publicId: {
			type: String,
			required: true,
		},
		lenderInfo: {
			type: Object,
			default: () => ({}),
			required: true,
		},
		allAchievements: {
			type: Array,
			default: () => ([]),
		},
		completedAchievements: {
			type: Array,
			default: () => ([]),
		},
	},
	data() {
		return {
			lenderStats: {},
		};
	},
	components: {
		LenderSummary,
		LenderLoansList,
		LenderStats,
		LenderTeamsList,
		LenderBadges,
		LenderInviteesList,
		LenderDedicationsList,
		// TODO: try disabling map to identify memory leak
		// LenderMap,
	},
	methods: {
		async fetchLenderStats() {
			try {
				const { data } = await this.apollo.query({
					query: lenderStatsQuery,
					variables: {
						publicId: this.publicId,
					},
				});

				this.lenderStats = data.community?.lender ?? {};
			} catch (e) {
				logReadQueryError(e, 'LenderStats lenderStatsQuery');
			}
		},
	},
};
</script>
