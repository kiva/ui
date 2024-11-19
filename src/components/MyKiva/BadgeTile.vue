<template>
	<div>
		<KvLoadingPlaceholder
			v-if="tileLoader"
			class="!tw-h-14 !tw-w-full md:!tw-w-1/2"
		/>
		<div v-else>
			<h4 class="tw-mb-1">
				you’re almost there
			</h4>
			<div
				class="tw-bg-white tw-p-1.5 tw-rounded md:tw-w-1/2 tw-cursor-pointer"
				@click="badgeClicked"
			>
				<div class="tw-flex tw-items-center tw-gap-2">
					<BadgeContainer
						v-if="badgeShape"
						:status="BADGE_IN_PROGRESS"
						:shape="badgeShape"
						class="tw-z-1"
						:class="{ '-tw-ml-1 -tw-mr-1.5': badgeShape === BADGE_SHAPE_OBLONG }"
					>
						<img
							:src="tierData.contentfulData.imageUrl"
							alt="Badge"
							style="height: 72px; width: 72px;"
						>
					</BadgeContainer>
					<div>
						<p class="tw-font-medium">
							{{ tileTitle }}
						</p>
						<p class="tw-text-small -tw-mt-0.5">
							{{ tierCaption }}
						</p>
						<button
							class="tw-flex tw-items-center tw-gap-0.5 tw-font-medium tw-mt-1 tw-text-action
								hover:tw-underline"
						>
							Earn badge
							<KvMaterialIcon
								class="tw-w-2.5 tw-h-2.5 tw-text-action"
								:icon="mdiArrowRight"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { mdiArrowRight } from '@mdi/js';
import { defaultBadges } from '#src/util/achievementUtils';
import { indexIn } from '#src/util/comparators';
import { BADGE_IN_PROGRESS, BADGE_SHAPE_OBLONG, getBadgeShape } from '#src/composables/useBadgeModal';
import useBadgeData from '#src/composables/useBadgeData';
import BadgeContainer from '#src/components/MyKiva/BadgeContainer';
import KvMaterialIcon from '@kiva/kv-components/dist/components/KvMaterialIcon';
import KvLoadingPlaceholder from '@kiva/kv-components/dist/components/KvLoadingPlaceholder';
import {
	computed,
	toRefs,
	watch,
	ref,
	inject,
} from 'vue';

const props = defineProps({
	userInfo: {
		type: Object,
		default: () => ({}),
	},
	badgesData: {
		type: Array,
		default: () => ([])
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');

const emit = defineEmits(['badge-clicked']);

const { userInfo, badgesData } = toRefs(props);
const { getTierBadgeDataByLevel } = useBadgeData();

const tierData = ref({});
const badgeShape = ref(null);
const tileLoader = ref(true);

const userPreferences = computed(() => {
	const preferencesData = userInfo.value?.userPreferences?.preferences ?? null;
	return preferencesData ? JSON.parse(preferencesData) : {};
});

const tieredBadges = computed(() => {
	return badgesData.value
		.filter(b => defaultBadges.includes(b.id))
		.sort(indexIn(defaultBadges, 'id'));
});

const selectedTier = computed(() => {
	const tiers = [];
	tieredBadges.value.forEach(badge => {
		const tier = badge.achievementData?.tiers?.find(t => !t.completedDate);
		const tierBadgeData = getTierBadgeDataByLevel(badge, tier.level);
		const levelName = tierBadgeData?.contentfulData?.levelName ?? '';
		if (tier) {
			tiers.push({
				badge,
				totalProgressToAchievement: badge.achievementData.totalProgressToAchievement,
				tier,
				levelName,
			});
		}
	});
	const sorted = tiers.sort((a, b) => {
		const aDiff = a.tier.target - a.totalProgressToAchievement;
		const bDiff = b.tier.target - b.totalProgressToAchievement;

		return aDiff - bDiff;
	});

	const userBadge = userPreferences.value?.goal ?? null;
	if (userBadge) {
		const userTier = sorted.find(t => t.badge.challengeName === userBadge);
		if (userTier) {
			return userTier;
		}
	}

	return tiers[0];
});

const badgeName = computed(() => selectedTier?.value?.badge?.challengeName ?? '');

const tileTitle = computed(() => {
	const tierLevel = selectedTier?.value?.levelName ?? '';
	return `${badgeName.value} (level ${tierLevel})`;
});

const tierCaption = computed(() => {
	const progress = selectedTier?.value?.totalProgressToAchievement ?? '';
	const target = selectedTier?.value?.tier?.target ?? '';

	return `${progress} of ${target} loans`;
});

const badgeClicked = () => {
	$kvTrackEvent('portfolio', 'click', 'Earn a badge - header', badgeName.value, selectedTier.value.tier.level);
	emit('badge-clicked', selectedTier.value);
};

watch(selectedTier, newVal => {
	if (newVal) {
		badgeShape.value = getBadgeShape(selectedTier.value.badge.id);
		const tierBadgeData = computed(() => getTierBadgeDataByLevel(selectedTier.value.badge, selectedTier.value.tier.level)); // eslint-disable-line max-len
		tierData.value = tierBadgeData.value;
		$kvTrackEvent('portfolio', 'view', 'Earn a badge', badgeName.value, selectedTier.value.tier.level);
	}
}, { immediate: true });

watch(badgeName, () => {
	tileLoader.value = !badgeName.value;
}, { immediate: true });
</script>
