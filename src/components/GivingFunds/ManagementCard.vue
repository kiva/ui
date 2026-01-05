<template>
	<kv-card-frame class="tw-overflow-hidden tw-border tw-border-gray-200">
		<div class="tw-p-2">
			<div class="tw-flex tw-justify-between tw-mb-3">
				<div class="tw-flex tw-items-center tw-gap-1">
					<!-- eslint-disable-next-line vue/html-self-closing -->
					<img
						v-if="categoryIconUrl"
						:src="categoryIconUrl"
						:alt="`Icon for ${fund?.campaign?.category?.name} giving fund category`"
						class="tw-w-6 tw-h-6 tw-mr-2 tw-inline-block"
					/>
					<div>
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
						<span v-if="!hideOwnerOperations">You started this fund in {{ formattedCreatedDate }}.</span>
					</div>
				</div>

				<div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-right tw-gap-1.5">
					<a
						class="
							tw-rounded-full tw-flex tw-justify-center tw-items-center tw-border-tertiary
							tw-border tw-border-solid tw-bg-white
							tw-w-5 tw-h-5 md:tw-w-5 md:tw-h-5
							tw-shrink-0 tw-cursor-pointer
							hover:tw-text-action hover:tw-border-action
						"
						:href="`${givingFundRootPath}/${fund.id}?action=share`"
						target="_blank"
						v-kv-track-event="['giving-funds', 'click', 'share-fund', fund.id]"
					>
						<KvMaterialIcon
							:icon="mdiExportVariant"
							class="tw-w-3 tw-h-3"
						/>
					</a>
				</div>
			</div>

			<p
				v-if="fund?.currentAmountDonated === 0"
				class="tw-text-center"
			>
				<a
					:href="`${givingFundRootPath}/${fund.id}?action=donate`"
					target="_blank"
					v-kv-track-event="['giving-funds', 'click', 'donate', fund.id]"
				>
					Make a first contribution to kickstart your impact.
				</a>
			</p>

			<div
				class="
					tw-flex tw-flex-col-reverse md:tw-flex-row
					tw-justify-between
				"
			>
				<div
					v-if="fund?.currentAmountDonated > 0"
					class="tw-flex tw-gap-3 tw-flex-wrap"
				>
					<div>
						<h2>{{ numeral(myDonationTotals).format('$0,0') }}</h2>
						<p class="tw-text-small tw-text-gray-500">
							Your donations
							<a
								v-if="showParticipantDataControls"
								:href="`${givingFundRootPath}/${fund.id}?action=my-donations`"
								v-kv-track-event="['giving-funds', 'click', 'my-donations', fund.id]"
							>View</a>
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
							<a
								v-if="showParticipantDataControls && !hideOwnerOperations"
								:href="`${givingFundRootPath}/${fund.id}?action=participants`"
								v-kv-track-event="['giving-funds', 'click', 'participants', fund.id]"
							>View</a>
						</p>
					</div>
				</div>

				<!-- eslint-disable-next-line vue/html-self-closing -->
				<hr
					v-if="actionableGoal"
					class="tw-my-3 md:tw-my-0 tw-border-gray-300"
				/>

				<div
					v-if="actionableGoal"
					class="
						min-meter-width
						md:tw-ml-4
						md:tw-self-end
						tw-bg-secondary tw-p-2 tw-rounded-md
					"
				>
					<div class="tw-flex tw-justify-between">
						<div
							v-if="actionableGoal"
							class="tw-flex tw-items-center tw-gap-1 tw-mb-0.5 tw-text-small tw-font-medium"
						>
							<kv-pulsing-dot />
							<span class="tw-inline-flex" style="margin-top: 0.125rem;">Active fundraiser</span>
						</div>

						<div class="tw-inline-block tw-text-small" style="margin-top: 0.125rem;">
							Ends {{ goalEndDate }}
						</div>
					</div>
					<kv-progress-bar
						class="progess-bar-override tw-mt-1"
						aria-label="Percent the fundraiser has raised towards their goal"
						:value="progressPercentage"
					/>
					<div class="tw-flex tw-justify-between tw-mt-1">
						<div class="">
							<!-- eslint-disable-next-line max-len -->
							<strong class="tw-text-brand">{{ numeral(currentGoalTargetInfo?.participation?.amount || 0).format('$0,0') }}</strong> raised
						</div>
						<div class="tw-text-secondary">
							{{ numeral(currentGoalTargetInfo?.targetAmount || 0).format('$0,0') }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="tw-flex tw-flex-col-reverse md:tw-flex-row tw-p-2 tw-gap-2 tw-justify-end tw-bg-gray-100">
			<div class="tw-flex tw-gap-2">
				<KvButton
					v-if="!actionableGoal && !hideOwnerOperations"
					class="tw-grow md:tw-grow-0"
					:href="`${givingFundRootPath}/${fund.id}?action=start-fundraiser`"
					target="_blank"
					variant="ghost"
					v-kv-track-event="['giving-funds', 'click', 'start-a-new-fundraiser', fund.id]"
				>
					Add fundraiser
				</KvButton>
				<KvButton
					class="tw-grow md:tw-grow-0"
					:href="`${givingFundRootPath}/${fund.id}?action=donate`"
					target="_blank"
					variant="ghost"
					v-kv-track-event="['giving-funds', 'click', 'donate', fund.id]"
				>
					Donate
				</KvButton>
			</div>
			<KvButton
				class="tw-w-full md:tw-w-auto"
				:href="`${givingFundRootPath}/${fund.id}`"
				target="_blank"
				variant="primary"
				v-kv-track-event="['giving-funds', 'click', 'view-giving-fund', fund.id]"
			>
				View fund
			</KvButton>
		</div>
	</kv-card-frame>
</template>

<script setup>
import {
	mdiExportVariant,
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
	KvProgressBar,
	KvPulsingDot,
} from '@kiva/kv-components';
import { format, parseISO } from 'date-fns';
import useGivingFund from '#src/composables/useGivingFund';
import numeral from 'numeral';

const props = defineProps({
	fund: {
		type: Object,
		required: true,
	},
	showParticipantDataControls: {
		type: Boolean,
		default: false,
	},
	hideOwnerOperations: {
		type: Boolean,
		default: false,
	},
});

const apollo = inject('apollo');

const {
	getDonationTotalsForFund,
	getFundTargetDisplayNounFromName,
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

const goalEndDate = computed(() => {
	if (!actionableGoal.value?.endDate) return '';
	return format(new Date(actionableGoal.value.endDate), 'MM/yy');
});

const categoryIconUrl = computed(() => {
	try {
		const contentBlocks = props?.fund?.campaign?.category?.contentfulEntry?.entry?.fields?.content;
		if (!contentBlocks || !Array.isArray(contentBlocks)) return null;

		// Find the content block with key ending in "-giving-fund-category-icon-image"
		// eslint-disable-next-line max-len
		const iconContentBlock = contentBlocks.find(block => block?.fields?.key?.endsWith('-giving-fund-category-icon-image'));

		if (!iconContentBlock) return null;

		// Get the URL from the first contentLight item
		const iconUrl = iconContentBlock?.fields?.contentLight?.[0]?.fields?.file?.url;

		return iconUrl || null;
	} catch (error) {
		console.warn('Error accessing category icon URL:', error);
		return null;
	}
});

const formattedCreatedDate = computed(() => {
	if (!props?.fund?.createdDate) return '';
	return format(parseISO(props.fund.createdDate), 'MMMM yyyy');
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
		min-width: 350px;
		max-width: 400px;
	}
}

.progess-bar-override {
	@apply tw-bg-gray-300;
}
</style>
