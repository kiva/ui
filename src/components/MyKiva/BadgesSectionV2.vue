<template>
	<KvCarousel
		class="tw-w-full !tw-pt-0"
		:key="carouselKey"
		:controls-top-right="controlsTopRight"
		:multiple-slides-visible="true"
		:slide-max-width="SINGLE_SLIDE_WIDTH"
		slides-to-scroll="visible"
		:embla-options="{ loop: false, align: 'start' }"
		@change="handleChange"
	>
		<template v-for="(badge, index) in visibleBadges" #[`slide${index+1}`] :key="badge.id || index">
			<KvLoadingPlaceholder
				v-if="isLoading"
				class="!tw-rounded"
				:style="{ 'width': SINGLE_SLIDE_WIDTH, 'min-height': CARD_MIN_HEIGHT }"
			/>
			<div
				v-else
				class="tw-flex tw-flex-col tw-justify-between tw-cursor-pointer"
				:style="{ 'min-height': CARD_MIN_HEIGHT }"
				@click="badgeClicked(badge)"
			>
				<MyKivaProgressCard
					v-if="badge?.goal"
					:goal="badge.goal"
					:is-annual-goal="badge.isAnnualGoal"
					:goal-progress="badge.goalProgress"
					class="tw-self-start tw-mx-auto"
				/>
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
import { defaultBadges } from '#src/util/achievementUtils';
import { indexIn } from '#src/util/comparators';
import useBadgeData from '#src/composables/useBadgeData';
import { KvCarousel, KvLoadingPlaceholder } from '@kiva/kv-components';
import MyKivaProgressCard from '#src/components/MyKiva/MyKivaProgressCard';
import { useRouter } from 'vue-router';
import { COMPLETED_GOAL_THRESHOLD } from '#src/composables/useGoalData';

const CARD_MIN_HEIGHT = '111px';
const SINGLE_SLIDE_WIDTH = '336px';

const emit = defineEmits(['badge-clicked']);

const $kvTrackEvent = inject('$kvTrackEvent');
const carouselKey = ref(0);

const props = defineProps({
	badgeData: {
		type: Array,
		default: () => ([])
	},
	selectedJourney: {
		type: String,
		default: ''
	},
	controlsTopRight: {
		type: Boolean,
		default: false,
	},
});

const { selectedJourney } = toRefs(props);
const { getActiveTierData } = useBadgeData();
const router = useRouter();
const goalData = inject('goalData');

const currentIndex = ref(0);
const isLoading = ref(true);

const {
	getCtaHref,
	goalProgress,
	goalProgressPercentage,
	userGoal,
	userGoalAchieved,
} = goalData;

const userHasGoal = computed(() => !!userGoal.value && Object.keys(userGoal.value).length > 0);

const formattedBadgeData = badges => {
	return badges.map(badge => {
		const activeTierData = getActiveTierData(badge);
		const nextAchievementAt = activeTierData.target - (badge?.achievementData?.totalProgressToAchievement ?? 0);

		return {
			...badge,
			goal: {
				target: badge.achievementData?.tiers?.length || 0,
				name: badge.challengeName || '',
				category: badge.id || '',
				nextAchievementAt,
				totalLoans: badge.achievementData.totalProgressToAchievement || 0,
				tierTarget: activeTierData?.target || 0,
			},
			goalProgress: badge.level || 0,
			isAnnualGoal: !badge.achievementData?.tiers?.length,
		};
	});
};

const visibleBadges = computed(() => {
	let showedSlides = Array(5);

	const badgesSlides = props.badgeData
		.filter(b => defaultBadges.includes(b.id))
		.sort(indexIn(defaultBadges, 'id'));

	if (badgesSlides.length > 0) {
		showedSlides = formattedBadgeData(badgesSlides);
	}

	showedSlides.sort((a, b) => (b?.goalProgress ?? 0) - (a?.goalProgress ?? 0)
        || (b?.goal?.totalLoans ?? 0) - (a?.goal?.totalLoans ?? 0)
        || defaultBadges.indexOf(a?.id) - defaultBadges.indexOf(b?.id));

	if (userHasGoal.value) {
		const formattedUserGoal = {
			id: 'annual-goal',
			goal: {
				target: userGoal.value?.target || 0,
				name: userGoal.value?.name || '',
				category: userGoal.value?.category || '',
				nextAchievementAt: null,
				totalLoans: null,
			},
			goalProgress: goalProgress.value || 0,
			isAnnualGoal: true,
		};

		if (userGoalAchieved.value) {
			showedSlides.push(formattedUserGoal);
		} else {
			showedSlides.unshift(formattedUserGoal);
		}
	}

	return showedSlides;
});

const badgeClicked = badge => {
	if (!badge?.isAnnualGoal) {
		$kvTrackEvent(
			'portfolio',
			'click',
			'Badge journey map',
			badge.challengeName,
			badge.level
		);
		emit('badge-clicked', badge);
		return;
	}

	$kvTrackEvent('portfolio', 'click', 'click-annual-goal-progress-continue');
	router.push(getCtaHref(userGoal.value?.target, userGoal.value?.category, router, goalProgress.value));
};

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

// Track annual goal progress row only once when userHasGoal becomes true
let hasTrackedAnnualGoal = false;
watch(userHasGoal, newValue => {
	if (newValue && !hasTrackedAnnualGoal && COMPLETED_GOAL_THRESHOLD !== goalProgressPercentage.value) {
		$kvTrackEvent('portfolio', 'show', 'annual-goal-progress-row');
		hasTrackedAnnualGoal = true;
	}
});

// Watch visibleBadges to update isLoading
watch(visibleBadges, (newSlides, oldSlides) => {
	if (oldSlides && JSON.stringify(oldSlides) !== JSON.stringify(newSlides)) {
		isLoading.value = false;
	}
	if (oldSlides?.length !== newSlides?.length) {
		carouselKey.value += 1;
	}
}, { immediate: true, deep: true });
</script>

<style lang="postcss" scoped>

:deep(div[role=group]) {
	@apply tw-overflow-y-hidden
}

:deep(.kv-carousel__controls) {
	@apply tw--mt-6 tw-max-w-13;
}
</style>
