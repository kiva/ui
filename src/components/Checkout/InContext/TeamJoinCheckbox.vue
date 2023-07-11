<template>
	<div v-if="!isMember">
		<kv-loading-placeholder
			v-if="loading" class="tw-rounded tw-w-full" :style="{ height: '80px' }"
		/>
		<kv-checkbox
			v-else
			v-model="teamJoinIntent"
		>
			{{ campaignTitleText }}
		</kv-checkbox>
	</div>
</template>

<script>
import { fetchTeamInfoById } from '@/util/teamUtils';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'TeamJoinCheckbox',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvCheckbox,
		KvLoadingPlaceholder,
	},
	props: {
		isActivelyLoggedIn: {
			type: Boolean,
			default: false
		},
		promoName: {
			type: String,
			default: () => {},
		},
		teamId: {
			type: Number,
			default: null
		},
	},
	data() {
		return {
			isMember: false,
			loading: true,
			teamJoinIntent: true,
			teamName: null
		};
	},
	computed: {
		campaignTitleText() {
			return `Join the ${this.teamName} Lending Team to do more good together`;
		},
	},
	mounted() {
		this.fetchTeamData();
	},
	watch: {
		teamJoinIntent(newVal, prevVal) {
			if (newVal !== prevVal) {
				this.$emit('update-team-join-intent', this.teamJoinIntent);
				this.$kvTrackEvent(
					'ManagedLendingCampaign',
					'team-join-intent-change',
					'join team checkbox',
					newVal,
					newVal
				);
			}
		},
	},
	methods: {
		fetchTeamData() {
			fetchTeamInfoById(this.apollo, this.teamId).then(({ data }) => {
				this.teamName = data.community?.team?.name ?? '';
				this.isMember = data.my?.teams?.values?.length ?? false;
				this.loading = false;
			});
		},

		// handleTeamJoinProcess(payload) {
		// 	this.teamJoinStatus = payload.join;
		// 	this.$kvTrackEvent(
		// 		'ManagedLendingCampaign',
		// 		'modal-join-team-process',
		// 		`${this.teamJoinStatus} team`
		// 	);
		// 	this.fetchMyTeams();
		// },

		// fetchMyTeams() {
		// 	this.apollo.query({
		// 		fetchPolicy: 'network-only',
		// 		query: myTeamsQuery
		// 	}).then(({ data }) => {
		// 		this.myTeams = data.my?.lender?.teams?.values ?? [];
		// 		if (this.teamJoinStatus !== 'declined') {
		// 			this.addTeamToLoans();
		// 		}
		// 	});
		// 	this.showBasket();
		// },

		// addTeamToLoans() {
		// 	if (this.basketLoans.length && this.teamId) {
		// 		const loans = [];
		// 		// TODO Collect these promises and refresh basket once complete
		// 		this.basketLoans.forEach((loan, index) => {
		// 			loans[index] = this.apollo.mutate({
		// 				mutation: updateLoanReservationTeam,
		// 				variables: {
		// 					teamId: this.teamId,
		// 					loanid: loan.id
		// 				}
		// 			});
		// 		});
		// 		Promise.all(loans).then(() => {
		// 			this.updateBasketState();
		// 		});
		// 	}
		// },

		// joinTeamMutation() {
		// 	this.apollo.mutate({
		// 		mutation: joinTeam,
		// 		variables: {
		// 			team_id: this.teamId,
		// 			promo_id: this.promoId
		// 		}
		// 	}).then(result => {
		// 		if (result.errors) {
		// 			throw result.errors;
		// 		} else {
		// 			return this.apollo.query({
		// 				query: myTeamsQuery,
		// 				variables: {
		// 					teamIds: [this.teamId]
		// 				},
		// 				fetchPolicy: 'network-only',
		// 			});
		// 		}
		// 	}).then(result => {
		// 		this.loading = false;
		// 		if (result.errors) {
		// 			throw result.errors;
		// 		} else {
		// 			this.isMember = result.data?.my?.teams?.values?.length ?? false;
		// 			if (this.isMember) {
		// 				this.myTeams = result.data?.my?.teams?.values ?? [];
		// 			}
		// 			this.showForm = false;
		// 			this.showSuccess = true;
		// 			this.joinStatus = 'joined';
		// 		}
		// 	})
		// 		.catch(error => {
		// 			this.loading = false;
		// 			this.showError = true;
		// 			this.joinStatus = 'error';
		// 			console.log(error);
		// 		});
		// },
		// handleJoinTeam() {
		// 	if (this.isChecked) {
		// 		this.joinTeamMutation();
		// 	}
		// },
		// handleContinue() {
		// 	// this.loading = true;
		// 	// this.showError = false;
		// 	this.$emit('team-process-complete', { join: this.joinStatus });
		// },
		// handleRejectTeam() {
		// 	// this.showError = false;
		// 	// TODO: Close lightbox
		// 	this.$emit('team-process-complete', { join: 'declined', myTeams: this.myTeams });
		// 	// TODO: Determine if /declineInvitationToJoinTeam?team_id=${this.teamId} is necessary
		// 	// - It may be that we can use this to prevent spamming the person with repeated ligthboxes
		// },
	}
};
</script>

<style scoped>

</style>
