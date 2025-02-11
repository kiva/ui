<template>
	<div class="loan-list-container tw-mt-4">
		<div class="loan-list-scroll-container tw-relative">
			<div class="loan-list-inner-container tw-overflow-x-auto tw-min-w-full">
				<table class="tw-w-full tw-min-w-[900px]">
					<thead>
						<tr class="tw-border-y tw-border-tertiary">
							<th class="tw-text-left tw-font-medium tw-px-2 tw-py-1">
								Loan details
							</th>
							<th class="tw-text-left tw-font-medium tw-px-2 tw-py-1">
								Status
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2 tw-py-1">
								You loaned
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2 tw-py-1">
								Amount
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2 tw-py-1">
								Length
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2 tw-py-1">
								Paid back or raised
							</th>
							<th class="tw-text-left tw-font-medium tw-px-2 tw-py-1">
								Team
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="!loans.length">
							<td class="tw-text-center tw-text-secondary tw-px-2" colspan="7">
								No loans found
							</td>
						</tr>
						<tr
							v-for="loan in loans"
							:key="loan.id"
							class="tw-border-b tw-border-tertiary"
						>
							<td class="tw-px-2 tw-py-2">
								<div class="tw-flex tw-items-center">
									<img
										:src="loan.image.url"
										alt="Loan image"
										class="tw-w-[50px] tw-h-[50px] tw-mr-2"
									>
									<div>
										<div class="tw-font-semibold">
											<a
												:href="`https://www.kiva.org/lend/${loan.id}`"
												class="tw-text-action"
												v-kv-track-event="[
													'portfolio', 'click', 'View borrower details', loan.name, loan.id]"
											>
												{{ loan.name }}
												<div>
													#{{ loan.id }}
												</div>
											</a>
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
										${{ loan.userProperties.loanBalance.amountPurchasedByLender }}
									</div>
									<div class="tw-mb-1 tw-text-secondary">
										{{ formatDate(loan.terms.disbursalDate) || '(Endpoint TBD)' }}
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
										${{ loan.userProperties.loanBalance.amountRepaidToLender }} repaid to you
									</div>
								</div>
							</td>
							<td class="tw-max-w-[150px] tw-whitespace-normal tw-break-words tw-px-2">
								<div class="tw-items-center">
									<template v-if="loan.teams?.values?.[0]">
										<img
											v-if="loan.teams.values[0].image?.url"
											:src="loan.teams.values[0].image.url"
											:alt="`${loan.teams.values[0].name} team image`"
											class="tw-w-5 tw-h-5"
										>
										<span>{{ loan.teams.values[0].name }}</span>
									</template>
									<span v-else>-</span>
								</div>
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
import KvFlag from '#src/components/Kv/KvFlag';

export default {
	name: 'LoanList',
	inject: ['cookieStore'],
	props: {
		loans: {
			type: Array,
			default: () => []
		}
	},
	components: {
		KvFlag
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
	background: linear-gradient(to left, #fff, rgb(255 255 255 / 0%));
}
</style>
