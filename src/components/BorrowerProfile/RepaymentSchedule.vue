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
			<span>Repayments began on {{ formattedFirstRepaymentDate }} and are {{ repaymentStatus }}.</span>
			<table>
				<tr>
					<th></th>
					<th>Expected</th>
					<th>Status</th>
				</tr>
				<tr
					v-for="(repayment, index) in formatRepaymentSchedule"
					:key="index"
				>
					<!-- v-for goes on the <td> below -->
					<td>
						{{ repayment.repaymentDateFormatted }}
					</td>
					<td>{{ repayment.repaymentAmountFormatted }}</td>
					<td>Available: {{ repayment.repaymentDateExpectedFormatted }}</td>
				</tr>
			</table>
		</kv-lightbox>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import { mdiCheckCircle, mdiMinusCircle } from '@mdi/js';
import { format, parseISO } from 'date-fns';
import numeral from 'numeral';
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
			firstRepaymentDate: '',
			repaymentStatus: '',
			repaymentSchedule: [],
			repaidAmount: 0
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
				this.repaymentSchedule = data?.lend?.loan?.terms?.expectedPayments || [];
				console.log('this.repaymentSchedule', this.repaymentSchedule);
				this.firstRepaymentDate = this.repaymentSchedule[0].dueToKivaDate || '';
				this.repaidAmount = data?.lend?.loan?.paidAmount || 0;
				console.log('repaidAmount', this.repaidAmount);
			});
		},
	},
	computed: {
		formattedFirstRepaymentDate() {
			if (this.firstRepaymentDate !== '') {
				return format(parseISO(this.firstRepaymentDate), 'MMMM dd, yyyy');
			}
			return false;
		},
		formatRepaymentSchedule() {
			const formattedRepaymentSchedule = [];
			if (this.repaymentSchedule !== '') {
			// for each object in repaymentSchedule
				this.repaymentSchedule.forEach((repayment, index) => {
					console.log('index', index);
					formattedRepaymentSchedule.push({
						repaymentDateFormatted: format(parseISO(repayment.dueToKivaDate), 'MMMM dd, yyyy'),
						repaymentAmountFormatted: numeral(repayment.amount).format('$0,0.00'),
						repaymentDateExpectedFormatted: format(parseISO(repayment.effectiveDate), 'MMMM dd, yyyy'),
						repaymentStatus: '',
						// if repaymentRecievied amount  for this month and any previous
						// is greater than this.repaidAmount(paidAmount)
					});
					// console.log('repaymentGroup', repaymentGroup);
					// format each expected data

					// format each amount
				});
			}
			return formattedRepaymentSchedule;
		}
	},
	mounted() {
		this.calculateRepaymentSchedule();
	},
};
</script>
