<template>
	<div v-if="showAddedToCartMessage">
		<kv-page-container class="container">
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12 tw-w-full">
					<div class="info tw-w-full">
						<div class="tw-flex tw-gap-1 tw-items-center">
							<div class="tw-flex tw-shrink-0">
								<kv-user-avatar
									v-for="(p, i) in participants"
									:key="p.id"
									:lender-name="p.name"
									:lender-image-url="p.image.url"
									is-small
									class="challenge-avatar md:tw-w-4 md:tw-h-4"
									:class="{ 'tw--ml-1': i > 0 }"
									:style="{ 'z-index': participants.length - i }"
								/>
							</div>
							<div class="tw-flex tw-gap-0.5 tw-flex-wrap">
								<span class="tw-whitespace-nowrap">Added to cart!</span>
								<span
									:class="{'tw-whitespace-nowrap': participants.length > 1 && borrowerName}"
								>{{ participantsMessage }}</span>
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
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
	<div v-else>
		<kv-page-container class="container">
			<kv-grid
				class="tw-grid-cols-12"
			>
				<div class="tw-col-span-12 tw-w-full">
					<div class="info tw-w-full">
						<img
							v-if="shareLenderImage"
							:alt="`${shareLenderName} image`"
							:src="shareLenderImage"
							class="md:tw-w-4 md:tw-h-4 tw-w-6 tw-h-6 tw-rounded-full data-hj-suppress"
						>
						<p class="tw-text-lg data-hj-suppress">
							{{ headerCallout }} <a :href="teamLink">{{ teamName }}</a> hit their goal
						</p>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
</template>

<script>
import { mdiArrowTopRight } from '@mdi/js';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvUserAvatar from '~/@kiva/kv-components/vue/KvUserAvatar';

export default {
	name: 'ChallengeCallout',
	components: {
		KvGrid,
		KvPageContainer,
		KvMaterialIcon,
		KvUserAvatar,
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
		}
	},
	data() {
		return {
			mdiArrowTopRight,
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
		}
	},
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
</style>
