<template>
	<div>
		<button class="tw-text-h4 tw-text-link tw-mt-3"
			@click="openLightbox"
			v-if="this.status === 'fundraising'"
		>
			Detailed repayment schedule >
		</button>
		<kv-lightbox
			:visible="isLightboxVisible"
			title="Loan repayment schedule"
			@lightbox-closed="closeLightbox"
		>
			<!-- Field Partner loan fundraising -->
			<div v-if="isPartnerLoan">
				<p class="tw-inline-block tw-pb-3">
					Repayments {{ statusLanguageCheck }} in
				</p>
				<p class="tw-inline-block tw-font-medium ">
					{{ formattedFirstRepaymentDate }}
				</p>
				<span v-if="this.status === 'payingBack'">
					<p class="tw-inline-block">
						and are
					</p>
					<p class="tw-inline-block tw-font-medium">
						{{ repaymentStatusCheck }}.
					</p>
				</span>
				<table class="tw-table-auto">
					<tr class="tw-bg-secondary tw-text-left">
						<th></th>
						<th class="table-heading-spacing">
							Expected
						</th>
						<th class="table-heading-spacing">
							Status
						</th>
					</tr>
					<tr
						v-for="(repayment, index) in formatRepaymentSchedule"
						:key="index"
						class="tw-mb-1"
					>
						<td class="table-data-spacing">
							{{ repayment.repaymentDateFormatted }}
						</td>
						<td class="table-data-spacing">
							{{ repayment.repaymentAmountFormatted }}
						</td>
						<td class="table-data-spacing">
							Available {{ repayment.repaymentDateExpectedFormatted }}
						</td>
					</tr>
				</table>
			</div>

			<!-- Direct loan fundraising -->
			<div v-if="!isPartnerLoan" class="tw-prose">
				<p>
					This loan is for {{ loanAmountFormatted }}.
				</p>
				<p>
					<!-- eslint-disable-next-line max-len -->
					Repayments on this loan will be made in monthly installments of {{ calculateMonthlyPayment }} USD over a period of {{ lenderRepaymentTerm }} months. After the funds are disbursed, the borrower(s) will have the standard 1 month before the first payment is due, and may have an additional grace period per the terms outlined in their loan agreement. The detailed repayment schedule will be published here at the time that the funds for this loan are disbursed.<br>
				</p>
				<p>
					<!-- eslint-disable-next-line max-len -->
					Disbursement and repayments will be made via PayPal, a web-based payment system. Repayments made on delinquent loans will be applied toward the oldest payment due until the loan becomes current.
				</p>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import gql from 'graphql-tag';
// import { mdiCheckboxMarkedCircle, mdiMinusCircle } from '@mdi/js';
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
			loanAmount
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
			... on LoanPartner {
				partner {
					id
					name
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
		status: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			// mdiCheckboxMarkedCircle,
			// mdiMinusCircle,
			isLightboxVisible: false,
			firstRepaymentDate: '',
			repaymentSchedule: [],
			repaidAmount: 0,
			loanAmount: 0,
			lenderRepaymentTerm: 0,
			partnerName: '',
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
				this.partnerName = data?.lend?.loan?.partner?.name || '';
				this.repaymentSchedule = data?.lend?.loan?.terms?.expectedPayments || [];
				this.repaidAmount = data?.lend?.loan?.paidAmount || 0;
				this.loanAmount = data?.lend?.loan?.loanAmount || 0;
				this.lenderRepaymentTerm = data?.lend?.loan?.terms?.lenderRepaymentTerm || 0;
				if (this.isPartnerLoan) {
					this.firstRepaymentDate = this.repaymentSchedule[0].dueToKivaDate || '';
				}
			});
		},
	},
	computed: {
		isPartnerLoan() {
			return !!this.partnerName;
		},
		formattedFirstRepaymentDate() {
			if (this.firstRepaymentDate !== '') {
				return format(parseISO(this.firstRepaymentDate), 'MMM yyyy');
			}
			return false;
		},
		statusLanguageCheck() {
			if (this.status === 'fundraising') {
				return 'begin';
			}
			return 'began';
		},
		repaymentStatusCheck() {
			if (this.status === 'fundraising') {
				return 'on track';
			}
			// TODO: fill out other options for other loan statuses
			return 'on track';
		},
		formatRepaymentSchedule() {
			const formattedRepaymentSchedule = [];
			if (this.repaymentSchedule !== []) {
				this.repaymentSchedule.forEach(repayment => {
					formattedRepaymentSchedule.push({
						repaymentDateFormatted: format(parseISO(repayment.dueToKivaDate), 'MMM yyyy'),
						repaymentAmountFormatted: numeral(repayment.amount).format('$0,0.00'),
						// Dupe of above line
						repaymentDateExpectedFormatted: format(parseISO(repayment.dueToKivaDate), 'MMM yyyy'),
					});
				});
			}
			return formattedRepaymentSchedule;
		},
		loanAmountFormatted() {
			return numeral(this.loanAmount).format('$0,0.00');
		},
		calculateMonthlyPayment() {
			// Used for calculating the monthly payment of a direct loan
			return numeral(this.loanAmount / this.lenderRepaymentTerm).format('$0,0.00');
		}
	},
	mounted() {
		this.calculateRepaymentSchedule();
	},
};
</script>

<style lang="postcss" scoped>
.table-heading-spacing {
	@apply tw-py-2.5 tw-pl-1.5;
}

.table-data-spacing {
	@apply tw-p-1.5;
}
</style>
