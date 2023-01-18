<template>
	<div>
		<button
			class="tw-text-h4 tw-text-link tw-mt-3"
			data-testid="bp-loan-detail-full-repayment-schedule-lightbox-btn"
			@click="openLightbox"
			v-kv-track-event="['Borrower Profile', 'click-repayment schedule', 'Detailed repayment schedule']"
		>
			Detailed repayment schedule >
		</button>
		<kv-lightbox
			:visible="isLightboxVisible"
			title="Loan repayment schedule"
			@lightbox-closed="closeLightbox"
		>
			<div v-if="isPartnerLoan || !isPartnerLoan && loanDisbursed">
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

				<!-- Table for small screens -->
				<table class="md:tw-hidden tw-w-full">
					<tr
						v-for="(repayment, index) in parsedRepaymentSchedule"
						:key="index"
						class="tw-mb-1"
					>
						<td
							class="
							tw-inline-block tw-w-full tw-bg-secondary tw-rounded tw-text-center
							tw-mb-2 tw-pb-1.5"
						>
							<p class="tw-text-h4 tw-py-1.5">
								{{ repayment.formattedRepaymentDate }}
							</p>
							<hr class="tw-mb-1.5 tw-mx-1.5">
							<p class="tw-mb-1.5">
								Expected: {{ repayment.formattedMonthlyPayment }}
							</p>
							<p v-if="!repayment.repaid && !repayment.delinquent">
								Available {{ repayment.formattedRepaymentDate }}
							</p>
							<!-- if payment is received -->
							<p
								class="tw-bg-primary tw-mx-auto tw-py-1 tw-rounded"
								style="width: 11.5rem;"
								v-if="repayment.repaid && !repayment.delinquent"
							>
								<kv-material-icon
									:icon="mdiCheckboxMarkedCircle"
									class="tw-w-3 tw-h-3 tw-text-brand-700 tw-align-middle"
								/>
								Repayment received
							</p>
							<!-- if payment is not received on time -->
							<p
								class="tw-bg-primary tw-mx-auto tw-py-1 tw-rounded"
								style="width: 7.5rem;"
								v-if="!repayment.repaid && repayment.delinquent"
							>
								<kv-material-icon
									class="tw-w-3 tw-h-3 tw-text-danger tw-align-middle"
									:icon="mdiMinusCircle"
								/>
								Delinquent
							</p>
						</td>
					</tr>
				</table>

				<!-- Table for medium and up screens -->
				<table class="tw-table-auto tw-hidden md:tw-table">
					<tr class="tw-bg-secondary tw-text-left">
						<th><span class="tw-sr-only">Date</span></th>
						<th class="table-heading-spacing">
							Expected
						</th>
						<th class="table-heading-spacing">
							Status
						</th>
					</tr>
					<tr
						v-for="(repayment, index) in parsedRepaymentSchedule"
						:key="index"
						class="tw-mb-1"
					>
						<td class="table-data-spacing">
							{{ repayment.formattedRepaymentDate }}
						</td>
						<td class="table-data-spacing">
							{{ repayment.formattedMonthlyPayment }}
						</td>
						<td
							class="table-data-spacing"
							v-if="!repayment.repaid && !repayment.delinquent"
						>
							Available {{ repayment.formattedRepaymentDate }}
						</td>
						<!-- if payment is received -->
						<td
							class="table-data-spacing"
							v-if="repayment.repaid && !repayment.delinquent"
						>
							<kv-material-icon
								:icon="mdiCheckboxMarkedCircle"
								class="tw-w-3 tw-h-3 tw-text-brand-700 tw-align-middle"
							/>
							Repayment received
						</td>
						<!-- if payment is not received on time -->
						<td
							class="table-data-spacing"
							v-if="!repayment.repaid && repayment.delinquent"
						>
							<kv-material-icon
								class="tw-w-3 tw-h-3 tw-text-danger tw-align-middle"
								:icon="mdiMinusCircle"
							/>
							Delinquent
						</td>
					</tr>
				</table>
				<p v-if="!isPartnerLoan && loanDisbursed">
					<!-- eslint-disable-next-line max-len -->
					Disbursement and repayments will be made via PayPal, a web-based payment system. Repayments made on delinquent loans will be applied toward the oldest payment due until the loan becomes current.
				</p>
			</div>

			<!-- direct loan before disbursal" -->
			<div
				v-if="!isPartnerLoan && !loanDisbursed"
				class="tw-prose"
			>
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
import { gql } from '@apollo/client';
import { mdiCheckboxMarkedCircle, mdiMinusCircle } from '@mdi/js';
import { format, parseISO, isBefore } from 'date-fns';
import numeral from 'numeral';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
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
	name: 'RepaymentSchedule',
	components: {
		KvLightbox,
		KvMaterialIcon,
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
			mdiCheckboxMarkedCircle,
			mdiMinusCircle,
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
				this.firstRepaymentDate = this.repaymentSchedule[0]?.dueToKivaDate || '';
			});
		},
	},
	computed: {
		isPartnerLoan() {
			return !!this.partnerName;
		},
		formattedFirstRepaymentDate() {
			if (this.firstRepaymentDate !== '') {
				return format(parseISO(this.firstRepaymentDate), 'MMM dd, yyyy');
			}
			return false;
		},
		statusLanguageCheck() {
			if (this.status === 'payingBack') {
				return 'began';
			}
			return 'begin';
		},
		delinquentPayment() {
			// looking through the parsedRepaymentSchedule for a delinquent payment boolean
			const delinquentPaymentPresent = this.parsedRepaymentSchedule.find(({ delinquent }) => delinquent === true);
			return delinquentPaymentPresent !== undefined;
		},
		repaymentStatusCheck() {
			if (this.status === 'payingBack' && this.delinquentPayment) {
				return 'delinquent';
			}
			// TODO: fill out other options for other loan statuses
			return 'on track';
		},
		parsedRepaymentSchedule() {
			const monthlyRepaymentData = [];
			const monthlyTotalRepayments = [];
			let repaid = false;
			let delinquent = false;
			if (this.repaymentSchedule !== []) {
				const repaymentScheduleByDueDate = this.repaymentSchedule.reduce((acc, repaymentItem) => {
					if (!acc[repaymentItem.dueToKivaDate]) acc[repaymentItem.dueToKivaDate] = [];
					acc[repaymentItem.dueToKivaDate].push(repaymentItem);
					return acc;
				}, {});

				Object.entries(repaymentScheduleByDueDate).forEach(([repaymentDate, repaymentItemData]) => {
					// iterating through each repaymentItemByDueDate, pulling off the amount from each repaymentItemData
					// and reducing it down to an array of individual repayments made in a month.
					const result = repaymentItemData.reduce((arr, val) => {
						arr.push(val.amount);
						return (arr);
					}, []);
					// result = ["548.43","548.43","548.43","548.43"]

					// take the array of payments, change them from strings to integers
					// and add them together, which results in the total payments for a month
					const totalMonthlyPayment = result.reduce((runningTotal, amount) => {
						return runningTotal + parseFloat(amount);
					}, 0);

					// push the monthly repayments to a new array to be used to check if repayments are on time
					monthlyTotalRepayments.push(totalMonthlyPayment);

					// iterate through the monthlyRepayments and add together each
					// month's payments to get a total monthly payment amount
					const totalMonthlyPaymentValue = monthlyTotalRepayments.reduce((runningTotal, monthlyAmount) => {
						return runningTotal + parseFloat(monthlyAmount);
					}, 0);

					// set the repaid boolean
					repaid = this.repaidAmount > totalMonthlyPaymentValue;

					const now = new Date();
					const parsedRepaymentDate = parseISO(repaymentDate);
					// if a payment is not repaid and the repayment data is before now, then mark the loan delinquent
					delinquent = !repaid && isBefore(parsedRepaymentDate, now);

					// format date and monthly payment amount for display
					const formattedRepaymentDate = format(parseISO(repaymentDate), 'MMM yyyy');
					const formattedMonthlyPayment = numeral(totalMonthlyPayment).format('$0,0.00');

					// add all the parsed repayment data into an array used to render
					monthlyRepaymentData.push({
						formattedRepaymentDate,
						totalMonthlyPayment,
						formattedMonthlyPayment,
						repaid,
						delinquent
					});
				});
			}
			return monthlyRepaymentData;
		},
		loanAmountFormatted() {
			return numeral(this.loanAmount).format('$0,0.00');
		},
		calculateMonthlyPayment() {
			// used for calculating the monthly payment of a direct loan
			return numeral(this.loanAmount / this.lenderRepaymentTerm).format('$0,0.00');
		},
		loanDisbursed() {
			return this.disbursalDate !== '' && isBefore(parseISO(this.disbursalDate), new Date());
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
