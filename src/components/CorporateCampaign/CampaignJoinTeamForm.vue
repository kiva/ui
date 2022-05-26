<template>
	<section class="campaign-join-tem section row align-center">
		<div class="small-12 large-8 align-self-middle columns">
			<kv-lightbox
				class="join-team-lightbox"
				id="joinTeamLightbox"
				:prevent-close="true"
				:visible="showTeamLightbox"
				@lightbox-closed="handleLightboxClosed"
			>
				<div class="join-team-lightbox__content">
					<div v-if="showForm" class="tw-text-center">
						<h2>{{ campaignTitleText }}</h2>
						<p>
							Lending Teams are self-organized groups on Kiva.org where you can
							connect and rally around shared lending goals. By joining the
							{{ teamName }} Lending Team, you can easily see our collective impact
							across countries and sectors.
						</p>
						<p v-if="showError" class="error">
							Oh no! Something went wrong! Please try to join this team later.
						</p>
						<kv-loading-overlay id="loading-overlay-teams" v-if="loading" />
					</div>
					<div v-if="showSuccess" class="tw-text-center">
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
					</div>
				</div>

				<template #controls>
					<div class="tw-text-center">
						<div v-if="showForm">
							<kv-button class="smaller" @click.native.prevent="handleJoinTeam">
								Join Now
							</kv-button>
							<br><br>
							<kv-button class="text-link" @click.native.prevent="handleRejectTeam">
								Opt-out
							</kv-button>
						</div>
						<div v-if="showSuccess || showError">
							<kv-button class="smaller" @click.native.prevent="handleContinue">
								Continue
							</kv-button>
						</div>
					</div>
				</template>
			</kv-lightbox>
		</div>
	</section>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import TeamInfoFromId from '@/graphql/query/teamInfoFromId.graphql';
import joinTeam from '@/graphql/mutation/joinTeam.graphql';
import myTeamsQuery from '@/graphql/query/myTeams.graphql';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	name: 'CampaignJoinTeamForm',
	inject: ['apollo'],
	components: {
		KvButton,
		KvLightbox,
		KvLoadingOverlay,
	},
	props: {
		promoId: {
			type: Number,
			default: null
		},
		teamId: {
			type: Number,
			default: null
		},
		campaignName: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			isMember: false,
			loading: false,
			joinStatus: null,
			showError: false,
			showForm: true,
			showSuccess: false,
			showTeamLightbox: false,
			teamName: '',
			myTeams: () => [],
		};
	},
	computed: {
		campaignTitleText() {
			return `Join the ${this.teamName} Lending Team to do more good together`;
		},
		campaignNameText() {
			return this.campaignName ? `the ${this.campaignName}` : 'this';
		}
	},
	mounted() {
		this.loading = true;
		if (this.teamId) {
			this.fetchTeamData();
		}
	},
	methods: {
		fetchTeamData() {
			this.apollo.query({
				query: TeamInfoFromId,
				variables: {
					team_id: this.teamId,
					team_ids: [this.teamId],
				}
			}).then(({ data }) => {
				this.teamName = data.community?.team?.name ?? '';
				this.isMember = data.my?.teams?.values?.length ?? false;
				// if lender is a member emit event and skip form
				if (this.isMember) {
					this.myTeams = data.my?.teams?.values ?? [];
					this.joinStatus = 'existing-member';
					this.$emit('team-process-complete', { join: this.joinStatus });
				} else {
					this.showTeamLightbox = true;
					this.loading = false;
				}
			});
		},
		joinTeamMutation() {
			this.apollo.mutate({
				mutation: joinTeam,
				variables: {
					team_id: this.teamId,
					promo_id: this.promoId
				}
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
					this.isMember = result.data?.my?.teams?.values?.length ?? false;
					if (this.isMember) {
						this.myTeams = result.data?.my?.teams?.values ?? [];
					}
					this.showForm = false;
					this.showSuccess = true;
					this.joinStatus = 'joined';
				}
			})
				.catch(error => {
					this.loading = false;
					this.showError = true;
					this.joinStatus = 'error';
					console.log(error);
				});
		},
		handleJoinTeam() {
			this.loading = true;
			this.showError = false;
			this.joinTeamMutation();
		},
		handleContinue() {
			this.loading = true;
			this.showError = false;
			this.showTeamLightbox = false;
			this.$emit('team-process-complete', { join: this.joinStatus });
		},
		handleRejectTeam() {
			this.showError = false;
			// TODO: Close lightbox
			this.showTeamLightbox = false;
			this.$emit('team-process-complete', { join: 'declined', myTeams: this.myTeams });
			// TODO: Determine if /declineInvitationToJoinTeam?team_id=${this.teamId} is necessary
			// - It may be that we can use this to prevent spamming the person with repeated ligthboxes
		},
		handleLightboxClosed() {

		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.join-team-lightbox {
	&__content {
		max-width: 27rem;
	}
}

#loading-overlay-teams {
	background-color: rgba($white, 0.7);
}
</style>
