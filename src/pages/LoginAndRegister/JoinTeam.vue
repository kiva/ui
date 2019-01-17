<template>
	<www-page>
		<div class="row page-content">
			<join-team-form :team-id="teamId"/>
		</div>
	</www-page>
</template>

<script>
import JoinTeamForm from '@/components/Forms/JoinTeamForm';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
		JoinTeamForm
	},
	data() {
		return {
		};
	},
	methods: {
	},
	created() {
		this.teamId = Number(this.$route.query.team_id);
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
.page-content {
	padding: 1.625rem rem-calc(10);
	max-width: 340px;

	@include breakpoint(medium) {
		padding: 1.625rem 0;
	}
}

// Control form layouts from parent to allow independence in other layouts
.join-team-form {
	max-width: rem-calc(280);
	margin: 0 auto;
}

// This spacer will be deleted
.spacer {
	margin: rem-calc(75) 0;
}
</style>
