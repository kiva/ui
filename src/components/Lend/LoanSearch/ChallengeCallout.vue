<template>
	<div>
		<div>
			<kv-toast
				ref="toastRef"
				class="tw-fixed tw-top-9 md:tw-top-11 tw-left-0 tw-right-0 tw-z-banner toast-container
				tw-rounded-t-none md:tw-rounded-t"
				@close="closeCallback"
			>
				<template #toastContent>
					<div v-if="showAddedToCartMessage" class="tw-flex tw-gap-1 tw-items-center">
						<supported-by-lenders
							v-if="showAddedToCartMessage"
							:participants="participants"
							is-challenge
							minimal
						/>
						<div class="tw-flex tw-gap-0.5 tw-flex-wrap">
							<span class="tw-whitespace-nowrap">Added to cart!</span>
							<span>{{ participantsMessage }}</span>
							<span
								v-if="participants.length > 1 && borrowerName"
								class="data-hj-suppress tw-whitespace-nowrap"
							>{{ borrowerName }}.</span>
							<a
								href="/basket"
								class="tw-flex"
								v-kv-track-event="[
									'basket',
									'click',
									'challenge-callout'
								]"
							>
								<span class="tw-whitespace-nowrap">Head to checkout</span>
								<kv-material-icon class="tw-w-3" :icon="mdiArrowTopRight" />
							</a>
						</div>
					</div>
				</template>
			</kv-toast>
		</div>
		<div v-if="!hideMsg">
			<challenge-team-invite
				:share-lender="shareLender"
				:team-name="teamName"
				:team-id="teamId"
			/>
		</div>
	</div>
</template>

<script>
import { mdiArrowTopRight } from '@mdi/js';
import SupportedByLenders from '@/components/BorrowerProfile/SupportedByLenders';
import ChallengeTeamInvite from '@/components/BorrowerProfile/ChallengeTeamInvite';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvToast from '~/@kiva/kv-components/vue/KvToast';

export default {
	name: 'ChallengeCallout',
	components: {
		KvMaterialIcon,
		KvToast,
		SupportedByLenders,
		ChallengeTeamInvite
	},
	props: {
		shareLender: {
			type: Object,
			default: () => ({}),
		},
		currentLender: {
			type: Object,
			default: () => ({}),
		},
		teamName: {
			type: String,
			required: true,
		},
		showAddedToCartMessage: {
			type: Boolean,
			default: false,
		},
		goalParticipationForLoan: {
			type: Array,
			default: null,
		},
		borrowerName: {
			type: String,
			default: undefined,
		},
		teamId: {
			type: String,
			default: ''
		},
		hideMsg: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			mdiArrowTopRight,
		};
	},
	computed: {
		participants() {
			const rawParticipants = (this.goalParticipationForLoan ?? [])
				.filter(l => l?.lender?.id !== this.currentLender?.lender?.id)
				.concat(this.currentLender)
				.map(p => ({ ...p?.lender, image: { url: p?.lender?.image?.url ?? '' } }))
				.slice(0, 3);

			return {
				totalCount: rawParticipants.length,
				values: rawParticipants,
			};
		},
		participantsMessage() {
			return this.participants.length > 1
				? `You & ${this.participants.length - 1} other members are supporting`
				: 'You are on your way to supporting the team challenge!';
		},
	},
	watch: {
		showAddedToCartMessage(val) {
			if (val) {
				this.$refs.toastRef.show();
			}
		}
	},
	methods: {
		closeCallback() {
			this.$emit('close');
		}
	},
	mounted() {
		if (this.showAddedToCartMessage) {
			this.$refs.toastRef.show();
		}
	}
};

</script>

<style scoped lang="postcss">

.toast-container >>> .tw-bg-secondary {
	background-color: white !important;
}

.toast-container >>> div[data-test="tip-message"] {
	@apply tw-mx-0;
}

.toast-container >>> div.tw-shadow > :first-child {
	@apply tw-hidden;
}
</style>
