<template>
	<div class="tw-w-full tw-inline-flex tw-flex-wrap tw-justify-center tw-gap-2.5">
		<div
			v-for="badge in badgesArray"
			:key="badge.fields.key"
			class="badge-container tw-flex tw-flex-col tw-justify-between tw-p-1.5 tw-rounded"
		>
			<div
				class="tw-p-1"
				style="height: 148px;"
			>
				<img
					:src="getBadgeImgUrl(badge)"
					class="tw-h-full tw-mx-auto"
				>
			</div>
			<div class="tw-flex tw-flex-col tw-gap-0.5 tw-mt-2 tw-font-medium">
				<span class="tw-text-base !tw-font-medium tw-text-center">
					{{ getBadgeTitle(badge) }}
				</span>
				<span class="tw-mx-auto tw-text-small">
					{{ getBadgeDate(badge) }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, toRefs, ref } from 'vue';
import { format } from 'date-fns';

defineEmits(['badge-clicked']);

const props = defineProps({
	badgesData: {
		type: Array,
		default: () => ([])
	},
	lendingAchievements: {
		type: Array,
		default: () => ([])
	},
	tieredAchievements: {
		type: Array,
		default: () => ([])
	}
});

const { badgesData, lendingAchievements, tieredAchievements } = toRefs(props);

const showedBadges = ref([]);

const badgesArray = computed(() => {
	const badges = [];
	if (badgesData.value.length > 0) {
		lendingAchievements.value.forEach(achievement => {
			if (achievement.milestoneProgress?.[0]?.milestoneStatus === 'COMPLETE') {
				let badgeFound = badgesData.value.find(entry => entry.fields.key === achievement.id);
				badgeFound = {
					...badgeFound,
					earnedAtDate: achievement.milestoneProgress?.[0]?.earnedAtDate,
				};

				badges.push(badgeFound);
			}
		});
	}
	return badges;
});

const getBadgeTitle = badge => badge?.fields?.challengeName ?? '';

const getBadgeImgUrl = badge => badge?.fields?.badgeImage?.fields?.file?.url ?? '';

const getBadgeDate = badge => {
	const earnedAtDate = Date.parse(badge.earnedAtDate);
	return format(earnedAtDate, 'MMM yyyy');
};
</script>

<style lang="postcss" scoped>
.badge-container {
    width: 175px;

    @screen md {
        width: 220px;
    }
}
</style>
