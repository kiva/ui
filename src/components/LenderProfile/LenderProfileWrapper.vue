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
			:lender-info="lenderInfo"
		/>

		<lender-map
			:lender-info="lenderInfo"
		/>
	</div>
</template>

<script>
import LenderSummary from '#src/components/LenderProfile/LenderSummary';
import LenderLoansList from '#src/components/LenderProfile/LenderLoansList';
import LenderStats from '#src/components/LenderProfile/LenderStats';
import LenderTeamsList from '#src/components/LenderProfile/LenderTeamsList';
import LenderBadges from '#src/components/LenderProfile/LenderBadges';
import LenderInviteesList from '#src/components/LenderProfile/LenderInviteesList';
import LenderDedicationsList from '#src/components/LenderProfile/LenderDedicationsList';
import LenderMap from '#src/components/LenderProfile/LenderMap';

export default {
	name: 'LenderProfileWrapper',
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
	components: {
		LenderSummary,
		LenderLoansList,
		LenderStats,
		LenderTeamsList,
		LenderBadges,
		LenderInviteesList,
		LenderDedicationsList,
		LenderMap,
	},
};
</script>
