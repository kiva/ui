<template>
	<div
		v-if="partners.length"
		class="tw-flex tw-items-center tw-justify-center tw-gap-0.5"
		data-testid="bp-loan-matching-info"
	>
		<p class="tw-text-small tw-text-secondary tw-text-center" data-testid="bp-loan-matching-text">
			<!-- eslint-disable-next-line max-len -->
			<span v-for="partner in partners" :key="partner.key">{{ partner.separator }}<span class="tw-font-medium">{{ partner.ratio + 1 }}x matching</span> by {{ partner.name }}</span>
			<template v-if="partners.length === 1">
				while funds last
			</template>
		</p>
		<button
			:id="tooltipId"
			type="button"
			class="tw-inline-flex tw-shrink-0 tw-text-secondary"
			aria-label="What is loan matching?"
		>
			<kv-material-icon
				class="tw-w-2 tw-h-2"
				:icon="mdiInformationOutline"
			/>
		</button>
		<kv-tooltip
			class="tw-text-base tw-text-left"
			:controller="tooltipId"
			:placement="tooltipPlacement"
			max-width="289px"
		>
			<template #title>
				What is loan matching?
			</template>
			Some loans on Kiva are matched by an individual or organization. When you lend to an eligible loan,
			the matcher contributes additional funds to the borrower, while matching funds last.
		</kv-tooltip>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { mdiInformationOutline } from '@mdi/js';
import { KvMaterialIcon, KvTooltip } from '@kiva/kv-components';
import { FUNDRAISING } from '#src/api/fixtures/LoanStatusEnum';
import { isMatchAtRisk } from '#src/util/loanUtils';
import useMultiMatching from '#src/composables/useMultiMatching';

defineOptions({ name: 'LoanMatchingInfo' });

const props = defineProps({
	loan: {
		type: Object,
		default: () => ({}),
	},
	// Must be unique on the page, since the tooltip finds its button by this id
	tooltipId: {
		type: String,
		required: true,
	},
	tooltipPlacement: {
		type: String,
		default: 'top',
	},
});

const { enableMultiMatching, multiMatchingResolved } = useMultiMatching();

const matchingPartners = computed(() => {
	const loan = props.loan ?? {};
	if (loan.status !== FUNDRAISING) {
		return [];
	}
	if (enableMultiMatching.value) {
		return (loan.simultaneousMatching ?? []).map(matcher => ({
			key: matcher.managedAccountId,
			name: matcher.displayName || 'a Kiva supporter',
			ratio: matcher.ratio ?? 0,
		}));
	}
	if (multiMatchingResolved.value && loan.matchingText && !isMatchAtRisk(loan)) {
		return [{ key: 'single', name: loan.matchingText, ratio: loan.matchRatio ?? 0 }];
	}
	return [];
});

const partners = computed(() => {
	const total = matchingPartners.value.length;
	return matchingPartners.value.map((partner, index) => {
		let separator = '';
		if (index > 0 && index < total - 1) {
			separator = ', ';
		} else if (index > 0) {
			separator = total > 2 ? ', and ' : ' and ';
		}
		return { ...partner, separator };
	});
});
</script>
