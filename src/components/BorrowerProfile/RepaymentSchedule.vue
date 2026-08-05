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
				<p v-if="intro" class="tw-pb-3">
					Repayments {{ intro.tense }} {{ intro.preposition }}
					<span class="tw-font-medium">{{ formattedFirstRepaymentDate }}</span>
					<template v-if="intro.clause">
						{{ ' ' }}and are{{ ' ' }}<span class="tw-font-medium">{{ intro.clause }}</span>
					</template>.
				</p>
				<p v-if="intro && intro.followUp" class="tw-pb-3">
					{{ intro.followUp }}
				</p>

				<template v-if="isPartnerLoan">
					<button
						v-if="!isDualStatement"
						class="tw-text-link tw-mb-2 tw-block"
						data-testid="bp-repayment-advanced-toggle"
						@click="toggleAdvanced"
					>
						{{ isAdvancedVisible ? 'Hide advanced' : 'Show advanced' }}
					</button>
					<advanced-repayment-table
						v-if="isAdvancedVisible"
						:periods="advancedPeriods"
					/>
					<partner-repayment-table v-else :rows="partnerRows" />
				</template>

				<template v-else>
					<direct-repayment-table :rows="directRows" />
					<p class="tw-mt-3">
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
import { isBefore, parseISO } from 'date-fns';
import { KvLightbox } from '@kiva/kv-components';
import AdvancedRepaymentTable from '#src/components/BorrowerProfile/AdvancedRepaymentTable';
import DirectRepaymentTable from '#src/components/BorrowerProfile/DirectRepaymentTable';
import PartnerRepaymentTable from '#src/components/BorrowerProfile/PartnerRepaymentTable';
import {
	buildAdvancedPeriods,
	buildDirectInstallmentRows,
	buildPartnerPeriodRows,
	formatIntroDate,
	formatUsd,
	isDualStatementLoan,
	repaymentIntro,
} from '#src/util/repaymentSchedule';

const repaymentScheduleQuery = gql`query repaymentScheduleQuery($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
			repaymentInterval
			lenderRepaymentTerm
			loanAmount
			delinquent
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
			}
			... on LoanDirect {
				id
				repayments {
					dueDate
					amount
					amountPaid
					status
				}
			}
			... on LoanPartner {
				id
				dualStatementNote
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
					expectedRepayments {
						effectiveDate
						amount
					}
					actualRepayments {
						effectiveDate
						amount
					}
				}
			}
		}
	}
}`;

export default {
	name: 'RepaymentSchedule',
	components: {
		AdvancedRepaymentTable,
		DirectRepaymentTable,
		KvLightbox,
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
			isLightboxVisible: false,
			isAdvancedVisible: false,
			repayments: [],
			loanAmount: 0,
			lenderRepaymentTerm: 0,
			partnerName: '',
			disbursalDate: '',
			delinquent: false,
			dualStatementNote: '',
			currency: '',
		};
	},
	methods: {
		openLightbox() {
			this.isLightboxVisible = true;
		},
		closeLightbox() {
			this.isLightboxVisible = false;
		},
		toggleAdvanced() {
			this.isAdvancedVisible = !this.isAdvancedVisible;
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
				// Both loan types expose `repayments`, shaped per type; the loan's type decides
				// which table reads it.
				this.repayments = loan?.repayments || [];
				this.loanAmount = loan?.loanAmount || 0;
				this.lenderRepaymentTerm = loan?.terms?.lenderRepaymentTerm || 0;
				this.disbursalDate = loan?.terms?.disbursalDate || '';
				this.delinquent = loan?.delinquent ?? false;
				this.dualStatementNote = loan?.dualStatementNote || '';
				this.currency = loan?.terms?.currency || '';
			});
		},
	},
	computed: {
		isPartnerLoan() {
			return !!this.partnerName;
		},
		partnerRows() {
			return this.isPartnerLoan ? buildPartnerPeriodRows(this.repayments) : [];
		},
		advancedPeriods() {
			return this.isPartnerLoan ? buildAdvancedPeriods(this.repayments, this.currency) : [];
		},
		directRows() {
			return this.isPartnerLoan ? [] : buildDirectInstallmentRows(this.repayments, this.currency);
		},
		isDualStatement() {
			return isDualStatementLoan(this.dualStatementNote);
		},
		firstRepaymentDate() {
			return this.repayments[0]?.dueDate || '';
		},
		formattedFirstRepaymentDate() {
			return formatIntroDate(this.firstRepaymentDate, this.isPartnerLoan);
		},
		intro() {
			// Delinquency is the loan-level flag, not a scan of the periods.
			return repaymentIntro(this.status, {
				delinquent: this.delinquent,
				hasFirstRepaymentDate: this.firstRepaymentDate !== '',
				isPartnerLoan: this.isPartnerLoan,
			});
		},
		loanAmountFormatted() {
			return formatUsd(this.loanAmount);
		},
		calculateMonthlyPayment() {
			// used for calculating the monthly payment of a direct loan
			return formatUsd(this.loanAmount / this.lenderRepaymentTerm);
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
