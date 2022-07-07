<template>
	<div class="tw-prose tw-text-center tw-relative">
		<div v-if="showForm">
			<h1 v-if="inviterDisplayName">
				{{ inviterDisplayName }} invited you to the {{ teamName }} team!
			</h1>
			<h1 v-else>
				You're invited to the {{ teamName }} team!
			</h1>
			<p>
				By joining the team, you can see your impact, interact with teammates, and get more out of Kiva.
			</p>
			<div class="tw-inline-flex tw-gap-2">
				<kv-button data-testid="no-thanks-button" variant="secondary" @click="handleRejectTeam">
					No Thanks
				</kv-button>
				<kv-button data-testid="join-team-button" @click="handleJoinTeam">
					Join Team
				</kv-button>
			</div>
			<p v-if="showError" class="tw-text-danger tw-font-medium">
				Oh no! Something went wrong! Please try again or <a :href="doneUrl">leave and come back later</a>
			</p>
			<kv-loading-overlay
				style="background-color: rgba(var(--bg-primary), 0.7);"
				v-if="loading"
			/>
		</div>
		<div v-if="showSuccess">
			<div v-if="isMember">
				<h1>Congratulations! You've joined the {{ teamName }} Lending Team.</h1>
				<p>
					When you make loans, you'll now have the option to count those loans towards this team.
				</p>
			</div>
			<div v-else>
				<h1>You've requested to join the {{ teamName }} Lending Team.</h1>
				<p>
					Once your request is approved, you'll have the option to count loans towards this team.
				</p>
			</div>
			<p><a data-testid="join-team-continue-lnk" :href="doneUrl">Continue</a></p>
		</div>
	</div>
</template>

<script>

import _get from 'lodash/get';
import numeral from 'numeral';
import TeamInfoFromId from '@/graphql/query/teamInfoFromId.graphql';
import joinTeam from '@/graphql/mutation/joinTeam.graphql';
import myTeamsQuery from '@/graphql/query/myTeams.graphql';
import createTeamRecruitment from '@/graphql/mutation/createTeamRecruitment.graphql';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'JoinTeamForm',
	components: {
		KvButton,
		KvLoadingOverlay,
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client, { route }) {
			return client.query({
				query: TeamInfoFromId,
				variables: {
					team_id: numeral(route.query.team_id).value(),
					team_recruitment_id: numeral(route.query.id).value(),
					team_ids: [numeral(route.query.team_id).value()],
				}
			}).then(({ data }) => {
				const isMember = _get(data, 'my.teams.values', []).length;
				// if lender is a member proceed to authenticate/redirect
				// this route will handle the redirect to basket/payment or checkout
				if (isMember) {
					return Promise.reject({
						path: '/authenticate/redirect',
						query: {
							team_id: numeral(route.query.team_id).value(),
							promo_id: numeral(route.query.promo_id).value(),
						}
					});
				}
			});
		},
	},
	data() {
		return {
			teamName: '',
			isMember: false,
			doneUrl: this.$route.query.doneUrl,
			teamRecruitmentId: numeral(this.$route.query.id).value(),
			inviterId: numeral(this.$route.query.inviter_id).value(),
			inviterDisplayName: this.$route.query.inviter_display_name,
			teamId: numeral(this.$route.query.team_id).value(),
			promoId: numeral(this.$route.query.promo_id).value(),
			showError: false,
			showForm: true,
			showSuccess: false,
			loading: false,
			message: ''
		};
	},
	computed: {
		// when declining to Join the Team extract the final destination
		// this prevents us from a proxy error or landing back on join-team with no action to take
		extractedDoneUrl() {
			return this.doneUrl.replace('join-team?doneUrl=', '');
		},
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
				return this.apollo.mutate({
					mutation: joinTeam,
					variables: {
						team_id: this.teamId,
						team_recruitment_id: this.teamRecruitmentId,
						promo_id: this.promoId
					}
				});
			}).then(result => {
				if (result.errors) {
					throw result.errors;
				} else {
					return this.apollo.query({
						query: myTeamsQuery,
						variables: {
							teamIds: [this.teamId]
						},
						fetchPolicy: 'network-only',
					});
				}
			}).then(result => {
				this.loading = false;
				if (result.errors) {
					throw result.errors;
				} else {
					this.isMember = _get(result.data, 'my.teams.values', []).length;
					this.showForm = false;
					this.showSuccess = true;
					this.$kvTrackEvent(
						'JoinTeamModal',
						'modal-join-team-success'
					);
				}
			})
				.catch(error => {
					this.loading = false;
					this.showError = true;
					console.log(error);
				});
		},
		handleRejectTeam() {
			this.showError = false;
			this.$kvTrackEvent(
				'JoinTeamModal',
				'modal-join-team-skipped'
			);
			// eslint-disable-next-line max-len
			window.location.href = `/declineInvitationToJoinTeam?team_id=${this.teamId}&doneUrl=${this.extractedDoneUrl}`;
		},
	},
	created() {
		const teamInfo = this.apollo.readQuery({
			query: TeamInfoFromId,
			variables: {
				team_id: numeral(this.$route.query.team_id).value(),
				team_recruitment_id: numeral(this.$route.query.id).value(),
				team_ids: [numeral(this.$route.query.team_id).value()],
			},
		});
		// handle pending team and invite information
		this.teamName = _get(teamInfo, 'community.team.name');
		if (!this.inviterDisplayName) {
			this.inviterDisplayName = _get(teamInfo, 'my.teamRecruitment.recruiterDisplayName');
		}
		if (this.inviterDisplayName === 'Anonymous') {
			this.inviterDisplayName = null;
		}
	},
};
</script>
