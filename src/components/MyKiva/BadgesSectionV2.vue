<template>
	<KvCarousel
		class="tw-w-full"
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
	onMounted,
} from 'vue';
import { defaultBadges } from '#src/util/achievementUtils';
import { indexIn } from '#src/util/comparators';
import useBadgeData from '#src/composables/useBadgeData';
import { KvCarousel, KvLoadingPlaceholder } from '@kiva/kv-components';
import MyKivaProgressCard from '#src/components/MyKiva/MyKivaProgressCard';
import useGoalData from '#src/composables/useGoalData';
import { useRouter } from 'vue-router';

const CARD_MIN_HEIGHT = '116px';
const SINGLE_SLIDE_WIDTH = '336px';

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
	controlsTopRight: {
		type: Boolean,
		default: false,
	},
});

const { selectedJourney } = toRefs(props);
const { getActiveTierData } = useBadgeData();
const router = useRouter();
const apollo = inject('apollo');

const currentIndex = ref(0);
const isLoading = ref(true);

const {
	goalProgress,
	userGoal,
	loadGoalData,
	getCtaHref,
} = useGoalData({ apollo });

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
			},
			goalProgress: badge.level || 0,
			isAnnualGoal: !badge.achievementData?.tiers?.length,
		};
	});
};

const visibleBadges = computed(() => {
	let showedSlides = Array(6);

	const badgesSlides = props.badgeData
		.filter(b => defaultBadges.includes(b.id))
		.sort(indexIn(defaultBadges, 'id'));

	if (badgesSlides.length > 0) {
		showedSlides = formattedBadgeData(badgesSlides);
	}

	if (Object.keys(userGoal.value || {})?.length) {
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

		showedSlides.unshift(formattedUserGoal);
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

	$kvTrackEvent('portfolio', 'click', 'continue-towards-goal');
	router.push(getCtaHref(userGoal.value?.target, userGoal.value?.category, router));
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

// Watch visibleBadges to update isLoading
watch(visibleBadges, (newSlides, oldSlides) => {
	if (oldSlides && JSON.stringify(oldSlides) !== JSON.stringify(newSlides)) {
		isLoading.value = false;
	}
}, { immediate: true, deep: true });

watch(userGoal, async (newVal, oldVal) => {
	// Only track when a new goal is created (oldVal had no category, newVal has one)
	if (newVal?.target && newVal?.category && !oldVal?.category) {
		$kvTrackEvent('portfolio', 'show', 'goal-set', newVal.category, newVal.target);
	}
});

onMounted(async () => {
	await loadGoalData();
});
</script>
