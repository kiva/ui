<template>
	<div>
		<!-- Loading skeletons -->
		<template v-if="loading">
			<div
				v-for="i in skeletonRowCount"
				:key="i"
				class="tw-py-2.5 tw-border-b tw-border-tertiary"
			>
				<KvGrid class="tw-grid-cols-12 tw-gap-2">
					<div class="tw-col-span-12 md:tw-col-span-5">
						<KvLoadingPlaceholder class="tw-mb-1 !tw-w-1/2" style="height: 0.875rem;" />
						<KvLoadingPlaceholder class="!tw-w-3/4" style="height: 0.875rem;" />
					</div>
					<div class="tw-col-span-12 md:tw-col-span-3">
						<KvLoadingPlaceholder class="tw-mb-1 !tw-w-1/2" style="height: 0.875rem;" />
						<KvLoadingPlaceholder class="!tw-w-3/4" style="height: 0.875rem;" />
					</div>
					<div class="tw-col-span-12 md:tw-col-span-4">
						<KvLoadingPlaceholder class="tw-mb-1 !tw-w-1/2" style="height: 0.875rem;" />
						<KvLoadingPlaceholder class="!tw-w-3/4" style="height: 0.875rem;" />
					</div>
				</KvGrid>
			</div>
		</template>

		<!-- Error state -->
		<div
			v-else-if="hasError"
			class="tw-text-danger"
			data-testid="kiva-cards-error-message"
		>
			We couldn't load your Kiva Cards right now. Please refresh the page and try again.
		</div>

		<!-- Empty state (shown only for withdrawable accounts) -->
		<div
			v-else-if="!cards.length && canWithdraw"
			class="tw-text-secondary"
			data-testid="no-kiva-cards-message"
		>
			You have purchased no
			<a href="/gifts/kiva-cards" class="tw-no-underline">Kiva Cards</a>
			at this point in time.
		</div>

		<!-- Card list -->
		<template v-else>
			<KivaCardListItem
				v-for="(card, index) in cards"
				:key="card.id"
				:card="card"
				:index="index"
			/>
		</template>
	</div>
</template>

<script>
import { KvGrid, KvLoadingPlaceholder } from '@kiva/kv-components';
import KivaCardListItem from '#src/components/Portfolio/KivaCardListItem';

export default {
	name: 'KivaCardList',
	components: {
		KvGrid,
		KvLoadingPlaceholder,
		KivaCardListItem,
	},
	props: {
		cards: {
			type: Array,
			default: () => [],
		},
		loading: {
			type: Boolean,
			default: true,
		},
		hasError: {
			type: Boolean,
			default: false,
		},
		canWithdraw: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			skeletonRowCount: 1,
		};
	},
};
</script>
