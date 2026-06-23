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
										:amount="repaidAmount(loan)"
										:payment-history="loan.userProperties?.repaymentHistory"
									/>
									<div
										v-if="hasRepaidToLender(loan)"
										class="tw-text-secondary tw-text-small"
									>
										{{ repaidLabel(loan, 'you') }}
									</div>
									<div
										v-else-if="hasRepaidToKiva(loan)"
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
									<!-- Legacy parity: eligible loans show an inline team dropdown
										directly in the cell using the shared KvSelect. The control is
										disabled while its reassignment is in flight, and ineligible
										loans stay read-only. The :key includes this loan's own
										reassignNonce entry so only this row's control remounts once its
										reassignment settles, snapping back to the attributed team if
										the change was rejected. -->
									<kv-select
										v-if="canReassignTeam(loan)"
										:key="`reassign-team-${loan.id}-${reassignNonce[loan.id] || 0}`"
										:id="`reassign-team-${loan.id}`"
										class="tw-w-full"
										:model-value="currentTeamId(loan)"
										:disabled="reassigningLoanIds.includes(loan.id)"
										:aria-label="`Reassign team for ${loan.name}`"
										@update:model-value="onTeamChange(loan, $event)"
									>
										<option
											v-for="option in teamOptions(loan)"
											:key="option.id === null ? 'none' : option.id"
											:value="option.id === null ? '' : String(option.id)"
										>
											{{ option.name }}
										</option>
									</kv-select>
									<template v-else-if="loan.userProperties?.userAttributedTeam">
										<img
											v-if="loan.userProperties.userAttributedTeam.image?.url"
											:src="loan.userProperties.userAttributedTeam.image.url"
											:alt="`${loan.userProperties.userAttributedTeam.name} team image`"
											class="tw-w-5 tw-h-5"
										>
										<span>{{ loan.userProperties.userAttributedTeam.name }}</span>
									</template>
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
import { KvFlag, KvLoadingPlaceholder, KvSelect } from '@kiva/kv-components';
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
		},
		lendingTeams: {
			type: Array,
			default: () => []
		},
		reassigningLoanIds: {
			type: Array,
			default: () => []
		},
		reassignNonce: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['reassign-team'],
	components: {
		KvFlag,
		KvLoadingPlaceholder,
		KvSelect,
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
			// Only a positive amount is "in arrears"; zero/absent renders no line.
			return amount != null && parseFloat(amount) > 0;
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
			// "repaid/refunded to you": amountRepaidToLender (includes refunds, net of FX).
			const amount = loan.userProperties?.loanBalance?.amountRepaidToLender;
			return amount != null && parseFloat(amount) > 0;
		},
		hasRepaidToKiva(loan) {
			// "repaid to Kiva": something returned on the share overall but none to the lender.
			const amount = loan.userProperties?.loanBalance?.amountReturnedTotal;
			return amount != null && parseFloat(amount) > 0 && !this.hasRepaidToLender(loan);
		},
		repaidAmount(loan) {
			// Legacy parity (LoanRowView mustache): headline is repaidAmountToYou when the
			// lender got something, else repaidAmountTotal — so a Kiva-only return shows the
			// Kiva figure, not $0. The "repaid to …" subtitle carries the label only.
			const balance = loan.userProperties?.loanBalance;
			const amount = this.hasRepaidToLender(loan)
				? balance?.amountRepaidToLender
				: balance?.amountReturnedTotal;
			return amount || '0';
		},
		isRaisedOrFundraising(status) {
			return RAISED_OR_FUNDRAISING_STATUSES.has(status);
		},
		repaidLabel(loan, recipient) {
			const verb = REFUNDED_OR_EXPIRED_STATUSES.has(loan.status) ? 'repaid/refunded' : 'repaid';
			return `${verb} to ${recipient}`;
		},
		canReassignTeam(loan) {
			// Legacy parity: the dropdown only appears when the loan is eligible AND the
			// user actually belongs to at least one team to reassign to. With no teams there
			// is nothing to pick (and no "None" detach), so the cell stays read-only.
			return Boolean(loan.userProperties?.canChangeTeamAssignment) && this.lendingTeams.length > 0;
		},
		currentTeamId(loan) {
			const team = loan.userProperties?.userAttributedTeam;
			return team ? String(team.id) : '';
		},
		teamOptions(loan) {
			const current = loan.userProperties?.userAttributedTeam;
			const options = [];
			// Legacy parity: when the loan has no attributed team, the first entry is a
			// non-actionable "None" placeholder that shows the current (teamless) state.
			// There is no detach option — the backend's reassignLoanTeam requires a target
			// team (teamId is non-null), so "None" is never emitted as a reassignment.
			if (current) {
				options.push({ id: current.id, name: current.name });
			} else {
				options.push({ id: null, name: 'None' });
			}
			this.lendingTeams.forEach(team => {
				if (!current || team.id !== current.id) {
					options.push({ id: team.id, name: team.name });
				}
			});
			return options;
		},
		onTeamChange(loan, value) {
			// The "None" placeholder (empty value) is not a reassignment target; ignore it
			// so we never send a detach the backend can't honor.
			if (value === '') {
				return;
			}
			this.$emit('reassign-team', { loanId: loan.id, teamId: Number(value) });
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
