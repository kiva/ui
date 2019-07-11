<template>
	<div class="join-team-form">
		<div v-if="showForm">
			<h2 v-if="inviterDisplayName">
				{{ inviterDisplayName }} invited you to the {{ teamName }} team!
			</h2>
			<h2 v-else>
				You're invited to the {{ teamName }} team!
			</h2>
			<p>
				By joining the team, you can see your impact, interact with teammates, and get more out of Kiva.
			</p>
			<div class="join-team-button-container">
				<kv-button class="smaller secondary" @click.native.prevent="handleRejectTeam">
					No Thanks
				</kv-button>
				<kv-button class="smaller" @click.native.prevent="handleJoinTeam">
					Join Team
				</kv-button>
			</div>
			<p v-if="showError" class="error">
				Oh no! Something went wrong! Please try again or <a :href="doneUrl">leave and come back later</a>
			</p>
			<loading-overlay id="loading-overlay-teams" v-if="loading" />
		</div>
		<div v-if="showSuccess">
			<div v-if="isMember">
				<h2>Congratulations! You've joined the {{ teamName }} Lending Team.</h2>
				<p>
					When you make loans, you'll now have the option to count those loans towards this team.
				</p>
			</div>
			<div v-else>
				<h2>You've requested to join the {{ teamName }} Lending Team.</h2>
				<p>
					Once your request is approved, you'll have the option to count loans towards this team.
				</p>
			</div>
			<p><a :href="doneUrl">Continue</a></p>
		</div>
	</div>
</template>

<script>

import _get from 'lodash/get';
import KvButton from '@/components/Kv/KvButton';
import TeamInfoFromId from '@/graphql/query/teamInfoFromId.graphql';
import joinTeam from '@/graphql/mutation/joinTeam.graphql';
import createTeamRecruitment from '@/graphql/mutation/createTeamRecruitment.graphql';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';

export default {
	components: {
		KvButton,
		LoadingOverlay,
	},
	inject: ['apollo'],
	apollo: {
		query: TeamInfoFromId,
		preFetch: true,
		variables() {
			return {
				team_id: this.teamId,
				team_recruitment_id: this.teamRecruitmentId
			};
		},
		preFetchVariables({ route }) {
			return {
				team_id: route.query.team_id,
				team_recruitment_id: route.query.id,
				promo_id: route.query.promo_id,
			};
		},
		result({ data }) {
			this.teamName = _get(data, 'community.team.name');
			if (!this.inviterDisplayName) {
				this.inviterDisplayName = _get(data, 'my.teamRecruitment.recruiterDisplayName');
			}
			if (this.inviterDisplayName === 'Anonymous') {
				this.inviterDisplayName = null;
			}
		},
	},
	data() {
		return {
			teamName: '',
			isMember: false,
			doneUrl: this.$route.query.doneUrl,
			teamRecruitmentId: this.$route.query.id,
			inviterId: this.$route.query.inviter_id,
			inviterDisplayName: this.$route.query.inviter_display_name,
			teamId: this.$route.query.team_id,
			promoId: this.$route.query.promo_id,
			showError: false,
			showForm: true,
			showSuccess: false,
			loading: false,
			message: '',
			joined: false
		};
	},
	methods: {
		handleJoinTeam() {
			this.loading = true;
			this.showError = false;
			new Promise(resolve => {
				if (!this.teamRecruitmentId && this.recruiterId) {
					this.apollo.mutate({
						mutation: createTeamRecruitment,
						variables: {
							team_id: this.teamId,
							recruiter_id: this.inviterId
						}
					}).then(result => {
						if (result.errors) {
							console.log(result.errors);
						}
						resolve();
					}).catch(error => {
						console.error(error);
						resolve();
					});
				} else {
					resolve();
				}
			}).then(() => {
				this.apollo.mutate({
					mutation: joinTeam,
					variables: {
						team_id: this.teamId,
						team_recruitment_id: this.teamRecruitmentId,
						promo_id: this.promoId
					}
				}).then(result => {
					this.loading = false;
					if (result.errors) {
						this.showError = true;
						console.log(result.errors);
					} else {
						this.isMember = true; // todo: check if they joined or requested
						this.showForm = false;
						this.showSuccess = true;
					}
				}).catch(error => {
					this.loading = false;
					this.showError = true;
					console.log(error);
				});
			});
		},
		handleRejectTeam() {
			this.showError = false;
			window.location.href = this.doneUrl;
		}
	},
	created() {
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

.error {
	color: $kiva-accent-red;
	font-weight: bold;
}

.join-team-form {
	position: relative;
}

#loading-overlay-teams {
	background-color: rgba($white, 0.7);
}
</style>

<style lang="scss">
/* Hide Basket Bar (this won't work with scoped) */
.basket-bar {
	display: none;
}
</style>
