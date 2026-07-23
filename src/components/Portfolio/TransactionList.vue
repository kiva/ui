<template>
	<div class="tw-mt-2">
		<div class="tw-overflow-x-auto tw-min-w-full">
			<table class="tw-w-full tw-border-collapse tw-text-small">
				<thead>
					<tr class="tw-bg-gray-200">
						<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
							Loan
						</th>
						<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
							Partner / Country
						</th>
						<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
							Date / Time
						</th>
						<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
							Category
						</th>
						<th class="tw-text-left tw-font-bold tw-px-2 tw-py-1">
							Description
						</th>
						<th class="tw-text-right tw-font-bold tw-px-2 tw-py-1">
							Amount
						</th>
						<th class="tw-text-right tw-font-bold tw-px-2 tw-py-1">
							Credit Balance
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="loading">
						<td colspan="7" class="tw-px-2 tw-py-4">
							<div
								v-for="i in skeletonRowCount"
								:key="i"
								class="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4 tw-items-start"
							>
								<kv-loading-placeholder class="tw-col-span-2 !tw-h-3.5" />
								<kv-loading-placeholder class="tw-col-span-2 !tw-h-3.5" />
								<kv-loading-placeholder class="tw-col-span-2 !tw-h-3.5" />
								<kv-loading-placeholder class="tw-col-span-2 !tw-h-3.5" />
								<kv-loading-placeholder class="tw-col-span-2 !tw-h-3.5" />
								<kv-loading-placeholder class="tw-col-span-1 !tw-h-3.5" />
								<kv-loading-placeholder class="tw-col-span-1 !tw-h-3.5" />
							</div>
						</td>
					</tr>
					<tr v-else-if="hasError">
						<td
							class="tw-text-center tw-text-danger tw-px-2 tw-pt-4"
							colspan="7"
							data-testid="transactions-error-message"
						>
							We couldn't load your transactions right now. Please refresh the page and try again.
						</td>
					</tr>
					<tr v-else-if="!transactions.length && hasAnyTransactions">
						<td
							class="tw-text-center tw-text-secondary tw-px-2 tw-pt-4"
							colspan="7"
							data-testid="no-matching-transactions-message"
						>
							You don't have any transactions that match this search.
						</td>
					</tr>
					<tr v-else-if="!transactions.length">
						<td
							class="tw-text-center tw-text-secondary tw-px-2 tw-pt-4"
							colspan="7"
							data-testid="no-transactions-message"
						>
							You don't have any transactions yet.
						</td>
					</tr>
					<template v-else>
						<tr
							v-for="(transaction, index) in transactions"
							:key="index"
							class="tw-border-b tw-border-tertiary tw-bg-primary"
							:class="{ '!tw-bg-gray-50': index % 2 === 1 }"
						>
							<td class="tw-break-words tw-px-2 tw-py-2 tw-align-top">
								<a
									v-if="transaction.loan"
									:href="`/lend/${transaction.loan.id}`"
									class="tw-text-action data-hj-suppress"
									v-kv-track-event="[
										'portfolio', 'click', 'View borrower details',
										null, transaction.loan.id]"
								>
									{{ transaction.loan.name }}
									<div>(#{{ transaction.loan.id }})</div>
								</a>
							</td>
							<td class="tw-break-words tw-px-2 tw-py-2 tw-align-top">
								<div v-if="transaction.loan && transaction.loan.trusteeName">
									<a
										:href="getTrusteeUrl(transaction.loan.trusteeId)"
										target="_blank"
										class="tw-text-action data-hj-suppress"
										v-kv-track-event="[
											'portfolio', 'click', 'View trustee details',
											null, transaction.loan.trusteeId]"
									>
										{{ transaction.loan.trusteeName }}
									</a>
								</div>
								<div v-else-if="transaction.loan && transaction.loan.partnerName">
									<a
										:href="getPartnerUrl(transaction.loan.partnerId)"
										target="_blank"
										class="tw-text-action data-hj-suppress"
										v-kv-track-event="[
											'portfolio', 'click', 'View partner details',
											null, transaction.loan.partnerId]"
									>
										{{ transaction.loan.partnerName }}
									</a>
								</div>
								<div v-if="countryName(transaction)" class="tw-flex tw-items-center">
									<div class="tw-w-2 tw-h-2 tw-mr-1">
										<kv-flag
											v-if="countryIsoCode(transaction)"
											:country="countryIsoCode(transaction)"
											:name="countryName(transaction)"
										/>
									</div>
									{{ countryName(transaction) }}
								</div>
							</td>
							<td class="tw-px-2 tw-py-2 tw-align-top">
								{{ formatDate(transaction.createTime) }}
							</td>
							<td class="tw-px-2 tw-py-2 tw-align-top">
								{{ transaction.displayName || transaction.category || '-' }}
							</td>
							<td class="tw-break-words tw-px-2 tw-py-2 tw-align-top">
								<div>{{ transaction.description || '-' }}</div>
								<div
									v-if="transaction.paymentTransactionId"
									class="tw-text-secondary tw-text-small tw-break-all"
								>
									Transaction ID: {{ transaction.paymentTransactionId }}
								</div>
							</td>
							<td class="tw-text-right tw-px-2 tw-py-2 tw-align-top tw-whitespace-nowrap">
								{{ $filters.numeral(transaction.amount, '$0,0.00') }}
							</td>
							<td class="tw-text-right tw-px-2 tw-py-2 tw-align-top tw-whitespace-nowrap">
								{{ $filters.numeral(transaction.newBalance, '$0,0.00') }}
							</td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { KvFlag, KvLoadingPlaceholder } from '@kiva/kv-components';

export default {
	name: 'TransactionList',
	components: {
		KvFlag,
		KvLoadingPlaceholder,
	},
	props: {
		transactions: {
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
		// True once we know the account has at least one transaction (from the first unfiltered
		// fetch). Distinguishes "no results for this filter/search" from "no transactions at all".
		hasAnyTransactions: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			// Skeleton rows shown while a page of transactions loads, so the table reserves
			// representative height and the swap to loaded rows doesn't jump.
			skeletonRowCount: 8,
		};
	},
	methods: {
		formatDate(date) {
			if (!date) return '';
			// Formats in the lender's browser timezone (rows render client-side); the field is a
			// full ISO-8601 instant. Includes time-of-day + timezone to match the legacy
			// "Date / Time" column (e.g. "Jul 16, 2026, 3:45 PM EDT").
			return new Date(date).toLocaleString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				timeZoneName: 'short',
			});
		},
		countryName(transaction) {
			return transaction.loan?.geocode?.country?.name || '';
		},
		countryIsoCode(transaction) {
			return transaction.loan?.geocode?.country?.isoCode || '';
		},
		getPartnerUrl(partnerId) {
			return `/about/where-kiva-works/partners/${partnerId}`;
		},
		getTrusteeUrl(trusteeId) {
			return `/trustees/${trusteeId}`;
		},
	},
};
</script>
