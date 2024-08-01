<template>
	<kv-toast
		ref="toastRef"
		class="tw-fixed tw-top-9 md:tw-top-11 tw-left-0 tw-right-0 tw-z-banner toast-container
				tw-rounded-t-none md:tw-rounded-t"
		@close="closeCallback"
	>
		<template #toastContent>
			<div v-if="showAddedToCartMessage" class="tw-flex tw-gap-1 tw-items-center">
				<supported-by-lenders
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
</template>

<script>
import { mdiArrowTopRight } from '@mdi/js';
import SupportedByLenders from '#src/components/BorrowerProfile/SupportedByLenders';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';
import KvToast from '@kiva/kv-components/vue/KvToast';

export default {
	name: 'ChallengeCallout',
	components: {
		KvMaterialIcon,
		KvToast,
		SupportedByLenders,
	},
	props: {
		currentLender: {
			type: Object,
			default: () => ({}),
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
				this.$refs.toastRef.show('', '', true);
			}
		}
	},
	methods: {
		closeCallback() {
			this.$kvTrackEvent('Lending', 'click', 'close-challenge-callout');
			this.$emit('close');
		}
	},
	mounted() {
		if (this.showAddedToCartMessage) {
			this.$refs.toastRef.show('', '', true);
		}
	}
};

</script>

<style scoped lang="postcss">

.toast-container :deep(.tw-bg-secondary) {
	background-color: white !important;
}

.toast-container :deep(div[data-test=tip-message]) {
	@apply tw-mx-0;
}

.toast-container :deep(div.tw-shadow) > :first-child {
	@apply tw-hidden;
}
</style>
