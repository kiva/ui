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
						<div class="tw-flex tw-shrink-0">
							<kv-user-avatar
								v-for="(p, i) in participants"
								:key="p.id"
								:lender-name="p.name"
								:lender-image-url="p.image.url"
								is-small
								class="challenge-avatar md:tw-w-4 md:tw-h-4 tw-flex tw-items-center"
								:class="{ 'tw--ml-1': i > 0 }"
								:style="{ 'z-index': participants.length - i }"
							/>
						</div>
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
			<kv-page-container class="container">
				<kv-grid
					class="tw-grid-cols-12"
				>
					<div class="tw-col-span-12 tw-w-full">
						<div class="info tw-w-full tw-flex tw-items-center tw-justify-between">
							<img
								v-if="shareLenderImage && shareLenderName"
								:alt="`${shareLenderName} image`"
								:src="shareLenderImage"
								class="md:tw-w-4 md:tw-h-4 tw-w-6 tw-h-6 tw-rounded-full data-hj-suppress"
							>
							<p class="tw-text-lg data-hj-suppress">
								{{ headerCallout }} <a :href="teamLink">{{ teamName }}</a> hit their goal
							</p>
							<button
								class="tw-flex"
								@click="$emit('close')"
							>
								<kv-material-icon
									class="tw-h-3 tw-w-3"
									:icon="mdiClose"
								/>
							</button>
						</div>
					</div>
				</kv-grid>
			</kv-page-container>
		</div>
	</div>
</template>

<script>
import { mdiArrowTopRight, mdiClose } from '@mdi/js';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvUserAvatar from '~/@kiva/kv-components/vue/KvUserAvatar';
import KvToast from '~/@kiva/kv-components/vue/KvToast';

export default {
	name: 'ChallengeCallout',
	components: {
		KvGrid,
		KvPageContainer,
		KvMaterialIcon,
		KvUserAvatar,
		KvToast
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
			mdiClose,
		};
	},
	computed: {
		shareLenderName() {
			return this.shareLender?.name ?? '';
		},
		shareLenderImage() {
			return this.shareLender?.image?.url ?? '';
		},
		headerCallout() {
			return this.shareLenderName
				? `Support ${this.shareLenderName} and help `
				: 'Help ';
		},
		participants() {
			return (this.goalParticipationForLoan ?? [])
				.filter(l => l?.lender?.id !== this.currentLender?.lender?.id)
				.concat(this.currentLender)
				.map(p => ({ ...p?.lender, image: { url: p?.lender?.image?.url ?? '' } }))
				.slice(0, 3);
		},
		participantsMessage() {
			return this.participants.length > 1
				? `You & ${this.participants.length - 1} other members are supporting`
				: 'You are on your way to supporting the team challenge!';
		},
		teamLink() {
			return `/lend/filter?team=${this.teamId ?? ''}`;
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
.info {
	@apply tw-bg-white tw-flex tw-items-center tw-justify-center tw-gap-2 tw-shadow-lg tw-py-1
		md:tw-rounded-lg tw-rounded-b tw-px-2.5 md:tw-px-4;
}

.container {
	@apply md:tw-pt-3 tw-px-0 md:tw-px-4 lg:tw-px-8;
}

.challenge-avatar >>> img {
	@apply md:tw-w-4 md:tw-h-4;
}

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
