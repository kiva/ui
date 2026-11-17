<template>
	<section
		v-if="loans?.length"
		class="tw-mt-3 md:tw-mt-4"
		data-testid="borrower-message-suggested-loans"
	>
		<div class="tw-flex tw-items-start tw-justify-between tw-gap-2 tw-mb-2 md:tw-mb-3">
			<div class="tw-flex tw-flex-col tw-gap-1">
				<h2 class="tw-text-headline-two">
					{{ heading }}
				</h2>
				<p class="tw-text-gray-600">
					{{ subhead }}
				</p>
			</div>
			<div class="tw-hidden md:tw-block tw-shrink-0">
				<kv-text-link :href="link.href" :icon="mdiChevronRight" v-kv-track-event="link.trackEvent">
					{{ link.text }}
				</kv-text-link>
			</div>
		</div>
		<div class="suggested-loans__classic-row tw-hidden md:tw-grid tw-gap-4">
			<kv-classic-loan-card-container
				v-for="suggestedLoan in loans"
				:key="suggestedLoan.id"
				:loan-id="suggestedLoan.id"
				:show-tags="true"
				:use-full-width="true"
			/>
		</div>
		<div class="tw-flex tw-flex-col tw-gap-2 md:tw-hidden">
			<kv-compact-loan-card
				v-for="suggestedLoan in loans"
				:key="suggestedLoan.id"
				:loan="suggestedLoan"
				:loan-id="suggestedLoan.id"
				show-light-view
				custom-loan-details
				external-links
				:custom-href="`/lend/${suggestedLoan.id}`"
				:photo-path="appConfig.photoPath"
				:kv-track-function="kvTrackEvent"
				@show-loan-details="router.push(`/lend/${suggestedLoan.id}`)"
			/>
		</div>
		<div class="tw-mt-2 md:tw-hidden">
			<kv-text-link :href="link.href" :icon="mdiChevronRight" v-kv-track-event="link.trackEvent">
				{{ link.text }}
			</kv-text-link>
		</div>
	</section>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { mdiChevronRight } from '@mdi/js';
import { KvCompactLoanCard, KvTextLink } from '@kiva/kv-components';
import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import useBorrowerMessageSuggestedLoans from '#src/composables/useBorrowerMessageSuggestedLoans';
import { getPossessiveLoanName } from '#src/util/borrowerMessage';

defineOptions({ name: 'BorrowerMessageSuggestedLoans' });

const props = defineProps({
	loan: {
		type: Object,
		required: true,
	},
});

const appConfig = inject('$appConfig', {});
const kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const { loans, isFallback } = useBorrowerMessageSuggestedLoans([props.loan.partner.id]);

const possessiveBorrowerName = computed(() => getPossessiveLoanName(props.loan.name));

const partner = computed(() => props.loan.partner);

const country = computed(() => props.loan.geocode?.country?.name);

const heading = computed(() => (isFallback.value
	? 'Loans you might like'
	: `More loans from ${possessiveBorrowerName.value} community`));

const subhead = computed(() => {
	if (isFallback.value) {
		return 'Entrepreneurs raising funds on Kiva right now.';
	}
	const where = country.value ? ` in ${country.value}` : '';
	return `${partner.value.name}, the lending partner behind ${possessiveBorrowerName.value} loan, `
		+ `is raising funds for these entrepreneurs${where} right now.`;
});

const link = computed(() => (isFallback.value
	? {
		text: 'View more loans',
		href: '/lend-by-category',
		trackEvent: ['portfolio', 'click', 'Borrower message view more loans'],
	}
	: {
		text: `View all ${partner.value.name} loans`,
		href: `/lend/filter?partner=${partner.value.id}`,
		trackEvent: ['portfolio', 'click', 'Borrower message view partner loans', partner.value.id],
	}));
</script>

<style lang="postcss" scoped>
.suggested-loans__classic-row {
	@screen md {
		grid-template-columns: repeat(3, minmax(17rem, 1fr));
		overflow-x: auto;
	}
}
</style>
