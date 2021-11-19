<template>
	<div>
		<button class="tw-text-h4 tw-text-link tw-mt-3"
			@click="openLightbox"
		>
			Detailed repayment schedule >
		</button>
		<kv-lightbox
			:visible="isLightboxVisible"
			title="Loan repayment schedule"
			@lightbox-closed="closeLightbox"
		>
			<span>Repayments began on {{ firstRepaymentDate }} and are {{ repaymentStatus }}.</span>
			<table>
				<tr>
					<th></th>
					<th>Expected</th>
					<th>Status</th>
				</tr>
				<tr>
					<!-- v-for goes on the <td> below -->
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</table>
			{{ repaymentSchedule }}
			<!-- <div v-html="lightboxContent" class="tw-prose"></div> -->
		</kv-lightbox>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import { mdiCheckCircle, mdiMinusCircle } from '@mdi/js';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const repaymentScheduleQuery = gql`query repaymentScheduleQuery($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
			repaymentInterval
			lenderRepaymentTerm
			paidAmount
			terms {
				currency
				currencyFullName
				lossLiabilityNonpayment
				lossLiabilityCurrencyExchange
				loanAmount
				disbursalDate
				disbursalAmount
				flexibleFundraisingEnabled
				lenderRepaymentTerm
				expectedPayments {
					amount
					localAmount
					dueToKivaDate
					effectiveDate
				}
			}
		}
	}
}`;

export default {
	components: {
		KvLightbox,
	},
	inject: ['apollo'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			mdiCheckCircle,
			mdiMinusCircle,
			isLightboxVisible: false,
			firstRepaymentDate: {},
			repaymentStatus: '',
			repaymentSchedule: {},
		};
	},
	methods: {
		openLightbox() {
			this.isLightboxVisible = true;
		},
		closeLightbox() {
			this.isLightboxVisible = false;
		},
		calculateRepaymentSchedule() {
			this.apollo.query({
				query: repaymentScheduleQuery,
				variables: {
					loanId: this.loanId
				}
			}).then(({ data }) => {
				console.log('data', data);
				this.repaymentSchedule = data || {};
				// this.firstRepaymentDate = data.lend.loan.terms.expectedRepayments || {};
				// this.firstRepaymentDate = data?.lend?.loan?.terms?.expectedRepayments?.dueToKivaDate || '';
			});
		},
	},
	mounted() {
		this.calculateRepaymentSchedule();
	},
};
</script>
