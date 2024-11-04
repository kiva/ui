<template>
	<section class="tw-bg-white tw-py-2">
		<MyKivaContainer>
			<div class="tw-my-3">
				<h3
					class="tw-text-center tw-mb-2"
				>
					My achievements
				</h3>
				<div>
					<div class="tw-w-full tw-inline-flex tw-flex-wrap tw-justify-center tw-gap-2.5">
						<div
							v-for="badge in visibleBadges"
							:key="badge.id"
							class="badge-container tw-flex tw-flex-col tw-justify-between tw-p-1.5 tw-rounded"
						>
							<div
								class="tw-p-1 tw-cursor-pointer"
								style="height: 148px;"
								@click="clickBadge(badge)"
							>
								<img
									:src="getBadgeImgUrl(badge)"
									class="tw-h-full tw-mx-auto"
								>
							</div>
							<div class="tw-flex tw-flex-col tw-gap-0.5 tw-font-medium">
								<span class="tw-text-base !tw-font-medium tw-text-center">
									{{ getBadgeTitle(badge) }}
								</span>
								<span class="tw-mx-auto tw-text-small">
									{{ getBadgeDate(badge) }}
								</span>
							</div>
						</div>
					</div>
					<div
						v-if="completedBadges.length > visibleLimit && visibleBadges.length < completedBadges.length"
						class="tw-flex tw-justify-center"
					>
						<kv-button
							class="tw-mt-2 tw-mx-auto"
							variant="secondary"
							v-kv-track-event="['portfolio', 'click', 'load-more-badges']"
							@click="loadMoreBadges"
						>
							Load more
						</kv-button>
					</div>
				</div>
			</div>
		</MyKivaContainer>
	</section>
</template>

<script setup>
import {
	computed,
	toRefs,
	ref,
	inject,
} from 'vue';
import { format } from 'date-fns';
import KvButton from '@kiva/kv-components/vue/KvButton';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';

const $kvTrackEvent = inject('$kvTrackEvent');

const emit = defineEmits(['badge-clicked']);

const props = defineProps({
	badgesData: {
		type: Array,
		default: () => ([])
	},
});

const visibleLimit = ref(6);
const visibleOffset = ref(1);

const { badgesData } = toRefs(props);

const completedBadges = computed(() => {
	const completedBadgesArr = [];

	badgesData.value.forEach(badge => {
		if (badge.achievementData?.tiers?.length) {
			const { tiers } = badge.achievementData;
			tiers.forEach(tier => {
				if (tier.completedDate) {
					completedBadgesArr.push({
						...badge,
						earnedAtDate: tier.completedDate,
						level: tier.level,
					});
				}
			});
		}
		if (badge.achievementData?.milestoneProgress?.length) {
			const earnedAtDate = badge.achievementData?.milestoneProgress?.[0]?.earnedAtDate;
			if (earnedAtDate) {
				completedBadgesArr.push({
					...badge,
					earnedAtDate,
					level: 0,
				});
			}
		}
	});

	// ascending chronological order
	completedBadgesArr.sort((a, b) => {
		return new Date(a.earnedAtDate) - new Date(b.earnedAtDate);
	});

	return completedBadgesArr;
});

const visibleBadges = computed(() => completedBadges.value.slice(0, visibleLimit.value * visibleOffset.value));

const getBadgeTitle = badge => {
	if (badge.level === 0) {
		return badge?.contentfulData?.[0]?.challengeName ?? '';
	}
	const badgeData = badge?.contentfulData?.find(data => data.level === badge.level);
	return `${badgeData?.challengeName} ${badgeData?.level}` ?? '';
};

const getBadgeImgUrl = badge => {
	if (badge.level === 0) {
		return badge?.contentfulData?.[0]?.imageUrl ?? '';
	}
	const badgeData = badge?.contentfulData?.find(data => data.level === badge.level);
	return badgeData?.imageUrl ?? '';
};

const getBadgeDate = badge => {
	const earnedAtDate = badge.earnedAtDate ? Date.parse(badge.earnedAtDate) : new Date();
	return format(earnedAtDate, 'MMM yyyy');
};

const loadMoreBadges = () => {
	visibleOffset.value += 1;
};

const clickBadge = badge => {
	$kvTrackEvent(
		'portfolio',
		'click',
		'already-earned-badge-modal-from-earned-badge-section',
		badge.challengeName,
		badge.level,
	);
	emit('badge-clicked', badge);
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
