<template>
	<div class="tw-mt-2">
		<div class="tw-relative">
			<div ref="scrollContainer" class="loan-table-scroll tw-min-w-full" @scroll="updateScrollGradients">
				<table class="tw-w-full tw-border-collapse tw-text-small">
					<thead>
						<tr class="tw-bg-gray-200">
							<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
								Loan details
							</th>
							<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
								Lending partner
							</th>
							<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
								Status
							</th>
							<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
								You loaned
							</th>
							<th class="paid-back-cell tw-text-left tw-font-bold tw-px-2 tw-py-1">
								Paid back or raised
							</th>
							<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
								Length
							</th>
							<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
								Amount
							</th>
							<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
								Team
							</th>
						</tr>
					</thead>
					<tbody>
						<template v-if="loading">
							<tr
								v-for="i in skeletonRowCount"
								:key="i"
								class="tw-border-b tw-border-tertiary tw-bg-primary"
							>
								<td class="loan-details-cell tw-px-2 tw-py-2 tw-align-top">
									<div class="tw-flex tw-items-start">
										<kv-loading-placeholder
											class="tw-mr-2 tw-shrink-0 !tw-w-6.5 !tw-h-6.5"
										/>
										<div class="tw-flex-1">
											<kv-loading-placeholder class="tw-mb-1" style="height: 1rem;" />
											<kv-loading-placeholder class="tw-mb-1" style="height: 0.875rem;" />
											<kv-loading-placeholder class="tw-mb-1" style="height: 0.875rem;" />
											<kv-loading-placeholder style="height: 0.875rem;" />
										</div>
									</div>
								</td>
								<td colspan="7" class="tw-px-2 tw-py-2 tw-align-top">
									<div class="tw-grid tw-grid-cols-7 tw-gap-4 tw-items-start">
										<kv-loading-placeholder style="height: 0.875rem;" />
										<kv-loading-placeholder style="height: 0.875rem;" />
										<kv-loading-placeholder style="height: 0.875rem;" />
										<kv-loading-placeholder style="height: 0.875rem;" />
										<kv-loading-placeholder style="height: 0.875rem;" />
										<kv-loading-placeholder style="height: 0.875rem;" />
										<kv-loading-placeholder style="height: 0.875rem;" />
									</div>
								</td>
							</tr>
						</template>
						<tr v-else-if="hasError">
							<td
								class="tw-text-center tw-text-danger tw-px-2 tw-pt-4"
								colspan="8"
								data-testid="loans-error-message"
							>
								We couldn't load your loans right now. Please refresh the page and try again.
							</td>
						</tr>
						<tr v-else-if="!loans.length">
							<td
								class="tw-text-center tw-text-secondary tw-px-2 tw-pt-4"
								colspan="8"
								data-testid="no-loans-message"
							>
								You haven't made any loans that match this search.
							</td>
						</tr>
						<tr
							v-for="(loan, index) in loans"
							:key="loan.id"
							class="tw-border-b tw-border-tertiary tw-bg-primary"
							:class="{ '!tw-bg-gray-50': index % 2 === 1 }"
						>
							<td class="loan-details-cell tw-break-words tw-px-2 tw-py-2">
								<div class="tw-flex tw-items-start">
									<div class="tw-mr-2 tw-shrink-0 tw-text-center">
										<img
											:src="loan.image.url"
											alt="Loan image"
											class="loan-image data-hj-suppress"
										>
										<div
											v-if="loan.userProperties?.wasMatched"
											class="tw-text-small tw-text-secondary tw-mt-1"
											data-testid="matched-badge"
										>
											{{ matchedLabel(loan) }}
										</div>
									</div>
									<div class="tw-min-w-0 tw-break-words">
										<div class="tw-font-semibold">
											<a
												:href="`/lend/${loan.id}`"
												class="tw-text-action data-hj-suppress"
												v-kv-track-event="[
													'portfolio', 'click', 'View borrower details', null, loan.id]"
											>
												{{ loan.name }}
												<div>
													#{{ loan.id }}
												</div>
											</a>
										</div>
										<div>
											{{ loan.activity?.name || '-' }}
										</div>
										<div class="tw-flex tw-items-center">
											<div class="tw-w-2 tw-h-2 tw-mr-1 tw-shrink-0">
												<kv-flag
													v-if="loan.geocode?.country?.isoCode"
													:country="loan.geocode?.country?.isoCode"
													:name="loan.geocode?.country?.name || ''"
												/>
											</div>
											<span class="tw-truncate">{{ loan.geocode?.country?.name || '-' }}</span>
										</div>
										<div v-if="loan.trusteeName">
											<a
												:href="getTrusteeUrl(loan.trusteeId)"
												target="_blank"
												class="data-hj-suppress"
											>
												{{ loan.trusteeName }}
											</a>
										</div>
										<!-- The logged-in lender's own dedication on this loan. A named recipient shows
											a heart + link to the dedication page with the "repayments donated to
											Kiva" footer; a to-Kiva dedication shows the thank-you line with no
											link. Viewer-relative — the field is null when this lender has no
											dedication on the loan. -->
										<div
											v-if="getDedication(loan)"
											class="tw-mt-1"
											data-testid="loan-dedication"
										>
											<a
												v-if="getDedication(loan).recipientName"
												:href="getDedication(loan).dedicationUrl"
												class="tw-flex tw-items-center tw-text-action tw-text-small
													data-hj-suppress"
												v-kv-track-event="[
													'portfolio', 'click', 'View loan dedication', loan.id]"
											>
												<kv-material-icon
													class="tw-w-2 tw-h-2 tw-mr-1 tw-shrink-0"
													:icon="mdiHeart"
												/>
												Dedicated to {{ getDedication(loan).recipientName }}
											</a>
											<div
												v-else-if="getDedication(loan).toKiva"
												class="tw-text-secondary tw-text-small"
											>
												You opted to donate repayments from this loan to Kiva (Thanks!)
											</div>
											<div
												v-if="getDedication(loan).recipientName"
												class="tw-text-secondary tw-text-small"
												data-testid="loan-dedication-footer"
											>
												Repayments for dedications are donated to Kiva
											</div>
										</div>
									</div>
								</div>
							</td>
							<td class="lending-partner-cell tw-break-words tw-px-2 tw-py-2 tw-align-top">
								<div v-if="loan.partnerName">
									<a
										:href="getPartnerUrl(loan.partnerId)"
										target="_blank"
										class="data-hj-suppress"
									>
										{{ loan.partnerName }}
									</a>
								</div>
							</td>
							<td class="tw-px-2">
								<div>
									{{ getStatusLabel(loan) }}
								</div>
							</td>
							<td class="tw-text-right tw-px-2">
								<div>
									<div class="tw-mb-1">
										{{ $filters.numeral(
											loan.userProperties.loanBalance.totalAmountPurchased,
											'$0,0.00'
										) }}
									</div>
									<div
										v-if="loan.userProperties?.loanBalance?.latestSharePurchaseTime"
										class="tw-mb-1 tw-text-secondary tw-text-small"
									>
										{{ formatDate(loan.userProperties.loanBalance.latestSharePurchaseTime) }}
									</div>
									<div
										v-if="hasPromoCredit(loan)"
										class="tw-text-secondary tw-text-small"
									>
										{{ $filters.numeral(
											loan.userProperties.loanBalance.amountPurchasedByPromo,
											'$0,0[.]00'
										) }} {{
											loan.userProperties.loanBalance.promoTypeLabel || 'promotional credit'
										}}
									</div>
								</div>
							</td>
							<td class="paid-back-cell tw-text-right tw-px-2">
								<div v-if="isRaisedOrFundraising(loan.status)">
									{{ $filters.numeral(loan.loanFundraisingInfo?.fundedAmount, '$0,0.00') }}
									<span class="tw-block tw-text-secondary tw-text-small">raised</span>
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
							<td class="tw-text-left tw-px-2">
								<div>
									{{ loan.lenderRepaymentTerm || '-' }} months
								</div>
							</td>
							<td class="tw-text-right tw-px-2">
								<div>
									<div>
										{{ $filters.numeral(loan.terms.loanAmount, '$0,0.00') }}
									</div>
									<div
										v-if="hasArrears(loan.arrearsAmount)"
										class="tw-text-secondary tw-text-small"
									>
										({{ formatArrearsAmount(loan.arrearsAmount) }} in arrears)
									</div>
								</div>
							</td>
							<td class="team-cell tw-whitespace-normal tw-break-words tw-pl-2 tw-pr-4">
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
										class="tw-w-full data-hj-suppress"
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
									<!-- A read-only attributed team links to its team page. Renders an unlinked span
										when no teamPublicId is resolvable. -->
									<component
										:is="teamUrl(loan.userProperties.userAttributedTeam) ? 'a' : 'span'"
										v-else-if="loan.userProperties?.userAttributedTeam"
										:href="teamUrl(loan.userProperties.userAttributedTeam)"
										class="tw-flex tw-items-center data-hj-suppress"
									>
										<img
											v-if="loan.userProperties.userAttributedTeam.image?.url"
											:src="loan.userProperties.userAttributedTeam.image.url"
											:alt="`${loan.userProperties.userAttributedTeam.name} team image`"
											class="tw-w-5 tw-h-5 tw-mr-1"
										>
										<span>{{ truncateTeamName(loan.userProperties.userAttributedTeam.name) }}</span>
									</component>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div v-show="canScrollLeft" class="scroll-gradient scroll-gradient--left md:tw-hidden"></div>
			<div v-show="canScrollRight" class="scroll-gradient scroll-gradient--right md:tw-hidden"></div>
			<div v-show="canScrollDown" class="scroll-gradient scroll-gradient--bottom md:tw-hidden"></div>
		</div>
	</div>
</template>

<script>
import { mdiHeart } from '@mdi/js';
import {
	KvFlag, KvLoadingPlaceholder, KvMaterialIcon, KvSelect
} from '@kiva/kv-components';
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
		hasError: {
			type: Boolean,
			default: false
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
		KvMaterialIcon,
		KvSelect,
		PaidAmountModal
	},
	methods: {
		// Toggle the scroll-gradient overlays from the table's scroll position: each shows only
		// when the table can still scroll that direction (left/right for horizontal, down for
		// vertical). Recomputed on scroll, on resize, and after the row set changes (see
		// mounted/watch). The overlays themselves are mobile-only via md:tw-hidden in the template.
		updateScrollGradients() {
			const el = this.$refs.scrollContainer;
			if (!el) {
				this.canScrollLeft = false;
				this.canScrollRight = false;
				this.canScrollDown = false;
				return;
			}
			// 1px tolerance so sub-pixel rounding at the extremes doesn't leave a gradient on.
			this.canScrollLeft = el.scrollLeft > 1;
			this.canScrollRight = el.scrollLeft < (el.scrollWidth - el.clientWidth - 1);
			this.canScrollDown = el.scrollTop < (el.scrollHeight - el.clientHeight - 1);
		},
		// Reset the table's fixed-height scroll region to the top (called on pagination so a new
		// page starts at its first row rather than wherever the previous page was scrolled to).
		scrollToTop() {
			if (this.$refs.scrollContainer) {
				this.$refs.scrollContainer.scrollTop = 0;
			}
		},
		formatDate(date) {
			if (!date) return '';
			// Intentionally formats in the lender's browser timezone (no `timeZone` option). The
			// field is a full ISO-8601 instant and rows render client-side, so the displayed day
			// is the lender's local day.
			return new Date(date).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		},
		getStatusLabel(loan) {
			return loan.statusLabel || loan.status;
		},
		matchedLabel(loan) {
			// Show "Nx matched" only when the ratio is greater than 1; a 1:1 match
			// (ratio 1, or absent) shows a bare "Matched". The badge itself stays gated
			// on the viewer-relative wasMatched flag.
			const ratio = loan.matchRatio;
			return ratio > 1 ? `${ratio}x matched` : 'Matched';
		},
		getDedication(loan) {
			// Viewer-relative dedication for this loan (LoanUserProperties.dedication);
			// null when the logged-in lender has no dedication on it, or no logged-in user.
			return loan.userProperties?.dedication || null;
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
			// The headline is repaidAmountToYou when the lender got something, else repaidAmountTotal —
			// so a Kiva-only return shows the Kiva figure, not $0. The "repaid to …" subtitle carries the label only.
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
		teamUrl(team) {
			// Legacy parity: the read-only attributed team links to its team page,
			// keyed off the human-readable teamPublicId (legacy `viewTeamSummary`).
			// Null when no slug is resolvable, so the cell falls back to plain text.
			return team?.teamPublicId ? `/team/${team.teamPublicId}` : null;
		},
		truncateTeamName(name) {
			// The read-only attributed team name is truncated to 20 characters with a trailing ellipsis.
			if (!name) return '';
			return name.length > 20 ? `${name.slice(0, 20)}...` : name;
		},
		canReassignTeam(loan) {
			// The dropdown only appears when the loan is eligible AND the
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
			mdiHeart,
			// Number of skeleton rows shown while loading. Each row mirrors a real row's
			// height (image + stacked detail lines) so the table reserves representative
			// space and the swap to loaded content doesn't jump.
			skeletonRowCount: 5,
			canScrollLeft: false,
			canScrollRight: false,
			canScrollDown: false
		};
	},
	watch: {
		loans() {
			this.$nextTick(this.updateScrollGradients);
		},
		loading() {
			this.$nextTick(this.updateScrollGradients);
		}
	},
	mounted() {
		this.$nextTick(this.updateScrollGradients);
		// Available width changes on viewport resize and the row set changes on load/pagination;
		// neither fires a scroll event, so recompute on both.
		window.addEventListener('resize', this.updateScrollGradients);
		if (typeof ResizeObserver !== 'undefined' && this.$refs.scrollContainer) {
			this.scrollResizeObserver = new ResizeObserver(() => this.updateScrollGradients());
			this.scrollResizeObserver.observe(this.$refs.scrollContainer);
		}
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.updateScrollGradients);
		if (this.scrollResizeObserver) {
			this.scrollResizeObserver.disconnect();
			this.scrollResizeObserver = null;
		}
	}
};
</script>

<style lang="postcss" scoped>
.scroll-gradient {
	@apply tw-pointer-events-none tw-absolute;
}

.scroll-gradient--left,
.scroll-gradient--right {
	@apply tw-top-0 tw-bottom-0 tw-w-6;
}

.scroll-gradient--left {
	@apply tw-left-0;

	background: linear-gradient(to right, rgb(0 0 0 / 12%), rgb(0 0 0 / 0%));
}

.scroll-gradient--right {
	@apply tw-right-0;

	background: linear-gradient(to left, rgb(0 0 0 / 12%), rgb(0 0 0 / 0%));
}

/* z-index 4: paints over the sticky first column. */
.scroll-gradient--bottom {
	@apply tw-left-0 tw-right-0 tw-bottom-0 tw-h-6;

	z-index: 4;
	background: linear-gradient(to top, rgb(0 0 0 / 12%), rgb(0 0 0 / 0%));
}

/* Fixed-height scroll box: 600px on mobile, 800px on desktop, with the header pinned. */
.loan-table-scroll {
	max-height: 600px;
	overflow: auto;
}

@screen md {
	.loan-table-scroll {
		max-height: 800px;
	}
}

/* Header pinned during vertical scroll; own bg (inherits the header row's) covers the rows scrolling under it. */
.loan-table-scroll thead th {
	@apply tw-sticky tw-top-0;

	z-index: 2;
	background-color: inherit;
}

/* First column pinned during horizontal scroll. */
.loan-table-scroll th:first-child,
.loan-table-scroll td:first-child {
	@apply tw-sticky tw-left-0;

	z-index: 1;
	background-color: inherit;
}

/* Soft drop shadow off the pinned column's right edge, drawn as a pseudo-element gradient —
   border-collapse clips an outset box-shadow on table cells, so it won't render there. */
.loan-table-scroll th:first-child::after,
.loan-table-scroll td:first-child::after {
	@apply tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-w-2 tw-pointer-events-none;

	content: '';
	background: linear-gradient(to right, rgb(0 0 0 / 3.75%), rgb(0 0 0 / 0%));
	transform: translateX(100%);
}

/* Corner above both the sticky header and the sticky first column. */
.loan-table-scroll thead th:first-child {
	z-index: 3;
}

/* No shadow on the full-width message/skeleton cell of the loading, error and empty states. */
.loan-table-scroll td[colspan]::after {
	content: none;
}

.loan-details-cell {
	min-width: calc(10rem + 50px);
	max-width: calc(13rem + 50px);
}

.lending-partner-cell {
	min-width: 8rem;
	max-width: 12rem;
}

.paid-back-cell {
	max-width: 6rem;
}

.loan-image {
	width: 3.125rem;
	height: 3.125rem;
}

.team-cell {
	min-width: 10rem;
	max-width: 13rem;
}
</style>
