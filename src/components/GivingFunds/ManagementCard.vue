<template>
	<kv-card-frame>
		<div class="tw-p-2">
			<div class="tw-flex tw-justify-between">
				<div>
					<!--  eslint-disable max-len -->
					<kv-pill
						v-if="actionableGoal"
						bg-class="tw-bg-gray-100"
						rounded-class="tw-rounded-full"
					>
						<template #icon>
							<kv-pulsing-dot />
						</template>
						Active fundraising goal
					</kv-pill>
					<!-- eslint-enable max-len -->
					<h2 class="tw-mb-1">
						<a
							class="tw-no-underline tw-text-primary hover:tw-text-action"
							v-kv-track-event="['giving-funds', 'click', 'management-card-title']"
							:href="`${givingFundRootPath}/${fund.id}`"
							target="_blank"
						>
							{{ getFundTargetDisplayNounFromName(fund?.campaign?.category?.name) }}
						</a>
					</h2>
					<!--  eslint-disable max-len -->
					<p v-if="fund?.campaign?.lendingStats?.totalLivesTouched">
						You've helped support {{ fund?.campaign?.lendingStats?.totalLivesTouched }}
						{{ getFundTargetSupportedPeoplePhraseFromName(fund?.campaign?.category?.name) }}.
					</p>
					<!-- eslint-enable max-len -->
					<p v-else>
						{{ fund?.campaign?.category?.description }}
					</p>
				</div>

				<div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-right tw-gap-1.5">
					<KvButton
						v-if="!isMobile"
						:href="`${givingFundRootPath}/${fund.id}?action=donate`"
						target="_blank"
						variant="secondary"
						v-kv-track-event="['giving-funds', 'click', 'donate', fund.id]"
					>
						Donate
					</KvButton>
					<kv-utility-menu
						analytics-category="giving-funds"
						menu-position="right-aligned"
						button-radius-class="tw-rounded"
						button-size="medium"
						button-border-class="tw-border tw-border-primary"
					>
						<ul>
							<li class="tw-border-b tw-border-gray-100">
								<a
									class="
										utility-menu-link
										tw-rounded-t
									"
									:href="`${givingFundRootPath}/${fund.id}`"
									target="_blank"
									v-kv-track-event="['giving-funds', 'click', 'menu', 'view-giving-fund']"
								>
									<kv-material-icon :icon="mdiPartyPopper" />
									<span style="padding-top: 0.15rem;">View giving fund</span>
								</a>
							</li>
							<li class="tw-border-b tw-border-gray-100">
								<a
									class="
										utility-menu-link
									"
									:href="`${givingFundRootPath}/${fund.id}?action=edit`"
									target="_blank"
									v-kv-track-event="['giving-funds', 'click', 'menu', 'edit-fund']"
								>
									<kv-material-icon :icon="mdiSquareEditOutline" />
									<span style="padding-top: 0.15rem;">Edit fund</span>
								</a>
							</li>
							<li class="tw-border-b tw-border-gray-100">
								<a
									class="
										utility-menu-link
										tw-rounded-b
									"
									:href="`${givingFundRootPath}/${fund.id}?action=share`"
									target="_blank"
									v-kv-track-event="['giving-funds', 'click', 'menu', 'share-fund']"
								>
									<kv-material-icon :icon="mdiExportVariant" />
									<span style="padding-top: 0.15rem;">Share fund</span>
								</a>
							</li>
						</ul>
					</kv-utility-menu>
				</div>
			</div>

			<div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between">
				<div
					v-if="fund?.currentAmountDonated > 0"
					class="tw-flex tw-gap-3 tw-mt-3 tw-flex-wrap"
				>
					<div>
						<h2>{{ numeral(myDonationTotals).format('$0,0') }}</h2>
						<p class="tw-text-small tw-text-gray-500">
							Your donations
						</p>
					</div>
					<div v-if="fund?.currentAmountDonated">
						<h2>{{ numeral(fund?.currentAmountDonated).format('$0,0') }}</h2>
						<p class="tw-text-small tw-text-gray-500">
							Total donations
						</p>
					</div>
					<div v-if="fund?.realTimeStats?.totalAmountLent">
						<h2>
							{{ numeral(fund?.realTimeStats?.totalAmountLent).format('$0,0') }}
						</h2>
						<p class="tw-text-small tw-text-gray-500">
							Total fund impact
						</p>
					</div>
					<div v-if="fund?.totalParticipants">
						<h2>{{ fund?.totalParticipants }}</h2>
						<p class="tw-text-small tw-text-gray-500">
							Participants
						</p>
					</div>
				</div>

				<div
					v-if="actionableGoal"
					class="tw-mt-3 md:tw-mt-0 md:tw-ml-4 md:tw-self-end min-meter-width"
				>
					<kv-progress-bar
						class="tw-mt-1"
						aria-label="Percent the fundraiser has raised towards their goal"
						:value="progressPercentage"
					/>
					<div class="tw-flex tw-justify-between tw-mt-1">
						<div class="tw-text-small">
							<!-- eslint-disable-next-line max-len -->
							<strong>{{ numeral(currentGoalTargetInfo?.participation?.amount || 0).format('$0,0') }}</strong> raised
						</div>
						<div class="tw-text-small">
							<!-- eslint-disable-next-line max-len -->
							<strong>{{ daysRemaining }}</strong> remaining
						</div>
					</div>
				</div>
			</div>

			<KvButton
				v-if="!actionableGoal"
				class="tw-w-full tw-mt-3"
				:href="`${givingFundRootPath}/${fund.id}?action=start-fundraiser`"
				target="_blank"
				variant="secondary"
				v-kv-track-event="['giving-funds', 'click', 'start-a-new-fundraiser', fund.id]"
			>
				+ Add a fundraising goal and invite others
			</KvButton>
			<KvButton
				v-if="isMobile"
				class="tw-w-full tw-mt-2"
				:href="`${givingFundRootPath}/${fund.id}?action=donate`"
				target="_blank"
				variant="secondary"
				v-kv-track-event="['giving-funds', 'click', 'donate', fund.id]"
			>
				Donate
			</KvButton>
		</div>
	</kv-card-frame>
</template>

<script setup>
import {
	mdiExportVariant,
	mdiPartyPopper,
	mdiSquareEditOutline,
} from '@mdi/js';
import {
	computed,
	onMounted,
	ref,
	inject,
} from 'vue';
import {
	KvButton,
	KvCardFrame,
	KvMaterialIcon,
	KvPill,
	KvProgressBar,
	KvPulsingDot,
	KvUtilityMenu,
} from '@kiva/kv-components';
import useGivingFund from '#src/composables/useGivingFund';
import useIsMobile from '#src/composables/useIsMobile';
import numeral from 'numeral';

const props = defineProps({
	fund: {
		type: Object,
		required: true,
	},
});

const apollo = inject('apollo');
const { isMobile } = useIsMobile();

const {
	getDonationTotalsForFund,
	getFundTargetDisplayNounFromName,
	getFundTargetSupportedPeoplePhraseFromName,
} = useGivingFund(apollo);

const givingFundRootPath = ref('/gf');

const myDonationTotals = ref(0);

// Find the first "active" and within range goal
const actionableGoal = computed(() => {
	// Establish allowed statuses for fundraiser elements to show
	// - "NONE" (No donations yet), "IN_PROGRESS" (1 more donations)
	const allowedStatuses = ['NONE', 'IN_PROGRESS'];
	// Check if any goals have an allowed status
	const goalsWithAllowedStatuses = props?.fund?.goals?.values?.filter(goal => {
		const activeByStatus = allowedStatuses.includes(goal?.status);
		const activeByDate = new Date(goal?.startDate) <= new Date() && new Date(goal?.endDate) >= new Date();
		return activeByStatus && activeByDate;
	});
	// Check if we are within the date range for the goal
	return goalsWithAllowedStatuses?.[0] || null;
});

const currentGoalTargetInfo = computed(() => {
	return actionableGoal.value?.targets?.values?.[0] || null;
});

const progressPercentage = computed(() => {
	const target = currentGoalTargetInfo.value?.targetAmount ?? 0;
	const participationAmount = currentGoalTargetInfo.value?.participation?.amount || 0;
	const percentage = (participationAmount / target) * 100;
	return percentage > 100 ? 100 : Math.round(percentage);
});

const daysRemaining = computed(() => {
	if (!actionableGoal.value?.endDate) return '0 days';
	const endDate = new Date(actionableGoal.value.endDate);
	const today = new Date();
	const timeDiff = endDate - today;
	const daysCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
	if (daysCount < 0) return '0 days';
	if (daysCount === 0) return '1 day';
	return `${daysCount} days`;
});

onMounted(async () => {
	if (props?.fund?.id) {
		myDonationTotals.value = await getDonationTotalsForFund(props?.fund.id);
	}
});
</script>

<style lang="postcss" scoped>
.utility-menu-link {
  @apply tw-flex tw-items-center tw-gap-1 tw-cursor-pointer;
  @apply tw-py-1 tw-px-1.5 hover:tw-bg-secondary tw-text-primary hover:tw-text-action-highlight tw-font-medium;
  @apply tw-no-underline active:tw-no-underline;
  @apply visited:tw-no-underline hover:tw-no-underline focus:tw-no-underline;
}

.min-meter-width {
	@media (width >= 734px) {
		min-width: 300px;
		max-width: 350px;
	}
}
</style>
