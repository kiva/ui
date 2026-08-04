<template>
	<div>
		<button
			class="tw-text-upper tw-text-link tw-mt-3"
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
			<div v-if="isPartnerLoan || loanDisbursed">
				<!-- Keep the whole sentence in one paragraph. Split across sibling elements,
				the separating whitespace becomes whitespace-only text nodes that Vue drops,
				which ran the words together. -->
				<p class="tw-pb-3">
					Repayments {{ statusLanguageCheck }} in
					<span class="tw-font-medium">{{ formattedFirstRepaymentDate }}</span>
					<template v-if="status === 'payingBack'">
						and are <span class="tw-font-medium">{{ repaymentStatusCheck }}</span>
					</template>.
				</p>

				<partner-repayment-table v-if="isPartnerLoan" :rows="partnerRows" />

				<template v-else>
					<!-- Table for small screens -->
					<table class="md:tw-hidden tw-w-full">
						<tbody>
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
									<p class="tw-text-upper tw-py-1.5">
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
						</tbody>
					</table>

					<!-- Table for medium and up screens -->
					<table class="tw-table-auto tw-hidden md:tw-table">
						<thead class="tw-bg-secondary tw-text-left">
							<tr>
								<th><span class="tw-sr-only">Date</span></th>
								<th class="table-heading-spacing">
									Expected
								</th>
								<th class="table-heading-spacing">
									Status
								</th>
							</tr>
						</thead>
						<tbody>
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
						</tbody>
					</table>
					<p>
						<!-- eslint-disable-next-line max-len -->
						Disbursement and repayments will be made via PayPal, a web-based payment system. Repayments made on delinquent loans will be applied toward the oldest payment due until the loan becomes current.
					</p>
				</template>
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
import { gql } from 'graphql-tag';
import { mdiCheckboxMarkedCircle, mdiMinusCircle } from '@mdi/js';
import { format, parseISO, isBefore } from 'date-fns';
import numeral from 'numeral';
import { KvMaterialIcon, KvLightbox } from '@kiva/kv-components';
import PartnerRepaymentTable from '#src/components/BorrowerProfile/PartnerRepaymentTable';
import { buildPartnerPeriodRows, hasDelinquentPeriod } from '#src/util/repaymentSchedule';

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
				id
				partner {
					id
					name
				}
				repayments {
					dueDate
					status
					delinquencyAttribution
					expectedAmountToLenders
					actualAmountToLenders
					currencyLossToLenders
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
		PartnerRepaymentTable,
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
			repaymentSchedule: [],
			repaymentPeriods: [],
			repaidAmount: 0,
			loanAmount: 0,
			lenderRepaymentTerm: 0,
			partnerName: '',
			disbursalDate: '',
		};
	},
	methods: {
		openLightbox() {
			this.isLightboxVisible = true;
		},
		closeLightbox() {
			this.isLightboxVisible = false;
		},
		fetchRepaymentSchedule() {
			this.apollo.query({
				query: repaymentScheduleQuery,
				variables: {
					loanId: this.loanId
				}
			}).then(({ data }) => {
				const loan = data?.lend?.loan;
				this.partnerName = loan?.partner?.name || '';
				this.repaymentSchedule = loan?.terms?.expectedPayments || [];
				this.repaymentPeriods = loan?.repayments || [];
				this.repaidAmount = loan?.paidAmount || 0;
				this.loanAmount = loan?.loanAmount || 0;
				this.lenderRepaymentTerm = loan?.terms?.lenderRepaymentTerm || 0;
				this.disbursalDate = loan?.terms?.disbursalDate || '';
			});
		},
	},
	computed: {
		isPartnerLoan() {
			return !!this.partnerName;
		},
		partnerRows() {
			return buildPartnerPeriodRows(this.repaymentPeriods);
		},
		firstRepaymentDate() {
			if (this.isPartnerLoan) {
				return this.repaymentPeriods[0]?.dueDate || '';
			}
			return this.repaymentSchedule[0]?.dueToKivaDate || '';
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
			if (this.isPartnerLoan) {
				return hasDelinquentPeriod(this.repaymentPeriods);
			}
			return this.parsedRepaymentSchedule.some(({ delinquent }) => delinquent);
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
			if (this.repaymentSchedule.length !== 0) {
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
		this.fetchRepaymentSchedule();
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
