<template>
	<div>
		<span
			class="tw-text-link tw-cursor-pointer"
			@click="showModal = true"
		>
			${{ formattedAmount }}
		</span>

		<kv-lightbox
			:visible="showModal"
			@lightbox-closed="showModal = false"
			title="Payment history"
		>
			<div class="tw-text-left">
				<p v-if="!paymentHistory?.length">
					This loan has no repayments
				</p>
				<div v-else class="tw-grid tw-grid-cols-2">
					<div v-for="(payment, index) in paymentHistory" :key="index" class="tw-contents">
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

function formatAmount(value) {
	return numeral(value).format('$0,0.00');
}

function formatDate(iso) {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

function isCurrencyLoss(type) {
	return typeof type === 'string' && type.endsWith('_currency_loss');
}
</script>
