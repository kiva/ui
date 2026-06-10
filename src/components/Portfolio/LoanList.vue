<template>
	<div class="tw-mt-4">
		<div class="tw-relative">
			<div class="tw-overflow-x-auto tw-min-w-full">
				<table class="tw-w-full">
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
								Paid back or raised
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2 tw-py-1">
								Length
							</th>
							<th class="tw-text-right tw-font-medium tw-px-2 tw-py-1">
								Amount
							</th>
							<th class="tw-text-left tw-font-medium tw-px-2 tw-py-1">
								Team
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="loading">
							<td colspan="7" class="tw-px-2 tw-py-4">
								<div v-for="i in 3" :key="i" class="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
									<kv-loading-placeholder
										v-for="(placeholder, index) in placeholders"
										:key="index"
										:class="[
											`tw-col-span-${placeholder.span}`,
											placeholder.marginLeft && 'tw-ml-auto'
										]"
										style="height: 50px;"
									/>
								</div>
							</td>
						</tr>
						<tr v-else-if="!loans.length">
							<td class="tw-text-center tw-text-secondary tw-px-2" colspan="7">
								No loans found
							</td>
						</tr>
						<tr
							v-for="(loan, index) in loans"
							:key="loan.id"
							class="tw-border-b tw-border-tertiary"
							:class="{ 'tw-bg-gray-50': index % 2 === 1 }"
						>
							<td class="tw-px-2 tw-py-2">
								<div class="tw-flex tw-items-start">
									<img
										:src="loan.image.url"
										alt="Loan image"
										class="loan-image tw-mr-2 tw-shrink-0"
									>
									<div>
										<div class="tw-font-semibold">
											<a
												:href="`/lend/${loan.id}`"
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
											{{ loan.activity?.name || '-' }}
										</div>
										<div class="tw-flex tw-items-center tw-text-secondary">
											<div class="tw-w-2 tw-h-2 tw-mr-1">
												<kv-flag
													v-if="loan.geocode?.country?.isoCode"
													:country="loan.geocode?.country?.isoCode"
													:name="loan.geocode?.country?.name || ''"
												/>
											</div>
											{{ loan.geocode?.country?.name || '-' }}
										</div>
										<div class="tw-text-secondary" v-if="loan.trusteeName">
											<a
												:href="getTrusteeUrl(loan.trusteeId)"
												target="_blank"
											>
												{{ loan.trusteeName }}
											</a>
										</div>
										<div class="tw-text-secondary" v-else-if="loan.partnerName">
											<a
												:href="getPartnerUrl(loan.partnerId)"
												target="_blank"
											>
												{{ loan.partnerName }}
											</a>
										</div>
									</div>
								</div>
							</td>
							<td class="tw-px-2">
								<div class="tw-text-secondary">
									{{ getStatusLabel(loan) }}
								</div>
							</td>
							<td class="tw-text-right tw-px-2">
								<div>
									<div class="tw-mb-1">
										{{ $filters.numeral(
											loan.userProperties.loanBalance.amountPurchasedByLender,
											'$0,0'
										) }}
									</div>
									<div
										v-if="loan.userProperties?.loanBalance?.latestSharePurchaseTime"
										class="tw-mb-1 tw-text-secondary"
									>
										{{ formatDate(loan.userProperties.loanBalance.latestSharePurchaseTime) }}
									</div>
									<div
										v-if="hasPromoCredit(loan)"
										class="tw-text-secondary tw-text-small"
									>
										{{ $filters.numeral(
											loan.userProperties.loanBalance.amountPurchasedByPromo,
											'$0,0'
										) }} free credit
									</div>
								</div>
							</td>
							<td class="tw-text-right tw-px-2">
								<div v-if="isRaisedOrFundraising(loan.status)">
									{{ $filters.numeral(loan.loanFundraisingInfo?.fundedAmount, '$0,0') }} raised
								</div>
								<template v-else>
									<paid-amount-modal
										:amount="loan.userProperties?.loanBalance?.amountRepaidToLender || '0'"
										:payment-history="loan.userProperties?.repaymentHistory"
									/>
									<div
										v-if="hasRepaidToLender(loan)"
										class="tw-text-secondary tw-text-small"
									>
										{{ repaidLabel(loan, 'you') }}
									</div>
									<div
										v-else-if="hasRepaidToPromo(loan)"
										class="tw-text-secondary tw-text-small"
									>
										{{ repaidLabel(loan, 'Kiva') }}
									</div>
									<div
										v-if="hasArrears(loan.sharedArrearsAmount)"
										class="tw-text-secondary tw-text-small"
									>
										({{ formatArrearsAmount(loan.sharedArrearsAmount) }} in arrears)
									</div>
								</template>
							</td>
							<td class="tw-text-right tw-px-2">
								<div>
									{{ loan.lenderRepaymentTerm || '-' }} months
								</div>
							</td>
							<td class="tw-text-right tw-px-2">
								<div>
									<div>
										{{ $filters.numeral(loan.terms.loanAmount, '$0,0') }}
									</div>
									<div
										v-if="hasArrears(loan.arrearsAmount)"
										class="tw-text-secondary tw-text-small"
									>
										({{ formatArrearsAmount(loan.arrearsAmount) }} in arrears)
									</div>
								</div>
							</td>
							<td class="team-cell tw-whitespace-normal tw-break-words tw-px-2">
								<div class="tw-items-center">
									<template v-if="loan.userProperties?.userAttributedTeam">
										<img
											v-if="loan.userProperties.userAttributedTeam.image?.url"
											:src="loan.userProperties.userAttributedTeam.image.url"
											:alt="`${loan.userProperties.userAttributedTeam.name} team image`"
											class="tw-w-5 tw-h-5"
										>
										<span>{{ loan.userProperties.userAttributedTeam.name }}</span>
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
import { KvFlag, KvLoadingPlaceholder } from '@kiva/kv-components';
import {
	EXPIRED,
	FUNDRAISING,
	RAISED,
	REFUNDED,
} from '#src/api/fixtures/LoanStatusEnum';
import PaidAmountModal from '#src/components/Portfolio/PaidAmountModal';

const REFUNDED_OR_EXPIRED_STATUSES = new Set([EXPIRED, REFUNDED]);
const RAISED_OR_FUNDRAISING_STATUSES = new Set([FUNDRAISING, RAISED]);

export default {
	name: 'LoanList',
	inject: ['cookieStore'],
	props: {
		loans: {
			type: Array,
			default: () => []
		},
		loading: {
			type: Boolean,
			default: true
		}
	},
	components: {
		KvFlag,
		KvLoadingPlaceholder,
		PaidAmountModal
	},
	methods: {
		formatDate(date) {
			if (!date) return '';
			return new Date(date).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		},
		getStatusLabel(loan) {
			return loan.statusLabel || loan.status;
		},
		hasArrears(amount) {
			return amount != null && parseFloat(amount) >= 0;
		},
		formatArrearsAmount(amount) {
			const formatted = this.$filters.numeral(amount, '$0,0.00');
			return parseFloat(amount) > 0 ? `-${formatted}` : formatted;
		},
		hasPromoCredit(loan) {
			const amount = loan.userProperties?.loanBalance?.amountPurchasedByPromo;
			return amount != null && parseFloat(amount) > 0;
		},
		hasRepaidToLender(loan) {
			const amount = loan.userProperties?.loanBalance?.amountRepaidToLender;
			return amount != null && parseFloat(amount) > 0;
		},
		hasRepaidToPromo(loan) {
			const amount = loan.userProperties?.loanBalance?.amountRepaidToPromo;
			return amount != null && parseFloat(amount) > 0;
		},
		isRaisedOrFundraising(status) {
			return RAISED_OR_FUNDRAISING_STATUSES.has(status);
		},
		repaidLabel(loan, recipient) {
			const verb = REFUNDED_OR_EXPIRED_STATUSES.has(loan.status) ? 'repaid/refunded' : 'repaid';
			return `${verb} to ${recipient}`;
		},
	},
	computed: {
		getPartnerUrl() {
			return partnerId => `/about/where-kiva-works/partners/${partnerId}`;
		},
		getTrusteeUrl() {
			return trusteeId => `/trustees/${trusteeId}`;
		}
	},
	data() {
		return {
			placeholders: [
				{ span: 4 },
				{ span: 1 },
				{ span: 1, marginLeft: true },
				{ span: 2, marginLeft: true },
				{ span: 1, marginLeft: true },
				{ span: 1, marginLeft: true },
				{ span: 2 }
			]
		};
	}
};
</script>

<style lang="postcss" scoped>
.scroll-gradient {
	@apply tw-pointer-events-none tw-absolute tw-top-0 tw-right-0 tw-h-full;

	width: 2rem;
	background: linear-gradient(to left, #fff, rgb(255 255 255 / 0%));
}

.loan-image {
	width: 50px;
	height: 50px;
}

.team-cell {
	max-width: 150px;
}
</style>
