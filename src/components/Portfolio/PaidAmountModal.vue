<template>
	<div>
		<span
			class="tw-text-link tw-cursor-pointer"
			@click="showModal = true"
		>
			${{ formattedAmount }} repaid to you
		</span>

		<kv-lightbox
			:visible="showModal"
			@lightbox-closed="showModal = false"
			title="Payment history"
		>
			<div class="tw-px-4">
				<div class="tw-grid tw-grid-cols-2">
					<div v-for="(payment, index) in paymentHistory" :key="index" class="tw-contents">
						<span>{{ payment.date }}:</span>
						<span class="tw-relative">
							<span v-if="payment.type === 'loss'" class="tw-absolute tw-right-full">-</span>
							${{ payment.amount }}
							{{ payment.type === 'loss' ? 'currency loss' : 'repaid' }}
						</span>
					</div>
				</div>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import numeral from 'numeral';
import { KvLightbox } from '@kiva/kv-components';

export default {
	name: 'PaidAmountModal',
	components: {
		KvLightbox
	},
	props: {
		amount: {
			type: [Number, String],
			required: true
		},
		paymentHistory: {
			type: Array,
			default: () => ([
				// Fake hardcoded example data to use while API endpoints are still being worked on
				{ date: 'Dec 18, 2024', amount: '2.37', type: 'repaid' },
				{ date: 'Jan 28, 2025', amount: '0.89', type: 'repaid' },
				{ date: 'Jan 28, 2025', amount: '0.01', type: 'loss' }
			])
		}
	},
	data() {
		return {
			showModal: false
		};
	},
	computed: {
		formattedAmount() {
			return numeral(this.amount).format('0,0.00');
		}
	}
};
</script>
