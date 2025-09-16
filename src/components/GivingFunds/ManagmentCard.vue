<template>
	<kv-card-frame>
		<div class="tw-p-2">
			<div class="tw-flex tw-justify-between">
				<div>
					<!--  eslint-disable max-len -->
					<kv-pill
						v-if="fund?.goals?.values?.filter(goal => goal?.status === 'IN_PROGRESS')?.length"
						bg-class="tw-bg-gray-100"
						rounded-class="tw-rounded-full"
					>
						<template #icon>
							<kv-pulsing-dot />
						</template>
						Active Fundraiser
					</kv-pill>
					<!-- eslint-enable max-len -->
					<h2 class="tw-mb-1">
						{{ fund?.campaign?.category?.name }}
					</h2>
					<!--  eslint-disable max-len -->
					<p v-if="fund?.campaign?.lendingStats?.totalLivesTouched">
						This fund has helped {{ fund?.campaign?.lendingStats?.totalLivesTouched }} people to date
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
						v-kv-track-event="['giving-funds', 'click', 'Donate']"
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
									v-kv-track-event="['giving-funds', 'click', 'View giving fund']"
								>
									View giving fund
								</a>
							</li>
							<li class="tw-border-b tw-border-gray-100">
								<a
									class="
										utility-menu-link
									"
									:href="`${givingFundRootPath}/${fund.id}?action=edit`"
									target="_blank"
									v-kv-track-event="['giving-funds', 'click', 'Edit fund']"
								>
									Edit fund
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
									v-kv-track-event="['giving-funds', 'click', 'Share fund']"
								>
									Share fund
								</a>
							</li>
						</ul>
					</kv-utility-menu>
				</div>
			</div>

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
				<div v-if="fund?.campaign?.lendingStats?.totalLent">
					<h2>
						{{ numeral(fund?.campaign?.lendingStats?.totalLent).format('$0,0') }}
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

			<KvButton
				class="tw-w-full tw-mt-3"
				:href="`${givingFundRootPath}/${fund.id}?action=start-fundraiser`"
				target="_blank"
				variant="secondary"
				v-kv-track-event="['giving-funds', 'click', 'Start a fundraiser', fund.id]"
			>
				+ Start a fundraiser and invite others to join
			</KvButton>
			<KvButton
				v-if="isMobile"
				class="tw-w-full tw-mt-2"
				:href="`${givingFundRootPath}/${fund.id}?action=donate`"
				target="_blank"
				variant="secondary"
				v-kv-track-event="['giving-funds', 'click', 'Donate']"
			>
				Donate
			</KvButton>
		</div>
	</kv-card-frame>
</template>

<script setup>
import {
	onMounted,
	ref,
	inject,
} from 'vue';
import {
	KvButton,
	KvCardFrame,
	KvPill,
	KvPulsingDot,
	KvUtilityMenu,
} from '@kiva/kv-components';
import useGivingFund from '#src/composables/useGivingFund';
import useIsMobile from '#src/composables/useIsMobile';
// import logFormatter from '#src/util/logFormatter';
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
} = useGivingFund(apollo);

const givingFundRootPath = ref('/gf-beta');

const myDonationTotals = ref(0);

onMounted(async () => {
	if (props?.fund?.id) {
		myDonationTotals.value = await getDonationTotalsForFund(props?.fund.id);
	}
});
</script>
