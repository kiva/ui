<template>
	<div>
		<a
			class="tw-text-link tw-cursor-pointer"
			role="button"
			@click="showModal = true"
			@keydown.enter="showModal = true"
		>
			${{ formattedAmount }}
		</a>

		<kv-lightbox
			:visible="showModal"
			@lightbox-closed="showModal = false"
			title="Payment history"
		>
			<template #header>
				<h2 class="tw-text-headline tw-flex-1 tw-text-left">
					Payment history
				</h2>
			</template>
			<div class="tw-text-left">
				<p v-if="!paymentHistory?.length">
					This loan has no repayments
				</p>
				<div v-else class="tw-grid tw-grid-cols-2 tw-gap-x-6 tw-gap-y-1">
					<div v-for="(payment, index) in sortedHistory" :key="index" class="tw-contents">
						<span>{{ formatDate(payment.createTime) }}:</span>
						<span>
							{{ formatAmount(payment.amount) }}
							{{ isCurrencyLoss(payment.type) ? 'currency loss' : 'repaid' }}
						</span>
					</div>
				</div>
			</div>
		</kv-lightbox>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import numeral from 'numeral';
import { KvLightbox } from '@kiva/kv-components';

const props = defineProps({
	amount: {
		type: String,
		required: true
	},
	paymentHistory: {
		type: Array,
		default: () => []
	}
});

const showModal = ref(false);

const formattedAmount = computed(() => numeral(props.amount).format('0,0.00'));

function isCurrencyLoss(type) {
	return typeof type === 'string' && type.endsWith('_currency_loss');
}

const sortedHistory = computed(() => {
	// Show oldest-first, and when a currency-loss row shares the exact same timestamp as its
	// repayment, sort the loss row *after* the repayment (legacy added +0.5 to the loss row's
	// sort key). The backend already returns oldest-first, so this only re-breaks same-timestamp
	// ties; Array.sort is stable, preserving order otherwise.
	return [...props.paymentHistory].sort((a, b) => {
		const timeA = new Date(a.createTime).getTime();
		const timeB = new Date(b.createTime).getTime();
		if (timeA !== timeB) {
			return timeA - timeB;
		}
		return (isCurrencyLoss(a.type) ? 1 : 0) - (isCurrencyLoss(b.type) ? 1 : 0);
	});
});

function formatAmount(value) {
	return numeral(value).format('$0,0.00');
}

function formatDate(iso) {
	if (!iso) return '';
	// Intentionally formats in the lender's browser timezone (no `timeZone` option). The field
	// is a full ISO-8601 instant and the modal renders client-side, so the displayed day is the
	// lender's local day.
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}
</script>
