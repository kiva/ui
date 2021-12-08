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
			<div class="tw-prose tw-my-2">
				Repayments {{ statusLanguageCheck }}
				<span class="tw-font-medium">
					{{ formattedFirstRepaymentDate }}
				</span>
				and are
				<span class="tw-font-medium">
					{{ repaymentStatusCheck }}.
				</span>
			</div>
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
		</kv-lightbox>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import { mdiCheckboxMarkedCircle, mdiMinusCircle } from '@mdi/js';
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
				this.firstRepaymentDate = this.repaymentSchedule[0].dueToKivaDate || '';
				this.repaidAmount = data?.lend?.loan?.paidAmount || 0;
			});
		},
	},
	computed: {
		formattedFirstRepaymentDate() {
			if (this.firstRepaymentDate !== '') {
				return format(parseISO(this.firstRepaymentDate), 'MMM yyyy');
			}
			return false;
		},
		statusLanguageCheck() {
			if (this.status === 'fundraising') {
				return 'begin on';
			}
			return 'began in';
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
			if (this.repaymentSchedule !== '') {
				this.repaymentSchedule.forEach((repayment, index) => {
					console.log('index', index);
					formattedRepaymentSchedule.push({
						repaymentDateFormatted: format(parseISO(repayment.dueToKivaDate), 'MMM yyyy'),
						repaymentAmountFormatted: numeral(repayment.amount).format('$0,0.00'),
						repaymentDateExpectedFormatted: format(parseISO(repayment.dueToKivaDate), 'MMM yyyy'),
					});
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

<style lang="scss" scoped>

// Was not able to add spacing to the <table> without this .scss
.table-heading-spacing {
	padding: 1.25rem 0 1.25rem 0.625rem;
}

.table-data-spacing {
	padding: 0.625rem;
}

</style>
