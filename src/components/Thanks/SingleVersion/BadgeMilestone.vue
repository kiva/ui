<template>
	<div
		v-if="showBadgeModule"
		class="tw-rounded md:tw-rounded-lg tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-4 tw-flex tw-flex-col
			tw-gap-2 print:tw-hidden tw-items-center tw-text-center tw-overflow-hidden tw-relative"
	>
		<div v-show="!isLoading" class="ray-box">
			<div class="ray ray1"></div>
			<div class="ray ray2"></div>
			<div class="ray ray3"></div>
			<div class="ray ray4"></div>
			<div class="ray ray5"></div>
			<div class="ray ray6"></div>
			<div class="ray ray7"></div>
			<div class="ray ray8"></div>
			<div class="ray ray9"></div>
			<div class="ray ray10"></div>
		</div>
		<KvLoadingPlaceholder v-if="isLoading" class="!tw-h-9 !tw-rounded" />
		<template v-else>
			<h2 style="line-height: 1.25;">
				{{ title }}
			</h2>
			<BadgeContainer :show-shine="true">
				<img
					v-if="badgeImageUrl"
					:src="badgeImageUrl"
					alt="Badge"
					style="height: 250px; width: 250px;"
				>
			</BadgeContainer>
			<h3 v-if="isOptedIn">
				Take the next step on your impact journey.
			</h3>
			<KvButton class="continue-button tw-w-full tw-my-0.5" @click="emit('continue-clicked')">
				Continue
				<KvMaterialIcon :icon="mdiArrowRight" class="tw-ml-0.5" />
			</KvButton>
		</template>
	</div>
</template>

<script setup>
import {
	ref,
	inject,
	computed,
	watch,
	onMounted,
} from 'vue';
import { mdiArrowRight } from '@mdi/js';
import useBadgeData, { ID_EQUITY } from '#src/composables/useBadgeData';
import { KvMaterialIcon, KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';
import BadgeContainer from '#src/components/MyKiva/BadgeContainer';

const emit = defineEmits(['continue-clicked']);

const props = defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	isOptedIn: {
		type: Boolean,
		default: false,
	},
	badgeAchievedIds: {
		type: Array,
		default: () => ([]),
	},
	onlyKivaCards: {
		type: Boolean,
		default: false,
	},
	onlyDonations: {
		type: Boolean,
		default: false,
	},
});

const apollo = inject('apollo');

const {
	fetchAchievementData,
	fetchContentfulData,
	badgeContentfulData,
	badgeData,
	getHighestPriorityDisplayBadge,
	getLastCompletedBadgeLevelData,
} = useBadgeData();

const badgeDataAchieved = ref();

const isLoading = computed(() => !badgeDataAchieved.value);

const showEqualityBadge = computed(() => props.isGuest || props.onlyKivaCards || props.onlyDonations);

const showBadgeModule = computed(() => showEqualityBadge.value || !!props.badgeAchievedIds.length);

const title = computed(() => (props.isOptedIn ? 'Thank you!' : 'Take the next step on your impact journey.'));

const displayedBadgeData = computed(() => {
	if (badgeDataAchieved.value?.length) {
		if (showEqualityBadge.value) {
			return badgeDataAchieved.value[0];
		}
		const displayedBadge = getHighestPriorityDisplayBadge(badgeDataAchieved.value);
		return getLastCompletedBadgeLevelData(displayedBadge);
	}
	return {};
});

const badgeImageUrl = computed(() => displayedBadgeData.value.contentfulData?.imageUrl ?? '');

onMounted(async () => {
	// Load combined badge data, since badgesAchieved prop only contains the badge IDs
	fetchContentfulData(apollo);

	if (!showEqualityBadge.value) {
		// Achievement data isn't needed when showing the equity badge
		await fetchAchievementData(apollo);
	}
});

watch(() => badgeContentfulData.value, () => {
	// Guests don't have access to achievement data, so we only show the equity badge
	if (showEqualityBadge.value && badgeContentfulData.value?.length) {
		const equityBadge = badgeContentfulData.value.find(b => b.id === ID_EQUITY);
		if (equityBadge) {
			badgeDataAchieved.value = [
				{
					levelName: equityBadge.challengeName,
					contentfulData: { ...equityBadge },
				},
			];
		}
	}
});

watch(() => badgeData.value, () => {
	if (!showEqualityBadge.value && badgeData.value.length) {
		badgeDataAchieved.value = badgeData.value.filter(b => props.badgeAchievedIds.includes(b.id));
	}
}, { immediate: true });
</script>

<style lang="postcss" scoped>
.continue-button :deep(span) {
	@apply tw-flex;
}

.ray-box {
	@apply tw-absolute tw-mx-auto tw-left-0 tw-right-0 tw-bottom-0 tw-aspect-square tw-top-5;

	width: 250px;
}

.ray {
	@apply tw-absolute tw-ml-1;

	background: linear-gradient(180deg, rgba(241 179 67 / 3%) 0%,
	rgba(241 179 67 / 25%) 50%, rgba(241 179 67 / 3%) 100%);
	border-radius:80% 80% 0 0;
	animation: ray 2.5s ease-in-out infinite;
}

.ray1 {
	transform: rotate(180deg);
	height: 130px;
	width: 30px;
	top: -15%;
	left: 42%;

	@screen md {
		height: 80px;
		top: -12%;
	}
}

.ray2 {
	transform: rotate(220deg);
	animation-delay: 1s;
	height: 140px;
	width: 8px;
	top: -5%;
	left: 85%;

	@screen md {
		height: 130px;
		top: -15%;
		left: 85%;
	}
}

.ray3 {
	transform: rotate(250deg);
	animation-delay: 1.5s;
	height: 80px;
	width: 20px;
	top: 45%;
	left: 88%;

	@screen md {
		height: 180px;
		top: 15%;
		left: 105%;
	}
}

.ray4 {
	transform: rotate(305deg);
	animation-delay: 0.5s;
	height: 90px;
	width: 14px;
	top: 80%;
	left: 90%;

	@screen md {
		height: 180px;
		top: 65%;
		left: 98%;
	}
}

.ray5 {
	transform: rotate(-15deg);
	animation-delay: 1s;
	height: 110px;
	width: 30px;
	top: 110%;
	left: 60%;

	@screen md {
		height: 130px;
		top: 100%;
		left: 58%;
	}
}

.ray6 {
	transform: rotate(30deg);
	animation-delay: 2s;
	height: 110px;
	width: 25px;
	top: 105%;
	left: 18%;

	@screen md {
		height: 130px;
		top: 98%;
		left: 15%;
	}
}

.ray7 {
	transform: rotate(70deg);
	animation-delay: 1.5s;
	height: 90px;
	width: 10px;
	top: 80%;
	left: 0%;

	@screen md {
		height: 180px;
		top: 63%;
		left: -15%;
	}
}

.ray8 {
	transform: rotate(100deg);
	animation-delay: 0.5s;
	height: 80px;
	width: 28px;
	top: 55%;
	left: -5%;

	@screen md {
		height: 180px;
		top: 25%;
		left: -20%;
	}
}

.ray9 {
	transform: rotate(120deg);
	animation-delay: 2s;
	height: 80px;
	width: 10px;
	top: 30%;
	left: 1%;

	@screen md {
		height: 180px;
		top: -5%;
		left: -15%;
	}
}

.ray10 {
	transform: rotate(150deg);
	animation-delay: 1s;
	height: 120px;
	width: 23px;
	top: -2%;
	left: 12%;

	@screen md {
		height: 90px;
		top: -5%;
		left: 12%;
	}
}

@keyframes ray {
	0% {
		opacity: 0.4;
	}

	25% {
		opacity: 1;
	}

	75% {
		opacity: 1;
	}

	100% {
		opacity: 0.4;
	}
}
</style>
