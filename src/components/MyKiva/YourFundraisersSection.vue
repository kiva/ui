<template>
	<div>
		<div class="tw-flex tw-flex-col-reverse tw-items-start tw-gap-1 tw-mb-2 md:tw-flex-row md:tw-items-center">
			<h2 class="!tw-text-title">
				Your fundraisers
			</h2>
			<KvPill
				bg-class="tw-bg-brand tw-text-primary-inverse"
				rounded-class="tw-rounded"
			>
				<template #icon>
					<KvMaterialIcon class="tw-h-2 tw-w-2" :icon="mdiBullhornOutline" />
				</template>
				New!
			</KvPill>
		</div>
		<div class="tw-flex tw-flex-col tw-gap-2 lg:tw-flex-row lg:tw-gap-4">
			<div
				class="tw-flex tw-flex-col tw-gap-2 tw-py-1 tw-pl-1 tw-pr-2 tw-bg-white tw-rounded
					md:tw-flex-row md:tw-items-center lg:tw-flex-[2]"
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
				<kv-text-link
					class="tw-self-end md:tw-self-center"
					:href="`/gf/${fundId}`"
					v-kv-track-event="['giving-funds', 'click', 'mykiva-your-fundraiser-view']"
				>
					View
				</kv-text-link>
			</div>
			<FundraiserOccasionCard
				class="lg:tw-flex-1"
				compact
				id="start-another"
				title="Have another event you'd like to fundraise for?"
				link-label="Start another fund here"
				:to="FUNDRAISER_LANDING_PAGE"
				:image="communityImage.image"
				:image-alt="communityImage.imageAlt"
			/>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import numeral from 'numeral';
import { KvMaterialIcon, KvPill, KvTextLink } from '@kiva/kv-components';
import { mdiBullhornOutline } from '@mdi/js';
import KivaLogo from '#src/assets/inline-svgs/logos/kiva-logo.svg';
import FundraiserOccasionCard from '#src/components/MyKiva/FundraiserOccasionCard';
import { communityImage, FUNDRAISER_LANDING_PAGE } from '#src/util/fundraiserOccasions';
import { parseMoney } from '#src/util/numberUtils';
import { formatPossessiveName } from '#src/util/stringParserUtils';

const props = defineProps({
	fund: {
		type: Object,
		required: true,
	},
});

const fundId = computed(() => props.fund?.id);

const avatarUrl = computed(() => props.fund?.display?.avatar?.url ?? null);

const fundName = computed(() => {
	const { ctaTitle } = props.fund?.display ?? {};
	if (ctaTitle) return ctaTitle;

	const owner = formatPossessiveName(props.fund?.owner?.name);
	return owner ? `${owner} fundraiser` : 'Your fundraiser';
});

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
