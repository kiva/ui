<template>
	<div class="loan-list-container tw-mt-4">
		<div class="loan-list-scroll-container tw-relative">
			<div class="loan-list-inner-container tw-overflow-x-auto">
				<table class="tw-w-full">
					<thead>
						<tr class="tw-border-y tw-border-tertiary">
							<th class="tw-text-left tw-font-medium tw-px-2">
								Loan details
							</th>
							<th class="tw-text-left tw-font-medium tw-px-2">
								Status
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2">
								You loaned
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2">
								Amount
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2">
								Length
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2">
								Paid back or raised
							</th>
							<th class="tw-text-left tw-font-medium tw-px-2">
								Team
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="loans.length === 0">
							<td class="tw-text-center tw-text-secondary tw-px-2" colspan="7">
								No loans found
							</td>
						</tr>
						<tr
							v-for="loan in loans"
							:key="loan.id"
							class="tw-border-b tw-border-tertiary"
						>
							<td class="tw-px-2">
								<div class="tw-flex tw-items-center">
									<img
										:src="loan.image.url"
										alt="Loan image"
										class="tw-w-[50px] tw-h-[50px] tw-mr-2"
									>
									<div>
										<div class="tw-font-semibold">
											{{ loan.name }} <span class="tw-text-gray-600">(#{{ loan.id }})</span>
										</div>
										<div class="tw-text-secondary">
											{{ loan.sector?.name || '-' }}
										</div>
										<div class="tw-flex tw-items-center tw-text-secondary">
											<kv-flag
												v-if="loan.geocode?.country?.isoCode"
												class="tw-w-4 tw-h-4 tw-mr-1"
												:country="loan.geocode?.country?.isoCode"
											/>
											{{ loan.geocode?.country?.name || '-' }}
										</div>
										<div class="tw-text-secondary" v-if="loan.partnerName">
											{{ loan.partnerName }}
										</div>
									</div>
								</div>
							</td>
							<td class="tw-px-2">
								<div class="tw-text-secondary">
									{{ getPrintableStatus(loan.status) }}
								</div>
							</td>
							<td class="tw-text-right tw-px-2">
								<div>
									<div class="tw-mb-1">
										${{ loan.loanAmount }}
									</div>
									<div class="tw-mb-1">
										{{ formatDate(loan.loanFundraisingInfo.fundedDate) || '(Endpoint TBD)' }}
									</div>
								</div>
							</td>
							<td class="tw-text-right tw-px-2">
								<div>
									<div>
										${{ loan.terms.loanAmount }}
									</div>
								</div>
							</td>
							<td class="tw-text-right tw-px-2">
								<div>
									{{ getLoanLength(loan.terms.expectedPayments) }} mos
								</div>
							</td>
							<td class="tw-text-right tw-px-2">
								<div>
									<div class="tw-mb-1">
										${{ loan.loanFundraisingInfo.fundedAmount }} repaid to you
									</div>
								</div>
							</td>
							<td class="tw-max-w-[150px] tw-whitespace-normal tw-break-words tw-px-2">
								{{ loan.teams?.values?.[0]?.name || '-' }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="scroll-gradient"></div>
		</div>
	</div>
</template>

<script>
import myLoansQuery from '#src/graphql/query/portfolio/myLoans.graphql';
import KvFlag from '#src/components/Kv/KvFlag';

export default {
	name: 'LoanList',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvFlag
	},
	data() {
		return {
			loans: []
		};
	},
	methods: {
		getLoanLength(payments) {
			if (!payments || !payments.length) return '-';
			const firstPayment = new Date(payments[0].dueToKivaDate);
			const lastPayment = new Date(payments[payments.length - 1].dueToKivaDate);
			const months =				(lastPayment.getFullYear() - firstPayment.getFullYear()) * 12
				+ (lastPayment.getMonth() - firstPayment.getMonth());
			return months;
		},
		formatDate(date) {
			if (!date) return '';
			return new Date(date).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		},
		getPrintableStatus(rawStatus) {
			const mapping = {
				fundraising: 'Fundraising',
				funded: 'Funded',
				raised: 'Raised',
				payingBack: 'Paying Back',
				ended: 'Ended',
				delinquent: 'Delinquent',
				defaulted: 'Defaulted',
				refunded: 'Refunded',
				expired: 'Expired'
			};
			return mapping[rawStatus] || rawStatus;
		},
		async fetchLoans() {
			try {
				const { data } = await this.apollo.query({
					query: myLoansQuery,
					fetchPolicy: 'network-only'
				});
				this.loans = data.my.loans.values;
			} catch (error) {
				console.error('Error fetching loans:', error);
			}
		}
	},
	created() {
		this.fetchLoans();
	}
};
</script>

<style scoped>
.scroll-gradient {
	pointer-events: none;
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	width: 2rem;
	background: linear-gradient(to left, #fff, rgba(255, 255, 255, 0));
}
</style>
