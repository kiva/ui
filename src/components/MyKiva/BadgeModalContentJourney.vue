<template>
	<div class="tw-flex tw-flex-col tw-h-full">
		<div v-if="journeyLoans.length" class="tw-flex tw-space-x-1 tw-items-center tw-pb-0.5 tw-pl-1">
			<div class="tw-flex">
				<KvUserAvatar
					class="tw-border-white tw-border-2 tw-w-4 tw-h-4"
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
		<p class="tw-border-b-2 tw-border-tertiary tw-pb-1 tw-mx-1">
			{{ journeyDescription }}
		</p>
		<div class="tw-flex tw-justify-start tw-w-full">
			<div
				class="tw-flex tw-flex-col tw-overflow-x-auto tw-overflow-y-hidden tw-items-start"
				:class="{
					'tw-flex-col tw-pt-2 tw-px-1': isMobile,
					'tw-flex-row tw-py-2 tw-px-0.5': !isMobile,
				}"
			>
				<div
					v-for="(_, index) in positions"
					:key="index"
				>
					<div
						class="badge tw-relative tw-flex tw-items-center"
						:style="{
							marginTop: badgeMarginTop(index),
							zIndex: positions.length - index,
						}"
					>
						<div
							class="tw-relative tw-flex tw-text-center tw-bg-white tw-cursor-pointer"
							@click="handleBadgeClick(index)"
						>
							<BadgeContainer
								:status="getBadgeStatus(index)"
								:shape="getBadgeShape(badge.id)"
								:style="{ width: iconSize, height: iconSize }"
								:class="{ 'tw--ml-1.5': isWomenBadge }"
							>
								<img
									:src="badge.contentfulData[index].imageUrl"
									alt="Badge"
								>
							</BadgeContainer>
						</div>
						<div class="tw-text-left tw-bg-white tw-z-1 tw-relative tw-pl-2 tw-space-y-0.5">
							<div>
								<div
									v-if="(getBadgeStatus(index) !== BADGE_LOCKED)"
									class="tw-font-small tw-px-0"
								>
									<span>Achievement {{ levelCaption(index) }}</span>
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
									<span :class="{'tw-font-medium' : getBadgeStatus(index) == BADGE_IN_PROGRESS}">
										{{ progressCaption(index) }}
									</span>
								</div>
							</div>
							<div
								class="tw-inline-flex tw-items-center tw-rounded tw-space-x-1"
								v-if="getBadgeStatus(index) == BADGE_COMPLETED"
							>
								<choose-checkmark
									class="icon-width"
								/>
								<span class="tw-font-medium">
									{{ completedCaption(index) }}
								</span>
							</div>
						</div>
					</div>
					<div
						v-if="!(index === positions.length - 1)"
						class="tw-h-0.5"
					>
						<div
							class="tw-overflow-hidden"
							:class="{
								'tw-pl-3 md:tw-pl-4': isWomenBadge,
								'tw-pl-5 md:tw-pl-5': !isWomenBadge,
							}"
							:style="{ height: lineImageContainerHeight }"
							v-if="(index % 2 === 0)"
						>
							<RightLeaningLine :style="{ height: lineImageHeight }" />
						</div>
						<div
							v-else
							class="tw-overflow-hidden"
							:class="{
								'tw-pl-3 md:tw-pl-4': isWomenBadge,
								'tw-pl-4 md:tw-pl-5': !isWomenBadge,
							}"
							:style="{ height: lineImageContainerHeight }"
						>
							<LeftLeaningLine :style="{ height: lineImageHeight }" />
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
	defineAsyncComponent,
	onMounted,
	onUnmounted
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
import useBadgeData, { ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';
import BadgeContainer from './BadgeContainer';

const MAX_TIERED_BADGE_LOANS = 100;

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

const { getLevelCaption } = useBadgeData();

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);
const scrollEl = ref(null);
const toggleGradient = ref(false);

const badgeMarginTop = index => {
	if (index === 0) {
		return '0px';
	} if (isMobile.value) {
		return '25px';
	}
	return '50px';
};

const isWomenBadge = computed(() => props.badge.id === ID_WOMENS_EQUALITY);
const iconSize = computed(() => (isMobile.value ? '98px' : '108px'));
const lineImageHeight = computed(() => (isMobile.value ? '150px' : '170px'));
const lineImageContainerHeight = computed(() => (isMobile.value ? '50px' : '100px'));

const {
	getTierPositions,
} = useBadgeModal(props.badge);

const emit = defineEmits(['badge-level-clicked', 'toggle-gradient']);

const positions = ref(getTierPositions());

const showEarnBadge = index => {
	return (
		!props.badge.achievementData.tiers[index - 1]
		|| !!props.badge.achievementData.tiers[index - 1]?.completedDate
	) && !props.badge.achievementData.tiers[index].completedDate;
};

const getBadgeStatus = index => {
	const tier = props.badge.achievementData.tiers[index] ?? {};
	if (tier.completedDate) {
		return BADGE_COMPLETED;
	}
	if (showEarnBadge(index)) {
		return BADGE_IN_PROGRESS;
	}
	return BADGE_LOCKED;
};

const levelCaption = index => getLevelCaption(props.badge.achievementData.tiers[index]);

const progressCaption = index => {
	let floor;
	const tier = props.badge.achievementData.tiers[index];
	if ([BADGE_IN_PROGRESS].includes(getBadgeStatus(index))) {
		floor = props.badge.achievementData.totalProgressToAchievement;
	} else {
		floor = Math.min(props.badge.achievementData.totalProgressToAchievement, tier.target);
	}
	if ([BADGE_LOCKED].includes(getBadgeStatus(index))) {
		return `${tier.target} loans`;
	}
	return `
		Progress:
		${floor}/${tier.target}
		loans
	`;
};

const completedCaption = index => {
	const tier = props.badge.achievementData.tiers[index];
	return `Achieved on ${format(new Date(tier.completedDate), 'MMMM do, yyyy')}!`;
};

const handleBadgeClick = index => {
	if (getBadgeStatus(index) !== BADGE_LOCKED) {
		emit('badge-level-clicked', {
			id: props.badge.id,
			challengeName: props.badge.challengeName,
			tier: props.badge.achievementData.tiers[index]
		});
	}
};

const journeyLoans = computed(() => {
	return (props.badge.achievementData?.loanPurchases ?? [])
		?.map(purchase => purchase.loan).filter(loan => loan != null);
});
const journeyTotalLoans = computed(() => {
	const total = props.badge.achievementData?.totalProgressToAchievement ?? 0;
	return Math.min(total, MAX_TIERED_BADGE_LOANS);
});
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
		? `Your loan${journeyTotalLoans.value > 1 ? 's' : ''} to ${journeyLoansNames.value} ${journeyTotalLoans.value > 1 ? 'have' : 'has'} made progress toward these achievements. `
		: '';

	return `${journeyLoansCopy}${props.badge.description}`;
});

const RightLeaningLine = defineAsyncComponent(() => import('#src/assets/images/right-leaning-line.svg'));
const LeftLeaningLine = defineAsyncComponent(() => import('#src/assets/images/left-leaning-line.svg'));

const handleToggleGradient = e => {
	const atBottom = e.target.scrollTop + e.target.clientHeight + 1 >= e.target.scrollHeight;
	if (toggleGradient.value !== atBottom) {
		toggleGradient.value = atBottom;
		emit('toggle-gradient', toggleGradient.value);
	}
};

onMounted(() => {
	scrollEl.value = document.getElementById('sidesheet-content');

	if (scrollEl.value) {
		scrollEl.value.addEventListener('scroll', handleToggleGradient);
	}
});

onUnmounted(() => {
	if (scrollEl.value) {
		scrollEl.value.removeEventListener('scroll', handleToggleGradient);
	}
});
</script>

<style lang="postcss" scoped>
.icon-width {
	@apply tw-shrink-0;

	width: 22px;
}

.badge-mobile:not(:last-of-type) {
	@apply tw-mb-1.5;
}
</style>
