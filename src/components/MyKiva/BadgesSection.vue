<template>
	<KvCarousel
		ref="carousel"
		class="badges-carousel tw-w-full tw-overflow-visible"
		:multiple-slides-visible="true"
		:slide-max-width="singleSlideWidth"
		slides-to-scroll="visible"
		:embla-options="{ loop: false }"
		@change="handleChange"
	>
		<template v-for="(badge, index) in visibleBadges" #[`slide${index+1}`] :key="badge.id || index">
			<div
				class="tw-flex tw-flex-col tw-justify-between tw-p-1.5 tw-rounded tw-cursor-pointer"
				:class="{
					'tw-bg-white': badge.hasStarted,
					'tw-border-4 tw-border-tertiary tw-border-dashed': !badge.hasStarted
				}"
				style="min-height: 228px;"
				@click="badgeClicked(badge)"
			>
				<BadgeContainer
					:status="getBadgeStatus(badge)"
					:shape="getBadgeShape(badge.id)"
					:is-carousel="true"
					:has-started="badge.hasStarted"
					class="tw-self-start tw-mx-auto"
					style="height: 133px;"
				>
					<img
						:src="getActiveTierData(badge).imageUrl"
						:alt="badge.challengeName"
						class="tw-h-full tw-mx-auto"
					>
				</BadgeContainer>
				<div class="tw-flex tw-flex-col tw-gap-0.5 tw-font-medium tw-grow">
					<span
						v-if="badge.hasStarted"
						class="tw-mx-auto"
					>
						{{ levelCaption(badge) }}
					</span>
					<button
						class="tw-text-action hover:tw-underline tw-mt-auto"
					>
						{{ ctaCaption(badge) }}
					</button>
				</div>
			</div>
		</template>
	</KvCarousel>
</template>

<script setup>
import {
	computed,
	watch,
	inject,
	toRefs,
	ref,
} from 'vue';
import useIsMobile from '#src/composables/useIsMobile';
import { defaultBadges } from '#src/util/achievementUtils';
import { indexIn } from '#src/util/comparators';
import useBadgeData from '#src/composables/useBadgeData';
import {
	getBadgeShape, BADGE_COMPLETED, BADGE_IN_PROGRESS, MOBILE_BREAKPOINT
} from '#src/composables/useBadgeModal';
import { KvCarousel } from '@kiva/kv-components';
import BadgeContainer from './BadgeContainer';

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const emit = defineEmits(['badge-clicked']);

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	badgeData: {
		type: Array,
		default: () => ([])
	},
	selectedJourney: {
		type: String,
		default: ''
	},
});

const { selectedJourney } = toRefs(props);

const { getActiveTierData, getBadgeWithVisibleTiers } = useBadgeData();

const currentIndex = ref(0);

const visibleBadges = computed(() => {
	return props.badgeData
		.filter(b => defaultBadges.includes(b.id))
		.sort(indexIn(defaultBadges, 'id'));
});

const getBadgeStatus = badge => {
	const activeTier = getActiveTierData(badge);
	if (activeTier?.level === badge?.achievementData?.tiers?.length && activeTier?.completedDate) {
		return BADGE_COMPLETED;
	}
	return BADGE_IN_PROGRESS;
};

const levelCaption = badge => {
	if (getBadgeStatus(badge) === BADGE_COMPLETED) {
		return 'Complete!';
	}
	return `${getActiveTierData(badge).level - 1}/${getBadgeWithVisibleTiers(badge).achievementData.tiers.length} achievements`; // eslint-disable-line max-len
};

const ctaCaption = badge => {
	if (getBadgeStatus(badge) === BADGE_COMPLETED) {
		return 'See details';
	}
	return badge.hasStarted ? 'Continue' : 'Get started';
};

const badgeClicked = badge => {
	$kvTrackEvent(
		'portfolio',
		'click',
		'Badge journey map',
		badge.challengeName,
		badge.level
	);
	emit('badge-clicked', badge);
};

const singleSlideWidth = computed(() => {
	if (isMobile.value) {
		return '172px';
	}
	return '220px';
});

const handleChange = interaction => {
	const direction = currentIndex.value > interaction.value ? 'prev' : 'next';
	currentIndex.value = interaction.value;

	$kvTrackEvent(
		'portfolio',
		'click',
		'achievements-carousel',
		`${direction}-step-carousel`,
	);
};

watch(selectedJourney, () => {
	if (selectedJourney.value) {
		const badge = visibleBadges.value.find(b => b.id === selectedJourney.value);
		if (badge) {
			badgeClicked(badge);
		}
	}
});
</script>

<style lang="postcss" scoped>
.badges-carousel :deep(div:first-child) {
	@apply tw-gap-2;
}

.badges-carousel :deep(.kv-carousel__controls) {
	@apply tw-hidden md:tw-flex tw-justify-start tw-mt-2;
}

.badges-carousel :deep(.kv-carousel__controls) div {
	@apply tw-invisible tw-mx-0 tw-w-2;
}
</style>
