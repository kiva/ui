<template>
	<PortfolioShell>
		<div class="tw-rounded md:tw-bg-primary tw-p-2 tw-py-3 md:tw-p-3" data-hj-suppress>
			<h1 class="tw-text-headline tw-mb-1">
				Free credit history
			</h1>

			<!-- Loading -->
			<KvLoadingPlaceholder
				v-if="loading"
				style="height: 120px;"
			/>

			<!-- Error loading the read model -->
			<div v-else-if="loadError" data-testid="free-credit-load-error">
				<p>An error occurred. Please try again.</p>
				<KvButton
					class="tw-mt-2"
					@click="fetchBonusCreditHistory"
					v-kv-track-event="['portfolio', 'click', 'Free credit history retry load']"
				>
					Try again
				</KvButton>
			</div>

			<!-- Empty state -->
			<div v-else-if="!hasRecords" data-testid="free-credit-empty">
				<p>
					You have not earned any free credits.
					<a
						href="/bonus/learnmore"
						class="tw-no-underline"
						v-kv-track-event="['portfolio', 'click', 'Free credit history learn more']"
					>Learn More »</a>
				</p>
			</div>

			<!-- History table -->
			<template v-else>
				<div class="tw-overflow-x-auto">
					<table class="tw-w-full tw-text-left tw-text-small md:tw-text-base" data-testid="free-credit-table">
						<thead>
							<tr class="tw-bg-gray-200">
								<th class="tw-p-1">
									Amount
								</th>
								<th class="tw-p-1 tw-max-w-9 md:tw-max-w-none">
									<span class="tw-block tw-truncate">Expiration</span>
								</th>
								<th class="tw-p-1">
									Status
								</th>
								<th class="tw-p-1 tw-max-w-8 md:tw-max-w-none">
									<span class="tw-block tw-truncate">Sponsor</span>
								</th>
								<th class="tw-p-1">
									Notes
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(record, i) in pagedRecords"
								:key="record.id"
								class="tw-bg-primary"
								:class="{ '!tw-bg-gray-50': i % 2 === 1 }"
							>
								<td class="tw-p-1 tw-break-words">
									{{ formatMoney(record.amountAtCreation) }}
								</td>
								<td class="tw-p-1 tw-break-words tw-max-w-9 md:tw-max-w-none">
									{{ getFormattedDate(record.expireTime) }}
								</td>
								<td class="tw-p-1 tw-break-words">
									<span
										class="tw-inline-block tw-rounded-full tw-px-1.5 tw-py-0.5
											tw-text-small tw-font-medium"
										:class="statusBadgeClass(record.status)"
									>
										{{ statusLabel(record.status) }}
									</span>
								</td>
								<td class="tw-p-1 tw-max-w-8 md:tw-max-w-none">
									<span class="tw-block tw-truncate">{{ record.promoFund?.displayName }}</span>
								</td>
								<td class="tw-p-1 tw-break-words">
									{{ composeNote(record) }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<KvPagination
					v-if="showPagination"
					class="tw-mt-3"
					:limit="limit"
					:offset="offset"
					:total="total"
					:scroll-to-top="false"
					:kv-track-function="$kvTrackEvent"
					track-event-category="portfolio"
					@page-changed="handlePageChange"
				/>
			</template>
		</div>
	</PortfolioShell>
</template>

<script>
import numeral from 'numeral';
import { KvButton, KvLoadingPlaceholder, KvPagination } from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import logFormatter from '#src/util/logFormatter';
import bonusCreditHistoryQuery from '#src/graphql/query/portfolio/bonusCreditHistory.graphql';

// Client-side page size — the list is small per user, so all rows are fetched once
// and paged in the browser (mirrors the design's "paginate client-side" decision).
const PAGE_LIMIT = 10;

// Maps the FreeCreditStatus enum to a human label + badge colour. Labels preserve the
// legacy BonusHistoryView wording ("Part redeemed", etc.).
const STATUS_META = {
	AVAILABLE: { label: 'Available', badge: 'tw-bg-eco-green-1 tw-text-eco-green-4' },
	PART_REDEEMED: { label: 'Part redeemed', badge: 'tw-bg-marigold-1 tw-text-marigold-3' },
	REDEEMED: { label: 'Redeemed', badge: 'tw-bg-gray-100 tw-text-secondary' },
	EXPIRED: { label: 'Expired', badge: 'tw-bg-gray-200 tw-text-danger' },
};

export default {
	name: 'BonusCreditHistoryPage',
	inject: ['apollo'],
	head() {
		return {
			title: 'Free Credit History',
		};
	},
	components: {
		PortfolioShell,
		KvButton,
		KvLoadingPlaceholder,
		KvPagination,
	},
	data() {
		return {
			loading: true,
			loadError: false,
			records: [],
			offset: 0,
			limit: PAGE_LIMIT,
		};
	},
	computed: {
		hasRecords() {
			return this.records.length > 0;
		},
		total() {
			return this.records.length;
		},
		showPagination() {
			return this.total > this.limit;
		},
		pagedRecords() {
			return this.records.slice(this.offset, this.offset + this.limit);
		},
	},
	mounted() {
		this.fetchBonusCreditHistory();
	},
	methods: {
		async fetchBonusCreditHistory() {
			this.loading = true;
			this.loadError = false;
			try {
				const response = await this.apollo.query({
					query: bonusCreditHistoryQuery,
					fetchPolicy: 'network-only',
				});
				const history = response?.data?.my?.userAccount?.lenderPromoCredits;
				if (!history) {
					this.loadError = true;
					return;
				}
				this.records = history;
				this.offset = 0;
			} catch (error) {
				this.loadError = true;
				logFormatter(`Error fetching free credit history: ${error}`, 'error');
			} finally {
				this.loading = false;
			}
		},
		handlePageChange({ pageOffset }) {
			this.offset = pageOffset;
		},
		formatMoney(value) {
			return numeral(value ?? 0).format('$0,0.00');
		},
		// Parses a GraphQL Date scalar (ISO 8601 string) to a Date, or null when absent/invalid.
		toDate(value) {
			if (value === null || value === undefined || value === '') {
				return null;
			}
			const date = new Date(value);
			return Number.isNaN(date.getTime()) ? null : date;
		},
		// Normalises a Date scalar to a "Mar 5, 2023" label.
		getFormattedDate(value) {
			const date = this.toDate(value);
			if (!date) {
				return '';
			}
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		},
		isExpired(record) {
			const date = this.toDate(record.expireTime);
			return date ? date.getTime() < Date.now() : false;
		},
		statusLabel(status) {
			return STATUS_META[status]?.label ?? status;
		},
		statusBadgeClass(status) {
			return STATUS_META[status]?.badge ?? STATUS_META.REDEEMED.badge;
		},
		// Reproduces the legacy award-type sentences (BonusHistoryView::initializeData). For a
		// partially-redeemed credit it appends the unredeemed amount, "expired" once past the
		// expiration date and "remaining" otherwise.
		composeNote(record) {
			const date = this.getFormattedDate(record.createTime);
			let note;
			switch (record.awardType) {
				case 'invitation':
					note = `Successful invite on ${date}.`;
					break;
				case 'promo_code':
				case 'lending_reward':
				case 'admin':
					note = `Free credit added on ${date}.`;
					break;
				case 'donation':
					note = `Donation reward on ${date}.`;
					break;
				case 'free_trial':
					note = `Free trial reward on ${date}.`;
					break;
				default:
					note = `Free credit added ${date}.`;
			}
			if (record.status === 'PART_REDEEMED') {
				const verb = this.isExpired(record) ? 'expired' : 'remaining';
				note += ` ${this.formatMoney(record.amountUnredeemed)} ${verb}.`;
			}
			return note;
		},
	},
};
</script>
