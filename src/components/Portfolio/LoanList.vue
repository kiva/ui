<template>
	<div class="tw-w-full">
		<table class="tw-w-full">
			<thead>
				<tr class="tw-border-y tw-border-tertiary">
					<th class="tw-py-3 tw-px-4 tw-text-left tw-font-medium">
						Loan details
					</th>
					<th class="tw-py-3 tw-px-4 tw-text-left tw-font-medium">
						Status
					</th>
					<th class="tw-py-3 tw-px-4 tw-text-right tw-font-medium">
						You loaned
					</th>
					<th class="tw-py-3 tw-px-4 tw-text-right tw-font-medium">
						<div>Paid back</div>
						<div>or raised</div>
					</th>
					<th class="tw-py-3 tw-px-4 tw-text-right tw-font-medium">
						Length
					</th>
					<th class="tw-py-3 tw-px-4 tw-text-right tw-font-medium">
						Amount
					</th>
					<th class="tw-py-3 tw-px-4 tw-text-right tw-font-medium">
						Team
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="loans.length === 0">
					<td colspan="7" class="tw-p-4 tw-text-center tw-text-secondary">
						No loans found
					</td>
				</tr>
				<tr
					v-else
					v-for="loan in loans"
					:key="loan.id"
					class="tw-border-b tw-border-tertiary"
				>
					<td class="tw-py-3 tw-px-4">
						<div class="tw-flex tw-items-center">
							<img :src="loan.image.url" class="tw-w-16 tw-h-16 tw-mr-3">
							<div>
								<div>{{ loan.name }}</div>
								<div class="tw-text-secondary">
									{{ loan.use }}
								</div>
								<div class="tw-text-secondary">
									{{ loan.geocode.country.name }}
								</div>
							</div>
						</div>
					</td>
					<td class="tw-py-3 tw-px-4">
						{{ loan.status }}
					</td>
					<td class="tw-py-3 tw-px-4 tw-text-right">
						${{ loan.loanAmount }}
					</td>
					<td class="tw-py-3 tw-px-4 tw-text-right">
						${{ loan.loanFundraisingInfo.fundedAmount }}
					</td>
					<td class="tw-py-3 tw-px-4 tw-text-right">
						{{ getLoanLength(loan.terms.expectedPayments) }} mos
					</td>
					<td class="tw-py-3 tw-px-4 tw-text-right">
						${{ loan.terms.loanAmount }}
					</td>
					<td class="tw-py-3 tw-px-4 tw-text-right">
						{{ loan.teams?.values?.[0]?.name || '-' }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { gql } from 'graphql-tag';

export default {
	name: 'LoanList',
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			loans: [
				{
					id: '1234567',
					name: 'Maria',
					status: 'repaid',
					use: 'to buy inventory for her small store',
					image: {
						url: 'https://www-dev-kiva-org.freetls.fastly.net/img/w800/726677.jpg'
					},
					geocode: {
						country: {
							name: 'Ecuador'
						}
					},
					loanAmount: 25.00,
					loanFundraisingInfo: {
						fundedAmount: 250.00
					},
					terms: {
						loanAmount: 500.00,
						expectedPayments: [
							{ dueToKivaDate: '2024-02-01' },
							{ dueToKivaDate: '2024-08-01' }
						]
					},
					teams: {
						values: [{
							name: 'Team Kiva'
						}]
					}
				}
			]
		};
	},
	methods: {
		getLoanLength(payments) {
			if (!payments || !payments.length) return '-';
			const firstPayment = new Date(payments[0].dueToKivaDate);
			const lastPayment = new Date(payments[payments.length - 1].dueToKivaDate);
			const months = (lastPayment.getFullYear() - firstPayment.getFullYear()) * 12
							+ (lastPayment.getMonth() - firstPayment.getMonth());
			return months;
		}
	},
	apollo: {
		loans: {
			query: gql`
				query myLoans {
					my {
						id
						loans(limit: 50) {
							values {
								id
								name
								status
								use
								image {
									id
									url
								}
								geocode {
									country {
										id
										name
									}
								}
								loanAmount
								loanFundraisingInfo {
									fundedAmount
								}
								terms {
									loanAmount
									expectedPayments {
										dueToKivaDate
									}
								}
								teams {
									values {
										id
										name
									}
								}
							}
						}
					}
				}
			`,
			update: data => data.my.loans.values
		}
	}
};
</script>
