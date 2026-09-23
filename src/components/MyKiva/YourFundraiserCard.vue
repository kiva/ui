<template>
	<div
		class="tw-flex tw-flex-col tw-gap-2 tw-py-2 tw-pl-1 tw-pr-2 tw-bg-white tw-rounded
			md:tw-flex-row md:tw-items-center"
	>
		<div class="tw-flex tw-items-center tw-gap-1 md:tw-flex-1">
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
			<p class="tw-text-title">
				{{ fundName }}
			</p>
		</div>
		<div class="tw-flex tw-flex-wrap tw-gap-1">
			<div
				v-for="stat in stats"
				:key="stat.label"
				class="tw-flex tw-flex-col tw-gap-0.5 tw-p-1 tw-bg-secondary tw-rounded-sm"
			>
				<span class="tw-text-button-link">{{ stat.value }}</span>
				<span class="tw-text-caption">{{ stat.label }}</span>
			</div>
		</div>
		<a
			class="tw-self-end md:tw-self-center tw-shrink-0 tw-text-button-link tw-text-action
				tw-no-underline hover:tw-underline"
			:href="`/gf/${fund.id}`"
			v-kv-track-event="['giving-funds', 'click', 'mykiva-your-fundraiser-view']"
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

const avatarUrl = computed(() => props.fund?.display?.avatar?.url ?? null);

const fundName = computed(() => getGivingFundTitle(props.fund));

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
