<template>
	<www-page>
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12 tw-pt-5 md:tw-pt-7 lg:tw-pt-9 tw-mb-4 md:tw-mb-6">
				<div
					class="tw-col-span-12 md:tw-col-start-3 md:tw-col-span-8"
				>
					<div v-if="isLoading" class="tw-flex tw-items-center tw-flex-col">
						<h2>Joining team {{ teamName }}</h2>
						<div>
							<kv-loading-spinner class="tw-mt-2" />
						</div>
					</div>
					<div v-else class="tw-text-center">
						<h2 v-if="isPending">
							Your request to join the {{ teamName }} team is pending. Please check back later.
						</h2>
						<h2 v-if="isMember">
							You are a member of the {{ teamName }} team.
						</h2>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
/**
 * This component is used for processing a join team request after authentication
 * The flow would look like this: click button > auth0 > this component
 * The user should always be authenticated when they reach this component
 * If team join is successful, the user will be redirected to the doneUrl
 * If team join is unsuccessful, display error message
 * If join team is pending, display pending message
 */
import { gql } from '@apollo/client';

import WwwPage from '@/components/WwwFrame/WwwPage';
import joinTeam from '@/graphql/mutation/joinTeam.graphql';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvLoadingSpinner from '~/@kiva/kv-components/vue/KvLoadingSpinner';

const userTeamMembership = gql`query userTeamMembership( $teamPublicId: String!, $publicId: String!) {
	my {
		id
		userAccount {
			id
		}
	}
	community {
		team(teamPublicId: $teamPublicId) {
			id
			userProperties {
				membershipStatus
			}
			name
		}
		lender(publicId: $publicId) {
			id
			name
			publicId
		}
	}
}`;

export default {
	name: 'ProcessJoinTeam',
	props: {
		doneUrl: {
			type: String,
			default: null
		},
		teamRecruitmentId: {
			type: Number,
			default: null,
		},
		teamPublicId: {
			type: String,
			required: true
		},
		promoId: {
			type: Number,
			default: null
		},
		// the public name of the inviter user in the route query
		inviter: {
			type: String,
			default: ''
		},
	},
	components: {
		KvLoadingSpinner,
		KvGrid,
		KvPageContainer,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch: true,
		query: userTeamMembership,
		preFetchVariables({ route }) {
			return {
				teamPublicId: route.query.teamPublicId,
				publicId: route.query.inviter ?? '',
			};
		},
		variables() {
			return {
				teamPublicId: this.teamPublicId,
				publicId: this.inviter ?? '',
			};
		},
		result({ data }) {
			this.userMembershipStatus = data?.community?.team?.userProperties?.membershipStatus ?? 'none';
			this.teamName = data?.community?.team?.name ?? '';
			this.teamId = data?.community?.team?.id ?? 0;
			this.inviterRecruitmentId = data?.community?.lender?.id ?? null;
		}
	},
	data() {
		return {
			userMembershipStatus: 'none',
			isLoading: true,
			teamName: '',
			inviterRecruitmentId: null
		};
	},
	computed: {
		isPending() {
			return this.userMembershipStatus === 'requestPending';
		},
		isMember() {
			return this.userMembershipStatus === 'member' || this.userMembershipStatus === 'captain';
		},
		isNotMember() {
			return this.userMembershipStatus === 'none'
			|| this.userMembershipStatus === 'recruited'
			|| this.userMembershipStatus === 'recruitedByPromo';
		},
		recruitmentIdMutationVariable() {
			// if teamRecruitmentId in the route query, use that value,
			// otherwise, use the value we got from the apollo query
			if (this.teamRecruitmentId) {
				return this.teamRecruitmentId;
			} if (this.inviter) {
				return this.inviterRecruitmentId;
			}
			return null;
		}
	},
	methods: {
		memberRedirect() {
			if (!this.$isServer) {
				window.location = this.doneUrl ? this.doneUrl : `/team/${this.teamPublicId}`;
			}
		},
		async handleJoinTeam() {
			try {
				await this.apollo.mutate({
					mutation: joinTeam,
					variables: {
						team_id: this.teamId,
						team_recruitment_id: this.recruitmentIdMutationVariable,
						promo_id: this.promoId
					}
				});
				// get updated team membership status to determine if joined or pending
				const { data: userMembershipData } = await this.apollo.query({
					query: userTeamMembership,
					variables: {
						teamPublicId: this.teamPublicId,
						publicId: this.inviter ?? '',
					},
					fetchPolicy: 'network-only'
				});
				// update the users membership status
				this.userMembershipStatus = userMembershipData?.community?.team?.userProperties?.membershipStatus;
				if (this.isMember) {
					this.$showTipMsg('You have joined the team!');
					this.memberRedirect();
				}
				if (this.isPending) {
					this.isLoading = false;
					this.$showTipMsg('Your request to join the team was successful');
				}
			} catch (err) {
				console.error(err);
				this.isLoading = false;
				this.$showTipMsg('There was a problem joining the team', 'error');
			}
		}
	},
	created() {
		if (this.isPending) {
			// is pending, do nothing
			this.isLoading = false;
		} else if (this.isNotMember) {
			// handle joining team here
			this.handleJoinTeam();
		} else {
			// is member, redirect to doneUrl or team page
			this.$showTipMsg('You are already a member of this team');
			this.memberRedirect();
		}
	}
};
</script>
