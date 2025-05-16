<template>
	<div class="tw-flex tw-flex-col tw-h-full">
		<div class="tw-flex tw-flex-col">
			<KvUserAvatar
				class="avatar tw-border-white tw-rounded-full tw-border-2"
				:key="loan.id"
				v-for="(loan, i) in journeyLoans.slice(0, 3)"
				:lender-name="loan.name"
				:lender-image-url="loan.image.url"
				:class="{ 'tw--ml-2.5': i > 0 }"
				:style="{ 'z-index': journeyTotalLoans }"
			/>
			<p v-if="extraLoanCount > 0">
				+{{ extraLoanCount }}
			</p>
		</div>
		<p class="tw-border-b-2 tw-border-tertiary tw-pb-1.5 tw-mx-2">
			{{ journeyDescription }}
		</p>
		<div class="tw-flex tw-justify-center tw-w-full">
			<div
				class="tw-flex tw-flex-col tw-overflow-x-auto tw-overflow-y-hidden tw-items-start"
				:class="{
					'tw-flex-col tw-py-2 tw-px-2': isMobile,
					'tw-flex-row tw-py-4 tw-px-0.5': !isMobile,
				}"
			>
				<div
					v-for="(position, index) in positions"
					:key="index"
				>
					<div
						class="badge tw-relative tw-flex tw-items-center"
						:style="{
							marginTop: `${isMobile || position == 1 ? 0 : 75}px`,
							zIndex: positions.length - index,
						}"
					>
						<div
							class="tw-relative tw-flex tw-text-center tw-bg-white tw-cursor-pointer"
							@click="handleBadgeClick(index)"
						>
							<BadgeContainer
								:status="getBadgeStatus(index)"
								:shape="getBadgeShape(badgeWithVisibleTiers.id)"
							>
								<img
									:ref="el => setImgRefs(el, index)"
									:src="badgeWithVisibleTiers.contentfulData[index].imageUrl"
									alt="Badge"
									style="height: 133px; width: 133px;"
								>
							</BadgeContainer>
							<div
								v-if="showEarnBadge(index)"
								class="tw-absolute tw-flex tw-items-center tw-justify-center tw-rounded-full tw-min-w-3
									tw-min-h-3 tw-font-medium tw-bg-gray-200 tw-text-center tw-z-2 tw-px-0.5
									tw-aspect-square tw-text-small"
								:style="getNumberCircleStyles()"
							>
								{{ badgeWithVisibleTiers.achievementData.totalProgressToAchievement }}
							</div>
						</div>
						<div class="tw-text-left tw-bg-white tw-z-1 tw-relative">
							<div class="tw-font-small">
								{{ getTierName(index) }}
							</div>
							<div
								class="tw-flex tw-items-center tw-rounded tw-pr-2"
								:class="{'tw-bg-[#EDF4F1]': !(index === positions.length - 1) && showEarnBadge(index),}"
							>
								<kv-icon class="tw-text-white tw-bg-green" name="check-with-bg" />
								<span :class="{'tw-font-medium' : getBadgeStatus(index) !== BADGE_LOCKED}">
									{{ tierCaption(index) }}
								</span>
							</div>
						</div>
					</div>
					<div
						v-if="!(index === positions.length - 1)"
						:ref="el => setLineRefs(el, index)"
						class="tw-h-[1px]"
					>
						<div
							class="tw-pl-7"
							v-if="(index % 2 === 0)"
						>
							<RightLeaningLine class="tw-h-[200px]" />
						</div>
						<div v-else class="tw-pl-6">
							<LeftLeaningLine class="tw-h-[200px]" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	defineProps,
	ref,
	computed,
	defineAsyncComponent
} from 'vue';
import { format } from 'date-fns';
import useIsMobile from '#src/composables/useIsMobile';
import useBadgeModal,
{
	MOBILE_BREAKPOINT,
	BADGE_COMPLETED,
	BADGE_LOCKED,
	getBadgeShape,
} from '#src/composables/useBadgeModal';
import { KvUserAvatar } from '@kiva/kv-components';
import useBadgeData from '#src/composables/useBadgeData';
import KvIcon from '#src/components/Kv/KvIcon';
import BadgeContainer from './BadgeContainer';

const props = defineProps({
	badge: {
		type: Object,
		required: true,
	},
	loans: {
		type: Array,
		default: () => ([]),
	}
});

const { getBadgeWithVisibleTiers, getTierBadgeDataByLevel, getFilteredLoansByJourney } = useBadgeData();

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const badgeWithVisibleTiers = computed(() => getBadgeWithVisibleTiers(props.badge));

const {
	getTierPositions,
	getNumberCircleStyles,
} = useBadgeModal(badgeWithVisibleTiers.value);

const emit = defineEmits(['badge-level-clicked']);

const positions = ref(getTierPositions());

const showEarnBadge = index => {
	return (
		!badgeWithVisibleTiers.value.achievementData.tiers[index - 1]
		|| !!badgeWithVisibleTiers.value.achievementData.tiers[index - 1]?.completedDate
	) && !badgeWithVisibleTiers.value.achievementData.tiers[index].completedDate;
};

const getBadgeStatus = index => {
	const tier = badgeWithVisibleTiers.value.achievementData.tiers[index] ?? {};
	if (tier.completedDate) {
		return BADGE_COMPLETED;
	}
	if (showEarnBadge(index)) {
		return BADGE_COMPLETED;
	}
	return BADGE_LOCKED;
};

const tierCaption = index => {
	const tier = badgeWithVisibleTiers.value.achievementData.tiers[index];
	if (tier.completedDate) {
		return `Achieved on ${format(new Date(tier.completedDate), 'MMMM do, yyyy')}`;
	}
	if (getBadgeStatus(index) === BADGE_LOCKED) {
		return `${tier.target} loans`;
	}
	if (tier.target) {
		return `
			Progress
			${badgeWithVisibleTiers.value.achievementData.totalProgressToAchievement}/${tier.target}
			loans
		`;
	}
};

const getTierName = index => {
	const levelData = getTierBadgeDataByLevel(badgeWithVisibleTiers.value, index + 1);
	return levelData.tierName;
};

const handleBadgeClick = index => {
	if (getBadgeStatus(index) !== BADGE_LOCKED) {
		emit('badge-level-clicked', {
			id: badgeWithVisibleTiers.value.id,
			challengeName: badgeWithVisibleTiers.value.challengeName,
			tier: badgeWithVisibleTiers.value.achievementData.tiers[index]
		});
	}
};

const journeyLoans = computed(() => getFilteredLoansByJourney(badgeWithVisibleTiers.value, props.loans));
const journeyTotalLoans = computed(() => journeyLoans.value.length);
const extraLoanCount = computed(() => journeyTotalLoans.value - 3);

const journeyLoansNames = computed(() => {
	const names = journeyLoans.value.slice(0, 3).map(loan => loan?.name ?? '');

	return names.length > 1
		? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`
		: names[0] || '';
});

const journeyDescription = computed(() => {
	const journeyLoansCopy = journeyTotalLoans.value
		// eslint-disable-next-line max-len
		? `Your loan${journeyTotalLoans.value > 1 ? 's' : ''} to ${journeyLoansNames.value} ${journeyTotalLoans.value > 1 ? 'have' : 'has'} made progress toward this impact journey. `
		: '';

	return `${journeyLoansCopy}${badgeWithVisibleTiers.value.description}`;
});

const RightLeaningLine = defineAsyncComponent(() => import('#src/assets/images/right-leaning-line.svg'));
const LeftLeaningLine = defineAsyncComponent(() => import('#src/assets/images/left-leaning-line.svg'));

const imgRefs = ref([]);
const lineRefs = ref([]);

const setImgRefs = (el, index) => {
	if (el) imgRefs.value[index] = el;
};
const setLineRefs = (el, index) => {
	if (el) lineRefs.value[index] = el;
};
</script>

<style lang="postcss" scoped>
.badge-mobile:not(:last-of-type) {
	@apply tw-mb-1.5;
}

.avatar :deep(img), .avatar :deep(.loading-placeholder ) {
	@apply !tw-w-4 !tw-h-4;
}
</style>
