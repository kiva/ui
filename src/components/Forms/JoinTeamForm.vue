<template>
	<div>
		<h2 v-if="inviterDisplayName" slot="title">{{ inviterDisplayName }} invited you to the {{ teamName }} team!</h2>
		<h2 v-else slot="title">You're invited to the {{ teamName }} team!</h2>
		<p>
			<!-- eslint-disable-next-line max-len -->
			By joining the team, you can see your impact, interact with teammates, and get more out of Kiva.
		</p>
		<div class="join-team-button-container">
			<kv-button class="smaller secondary" @click.native.prevent="handleJoinTeamButton(false)">
				No Thanks
			</kv-button>
			<kv-button class="smaller" @click.native.prevent="handleJoinTeamButton(true)">
				Join Team
			</kv-button>
		</div>
	</div>
</template>

<script>

import KvButton from '@/components/Kv/KvButton';
import TeamInfoFromId from '@/graphql/query/teamInfoFromId.graphql';
import joinTeam from '@/graphql/mutation/joinTeam.graphql';
import createTeamRecruitment from '@/graphql/mutation/createTeamRecruitment.graphql';
import _get from 'lodash/get';

export default {
	components: {
		KvButton,
		TeamInfoFromId,
	},
	inject: ['apollo'],
	props: {
		teamId: {
			type: Number,
			required: true,
		},
	},
	apollo: {
		query: TeamInfoFromId,
		prefetch: true,
		variables() {
			return {
				id: this.teamId
			};
		},
		result({ data }) {
			this.teamName = _get(data, 'community.team.name');
		},
	},
	data() {
		return {
			teamName: ''
		};
	},
	methods: {
		handleJoinTeamButton(join) {
			if (join) {
				if (!this.teamRecruitmentId && this.recruiterId) {
					this.apollo.mutate({
						mutation: createTeamRecruitment,
						variables: {
							team_id: this.teamId,
							user_id: this.userId,
							recruiter_id: this.inviterId
						}
					}).then(result => {
						if (result.errors) {
							console.log(result.errors);
						}
					}).catch(error => {
						console.error(error);
					});
				}
				this.apollo.mutate({
					mutation: joinTeam,
					variables: {
						team_id: this.teamId,
						team_recruitment_id: this.teamRecruitmentId
					}
				}).then(result => {
					if (result.errors) {
						console.log(result.errors);
					} else {
						window.location.href = this.doneUrl;
					}
				}).catch(error => {
					console.error(error);
				});
			} else {
				window.location.href = this.doneUrl;
			}
		}
	},
	created() {
		this.doneUrl = this.$route.query.doneUrl;
		this.teamRecruitmentId = this.$route.query.id;
		this.inviterId = this.$route.query.inviter_id;
		this.inviterDisplayName = this.$route.query.inviter_display_name;
		this.teamId = this.$route.query.team_id;
		this.userId = this.$route.query.user_id;
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';


.join-team-button-container {
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	flex-direction: column;

	@include breakpoint(medium) {
		flex-direction: row;
	}
}
</style>
