<template>
	<div class="tw-w-full tw-inline-flex tw-flex-wrap tw-justify-center tw-gap-2.5">
		<div
			v-for="badge in badgesArray"
			:key="badge.fields.key"
			class="badge-container tw-flex tw-flex-col tw-justify-between tw-p-1.5 tw-rounded"
			:class="{
				'tw-bg-white': badge.hasStarted,
				'tw-border-4 tw-border-tertiary tw-border-dashed': !badge.hasStarted
			}"
		>
			<span class="tw-text-base !tw-font-medium tw-text-center tw-mb-1">
				{{ getBadgeTitle(badge) }}
			</span>
			<div
				class="tw-p-1"
				:class="{
					'tw-grayscale': !badge.hasStarted
				}"
				style="height: 148px;"
			>
				<img
					:src="getBadgeImgUrl(badge)"
					class="tw-h-full tw-mx-auto"
				>
			</div>
			<div class="tw-flex tw-flex-col tw-gap-0.5 tw-mt-2 tw-font-medium">
				<span
					v-if="badge.hasStarted"
					class="tw-mx-auto"
				>
					Level {{ badge.level }}/5
				</span>
				<button
					class="tw-text-action hover:tw-underline"
					v-kv-track-event="[
						'portfolio',
						'click',
						badge.hasStarted ? 'Continue' : 'Start this journey',
						getBadgeTitle(badge),
						badge.level
					]"
					@click="() => $emit('badge-clicked', badge)"
				>
					{{ badge.hasStarted ? 'Continue' : 'Start this journey' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import { defaultBadges } from '#src/util/achievementUtils';

defineEmits(['badge-clicked']);

const props = defineProps({
	badgesData: {
		type: Array,
		default: () => ([])
	},
	userAchievements: {
		type: Array,
		default: () => ([])
	}
});

const { badgesData, userAchievements } = toRefs(props);

const badgesArray = computed(() => {
	const badges = [];
	if (badgesData.value.length > 0) {
		defaultBadges.forEach(badgeKey => {
			let badgeFound = badgesData.value.find(entry => entry.fields.key === `${badgeKey}-level-1`);
			const userAchievement = userAchievements.value.find(entry => entry.id === badgeKey);

			if (!userAchievement) {
				badgeFound = {
					...badgeFound,
					hasStarted: false,
					level: 0,
				};
			} else {
				const hasStarted = userAchievement.status !== 'NO_PROGRESS';
				// TODO: Change this to level when we have the data from the backend
				const level = userAchievement.totalProgressToAchievement;
				badgeFound = {
					...badgeFound,
					hasStarted,
					level,
					...userAchievement,
				};
			}

			badges.push(badgeFound);
		});
	}
	return badges;
});

const getBadgeTitle = badge => badge?.fields?.challengeName ?? '';

const getBadgeImgUrl = badge => badge?.fields?.badgeImage?.fields?.file?.url ?? '';
</script>

<style lang="postcss" scoped>
.badge-container {
    width: 175px;

    @screen md {
        width: 220px;
    }
}
</style>
