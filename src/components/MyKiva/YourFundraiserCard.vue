<template>
	<div
		class="tw-flex tw-flex-col tw-gap-2 tw-h-full tw-p-1 tw-bg-white tw-rounded
			md:tw-flex-row md:tw-items-center md:tw-pr-2"
	>
		<div class="tw-flex tw-items-center tw-gap-2 md:tw-flex-1">
			<img
				v-if="avatarUrl"
				class="tw-w-8 tw-h-8 tw-shrink-0 tw-rounded-full tw-object-cover"
				:src="avatarUrl"
				alt=""
				width="64"
				height="64"
			>
			<div
				v-else
				class="tw-w-8 tw-h-8 tw-shrink-0 tw-rounded-full tw-bg-white tw-border-2
					tw-border-brand-100 tw-flex tw-items-center tw-justify-center tw-p-1"
			>
				<KivaLogo class="tw-w-full tw-text-brand tw-opacity-50" />
			</div>
			<div class="tw-flex tw-flex-col tw-items-start tw-gap-0.5">
				<p class="tw-text-title">
					{{ fundName }}
				</p>
				<a
					class="md:tw-hidden tw-text-label tw-text-link"
					:href="fundUrl"
					v-kv-track-event="viewTrackEvent"
				>
					View
				</a>
			</div>
		</div>
		<div class="tw-flex tw-gap-1">
			<template v-for="(stat, idx) in stats" :key="stat.label">
				<div v-if="idx" class="tw-shrink-0 tw-border-l tw-border-tertiary"></div>
				<div class="tw-flex tw-flex-col tw-flex-1 tw-gap-0.5 tw-px-0.5 tw-py-1 md:tw-flex-none">
					<span class="tw-text-button-link">{{ stat.value }}</span>
					<span class="tw-text-small tw-whitespace-nowrap">{{ stat.label }}</span>
				</div>
			</template>
		</div>
		<a
			class="tw-hidden md:tw-block tw-shrink-0 tw-text-label tw-text-link"
			:href="fundUrl"
			v-kv-track-event="viewTrackEvent"
		>
			View
		</a>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import numeral from 'numeral';
import KivaLogo from '#src/assets/inline-svgs/logos/kiva-logo.svg';
import { getGivingFundTitle } from '#src/util/givingFundUtils';
import { parseMoney } from '#src/util/numberUtils';

const props = defineProps({
	fund: {
		type: Object,
		required: true,
	},
});

const viewTrackEvent = ['giving-funds', 'click', 'mykiva-your-fundraiser-view'];

const avatarUrl = computed(() => props.fund?.display?.avatar?.url ?? null);

const fundName = computed(() => getGivingFundTitle(props.fund));

const fundUrl = computed(() => `/gf/${props.fund.id}`);

const stats = computed(() => [
	{
		label: 'Participants',
		value: numeral(props.fund?.totalParticipants ?? 0).format('0,0'),
	},
	{
		label: 'Dollars raised',
		value: numeral(parseMoney(props.fund?.currentAmountDonated)).format('$0,0.00'),
	},
	{
		label: 'Lives touched',
		value: numeral(props.fund?.lendingStats?.totalLivesTouched ?? 0).format('0,0'),
	},
]);
</script>
