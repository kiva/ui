<template>
	<kv-page-container
		class="tw-pt-4"
	>
		<lender-summary
			:public-id="publicId"
			:lender-info="lenderInfo"
		/>

		<lender-loans-list
			:public-id="publicId"
			:lender-info="lenderInfo"
		/>
	</kv-page-container>
	<lender-badges
		:lender-info="lenderInfo"
		:public-id="publicId"
	/>
	<kv-page-container
		class="tw-pb-8"
	>
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

		<lender-map
			:lender-info="lenderInfo"
			:lender-stats="lenderStats"
		/>
	</kv-page-container>
</template>

<script>
import lenderStatsQuery from '#src/graphql/query/lenderStats.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import LenderSummary from '#src/components/LenderProfile/LenderSummary';
import LenderLoansList from '#src/components/LenderProfile/LenderLoansList';
import LenderStats from '#src/components/LenderProfile/LenderStats';
import LenderTeamsList from '#src/components/LenderProfile/LenderTeamsList';
import LenderBadges from '#src/components/LenderProfile/LenderBadges';
import LenderInviteesList from '#src/components/LenderProfile/LenderInviteesList';
import LenderDedicationsList from '#src/components/LenderProfile/LenderDedicationsList';
import LenderMap from '#src/components/LenderProfile/LenderMap';
import { KvPageContainer } from '@kiva/kv-components';

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
		LenderMap,
		KvPageContainer,
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
