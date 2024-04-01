<template>
	<div v-if="showAddedToCartMessage">
		<kv-page-container class="container">
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12 tw-w-full">
					<div class="info tw-w-full">
						<div class="tw-flex tw-gap-1 tw-items-center">
							<div class="tw-shrink-0">
								<img
									v-for="(p, i) in participants"
									:key="p.id"
									:src="p.image.url"
									alt="Lender photo"
									class="
										data-hj-suppress
										tw-inline-block
										tw-w-4
										tw-h-4
										tw-rounded-full
										tw-overflow-hidden
										tw-border
										tw-border-white
										tw-object-fill
										tw-relative
									"
									:class="{ 'tw--ml-2': i > 0, 'tw-border-gray-200': p.isLegacyPlaceholder }"
									:style="{ 'z-index': participants.length - i }"
								>
							</div>
							<div class="tw-flex tw-gap-0.5 tw-flex-wrap">
								<span class="tw-whitespace-nowrap">Added to cart!</span>
								<template v-if="borrowerName">
									<span class="tw-whitespace-nowrap">{{ participantsMessage }}</span>
									<span class="data-hj-suppress tw-whitespace-nowrap">{{ borrowerName }}.</span>
								</template>
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
									<kv-material-icon :icon="mdiArrowTopRight" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
	<div v-else-if="shareLenderName">
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
						<p class="tw-text-lg tw-py-1 data-hj-suppress">
							{{ headerCallout }}
						</p>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
</template>

<script>
import { isLegacyPlaceholderAvatar } from '@/util/imageUtils';
import { mdiArrowTopRight } from '@mdi/js';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'ChallengeCallout',
	components: {
		KvGrid,
		KvPageContainer,
		KvMaterialIcon,
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
				? `Support ${this.shareLenderName} and help ${this.teamName} hit their goal`
				: `Help ${this.teamName} hit their goal`;
		},
		participants() {
			return (this.goalParticipationForLoan ?? [])
				.filter(l => l?.lender?.id !== this.currentLender?.lender?.id && l?.lender?.image)
				.concat(this.currentLender)
				.map(p => ({
					...p?.lender,
					isLegacyPlaceholder: isLegacyPlaceholderAvatar(p?.lender?.image?.url.split('/').pop()),
				}))
				.slice(0, 3);
		},
		participantsMessage() {
			return this.participants.length > 1
				? `You & ${this.participants.length - 1} other members are supporting`
				: 'You are supporting';
		}
	},
};

</script>

<style lang="postcss">
.info {
	@apply tw-bg-white tw-flex tw-items-center tw-justify-center tw-gap-2 tw-shadow-lg tw-py-0.5
		md:tw-rounded-lg tw-rounded-b tw-px-4;
}

.container {
	@apply md:tw-pt-3 tw-px-0 md:tw-px-4 lg:tw-px-8;
}
</style>
