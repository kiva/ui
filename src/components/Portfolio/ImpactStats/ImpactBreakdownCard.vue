<template>
	<ImpactSectionCard
		:title="config.title"
		:loading="loading"
		:error="error"
		:data-testid="`impact-${type}`"
	>
		<template v-if="loading || totalCount !== null" #pill>
			<span :data-testid="`impact-${type}-count`">
				<template v-if="isZero">{{ totalCount }} to explore</template>
				<template v-else>{{ lentCount }} of {{ totalCount }}</template>
			</span>
		</template>
		<template #loading>
			<div class="tw-flex tw-items-center tw-gap-2" :data-testid="`impact-${type}-loading`">
				<div class="tw-shrink-0 tw-w-15 tw-h-15">
					<KvLoadingPlaceholder />
				</div>
				<KvLoadingText :lines="4" class="tw-flex-1 md:tw-flex-none md:tw-w-1/3 tw-text-small" />
			</div>
		</template>

		<div v-if="isZero" class="tw-flex tw-flex-col tw-gap-2">
			<div class="tw-flex tw-items-center tw-gap-2">
				<div class="breakdown-card__empty-ring tw-shrink-0 tw-w-15 tw-h-15 tw-rounded-full" aria-hidden="true">
				</div>
				<p class="tw-flex tw-items-center tw-gap-0.5 tw-text-caption tw-text-secondary">
					<span class="tw-w-1 tw-h-1 tw-rounded-full tw-bg-gray-300" aria-hidden="true"></span>
					<span :data-testid="`impact-${type}-no-loans`">No loans yet</span>
				</p>
			</div>
			<hr class="tw-border-tertiary">
			<div>
				<p class="tw-text-caption tw-text-secondary tw-mb-1">
					Start anywhere
				</p>
				<ul class="tw-flex tw-flex-wrap tw-gap-x-2 tw-gap-y-1">
					<li v-for="item in shownNotLentTo" :key="item.id" class="tw-flex">
						<KvTextLink
							v-kv-track-event="['portfolio', 'click', `${type}-breakdown-not-lent-to`, item.id]"
							:href="config.itemUrl(item.id)"
							class="tw-underline"
							:data-testid="`impact-${type}-not-lent-item`"
						>
							{{ item.name }}
						</KvTextLink>
					</li>
					<li v-if="moreCount > 0" class="tw-flex">
						<KvTextLink
							v-kv-track-event="['portfolio', 'click', `${type}-breakdown-more`]"
							:icon="mdiChevronRight"
							class="tw-underline"
							:data-testid="`impact-${type}-more`"
							@click="lightboxOpen = true"
						>
							+{{ moreCount }} more
						</KvTextLink>
					</li>
				</ul>
			</div>
		</div>

		<div v-else class="breakdown-card__row tw-grid tw-gap-y-2 md:tw-gap-x-4.5">
			<KvPieChartV2
				:values="chartValues"
				layout="two-column"
				list-header="Lent to"
				more-link-label="+{count} more"
				:list-gap="listGap"
			/>
			<div v-if="notLentTo.length" class="md:tw-self-center">
				<h4 class="tw-text-h4 tw-text-primary tw-mb-1">
					Not yet lent to
				</h4>
				<ul class="tw-grid tw-grid-cols-2 md:tw-grid-cols-1 tw-gap-0.5">
					<li v-for="item in shownNotLentTo" :key="item.id" class="tw-flex tw-min-w-0">
						<KvTextLink
							v-kv-track-event="['portfolio', 'click', `${type}-breakdown-not-lent-to`, item.id]"
							:href="config.itemUrl(item.id)"
							class="tw-underline"
							:data-testid="`impact-${type}-not-lent-item`"
						>
							{{ item.name }}
						</KvTextLink>
					</li>
					<li v-if="moreCount > 0" class="tw-flex">
						<KvTextLink
							v-kv-track-event="['portfolio', 'click', `${type}-breakdown-more`]"
							class="tw-underline"
							:data-testid="`impact-${type}-more`"
							@click="lightboxOpen = true"
						>
							+ {{ moreCount }} more
						</KvTextLink>
					</li>
				</ul>
				<KvButton
					v-kv-track-event="['portfolio', 'click', `${type}-breakdown-lend-new`]"
					class="tw-mt-1 md:tw-mt-0.5 tw-whitespace-nowrap"
					variant="secondary"
					size="small"
					:href="config.lendNewUrl(notLentTo.map(item => item.id))"
					:data-testid="`impact-${type}-lend-new`"
				>
					Lend to a new {{ config.noun }}
				</KvButton>
			</div>
		</div>

		<KvLightbox
			:visible="lightboxOpen"
			title="Not yet lent to"
			@lightbox-closed="lightboxOpen = false"
		>
			<ul class="tw-grid tw-grid-cols-2 tw-gap-x-2 tw-gap-y-1">
				<li v-for="item in notLentTo" :key="item.id" class="tw-flex tw-min-w-0">
					<KvTextLink
						v-kv-track-event="['portfolio', 'click', `${type}-breakdown-not-lent-to`, item.id]"
						:href="config.itemUrl(item.id)"
						class="tw-underline"
						:data-testid="`impact-${type}-lightbox-item`"
					>
						{{ item.name }}
					</KvTextLink>
				</li>
			</ul>
		</KvLightbox>
	</ImpactSectionCard>
</template>

<script setup>
import { computed, ref } from 'vue';
import { mdiChevronRight } from '@mdi/js';
import {
	KvButton, KvLightbox, KvLoadingPlaceholder, KvLoadingText, KvPieChartV2, KvTextLink,
} from '@kiva/kv-components';
import { useBreakpoints } from '@kiva/kv-components/utils/useBreakpoints';
import ImpactSectionCard from '#src/components/Portfolio/ImpactStats/ImpactSectionCard';
import useSectorBreakdown from '#src/composables/useSectorBreakdown';

defineOptions({ name: 'ImpactBreakdownCard' });

const TYPES = {
	sector: {
		title: 'By Sector',
		noun: 'sector',
		useBreakdown: useSectorBreakdown,
		itemUrl: id => `/lend/filter?sector=${id}`,
		lendNewUrl: ids => `/lend/filter?sector=${ids.join(',')}`,
	},
};

const props = defineProps({
	type: {
		type: String,
		required: true,
		validator: value => ['sector'].includes(value),
	},
});

const config = TYPES[props.type];

const {
	notLentTo,
	chartValues,
	lentCount,
	totalCount,
	loading,
	error,
} = config.useBreakdown();

const { isMobile } = useBreakpoints();
const listGap = computed(() => (isMobile.value ? 2 : 5));

const lightboxOpen = ref(false);

const isZero = computed(() => lentCount.value === 0);
const shownNotLentTo = computed(() => notLentTo.value?.slice(0, isZero.value ? 3 : 4) ?? []);
const moreCount = computed(() => (notLentTo.value?.length ?? 0) - shownNotLentTo.value.length);
</script>

<style lang="postcss" scoped>
.breakdown-card__empty-ring {
	border: 1.6rem solid theme('colors.gray.200');
}

@screen md {
	.breakdown-card__row {
		grid-template-columns: minmax(0, 2fr) minmax(max-content, 1fr);
	}
}
</style>
