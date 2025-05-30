<template>
	<div class="tw-flex tw-flex-col tw-h-full">
		<div class="tw-flex tw-space-x-1 tw-items-center tw-pb-2 tw-pl-2">
			<div class="tw-flex">
				<KvUserAvatar
					class="avatar tw-border-white tw-rounded-full tw-border-2"
					:key="loan.id"
					v-for="(loan, index) in journeyLoans.slice(0, 3)"
					:lender-name="loan.name"
					:lender-image-url="loan.image.url"
					:style="{ 'z-index': journeyTotalLoans, 'margin-left': index > 0 ? '-25px' : 0 }"
				/>
			</div>
			<p v-if="extraLoanCount > 0">
				+{{ extraLoanCount }}
			</p>
		</div>
		<p class="tw-border-b-2 tw-border-tertiary tw-pb-1.5 tw-mx-1">
			{{ journeyDescription }}
		</p>
		<div class="tw-flex tw-justify-start tw-w-full">
			<div
				class="tw-flex tw-flex-col tw-overflow-x-auto tw-overflow-y-hidden tw-items-start"
				:class="{
					'tw-flex-col tw-py-2 tw-px-2': isMobile,
					'tw-flex-row tw-py-4 tw-px-0.5': !isMobile,
				}"
			>
				<div
					v-for="(_, index) in positions"
					:key="index"
				>
					<div
						class="badge tw-relative tw-flex tw-items-center"
						:style="{
							marginTop: `${isMobile || index === 0 ? 0 : 75}px`,
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
								style="width: 133px height: 133px"
							>
								<img
									:src="badgeWithVisibleTiers.contentfulData[index].imageUrl"
									alt="Badge"
								>
							</BadgeContainer>
						</div>
						<div class="tw-text-left tw-bg-white tw-z-1 tw-relative tw-px-2 tw-space-y-1">
							<div class="tw-font-small tw-px-0" v-if="getBadgeStatus(index) !== BADGE_LOCKED">
								<span v-if="getBadgeStatus(index) == BADGE_COMPLETED">
									{{ getTierData(index).achievementData.target }}
									loans {{ badgeSubtitle }}
								</span>
								<span v-if="getBadgeStatus(index) == BADGE_IN_PROGRESS">
									{{ tierSubtitle(index) }}
								</span>
							</div>
							<div
								class="tw-inline-flex tw-items-center tw-rounded tw-space-x-1"
								:class="{'tw-bg-eco-green-1 tw-px-1 tw-py-1':
									getBadgeStatus(index) == BADGE_IN_PROGRESS}"
							>
								<kv-icon
									v-if="(getBadgeStatus(index) == BADGE_IN_PROGRESS)"
									class="tw-text-eco-green-3 icon-width"
									name="progress-checkmark"
								/>
								<choose-checkmark
									v-if="getBadgeStatus(index) == BADGE_COMPLETED"
									class="icon-width"
								/>
								<span :class="{'tw-font-medium' : getBadgeStatus(index) !== BADGE_LOCKED}">
									{{ tierCaption(index) }}
								</span>
							</div>
						</div>
					</div>
					<div
						v-if="!(index === positions.length - 1)"
						class="tw-h-0.5"
					>
						<div
							class="tw-pl-7"
							v-if="(index % 2 === 0)"
						>
							<RightLeaningLine class="leaning-line" />
						</div>
						<div v-else class="tw-pl-6">
							<LeftLeaningLine class="leaning-line" />
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
	BADGE_IN_PROGRESS,
	BADGE_LOCKED,
	getBadgeShape,
} from '#src/composables/useBadgeModal';
import { KvUserAvatar } from '@kiva/kv-components';
import KvIcon from '#src/components/Kv/KvIcon';
import ChooseCheckmark from '#src/assets/inline-svgs/covid-response/choose-checkmark.svg';
import useBadgeData from '#src/composables/useBadgeData';
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

const {
	getBadgeWithVisibleTiers,
	getFilteredLoansByJourney,
	getTierBadgeDataByLevel,
	ID_BASIC_NEEDS,
	ID_CLIMATE_ACTION,
	ID_EQUITY,
	ID_REFUGEE_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} = useBadgeData();

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const badgeWithVisibleTiers = computed(() => getBadgeWithVisibleTiers(props.badge));

const {
	getTierPositions,
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
		return BADGE_IN_PROGRESS;
	}
	return BADGE_LOCKED;
};

const tierCaption = index => {
	const tier = badgeWithVisibleTiers.value.achievementData.tiers[index];
	if (tier.completedDate) {
		return `Achieved on ${format(new Date(tier.completedDate), 'MMMM do, yyyy')}!`;
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

const getTierData = index => {
	const levelData = getTierBadgeDataByLevel(badgeWithVisibleTiers.value, index + 1);
	return levelData;
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

const badgeSubtitle = computed(() => {
	let subtitle;
	switch (badgeWithVisibleTiers.value.id) {
		case ID_WOMENS_EQUALITY:
			subtitle = 'to women';
			break;
		case ID_US_ECONOMIC_EQUALITY:
			subtitle = 'to U.S. entrepreneurs';
			break;
		case ID_CLIMATE_ACTION:
			subtitle = 'to climate action';
			break;
		case ID_REFUGEE_EQUALITY:
			subtitle = 'to refugees';
			break;
		case ID_BASIC_NEEDS:
			subtitle = 'for fundamental needs';
			break;
		case ID_EQUITY:
			return '1 loan to anyone in need';
		default:
			subtitle = '';
			break;
	}
	return subtitle;
});

const tierSubtitle = index => {
	const { target } = getTierData(index).achievementData;
	const totalProgress = badgeWithVisibleTiers.value.achievementData.totalProgressToAchievement;
	const remainingLoans = target - totalProgress;
	const loanString = (remainingLoans === 1) ? 'loan' : 'loans';
	return `Support ${remainingLoans} more ${loanString} ${badgeSubtitle.value}`;
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
</script>

<style lang="postcss" scoped>
.leaning-line {
	height: 200px;
}

.icon-width {
	width: 22px;
}

.badge-mobile:not(:last-of-type) {
	@apply tw-mb-1.5;
}

.avatar :deep(img), .avatar :deep(.loading-placeholder ) {
	@apply !tw-w-4 !tw-h-4;
}
</style>
