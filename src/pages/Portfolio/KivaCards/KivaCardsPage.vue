<template>
	<WwwPage main-class="tw-bg-secondary tw-pb-3">
		<template #secondary>
			<TheMyKivaSecondaryMenu />
		</template>
		<KvPageContainer>
			<KvGrid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
				<ThePortfolioTertiaryMenu class="tw-col-span-3 tw-hidden md:tw-block tw-pt-2" />
				<div class="tw-col-span-12 md:tw-col-span-9 tw-pt-1.5 md:tw-pt-3">
					<!-- Intro / hero -->
					<div class="tw-rounded-none md:tw-rounded tw-py-3 tw-px-2 md:tw-px-3 md:tw-bg-primary">
						<h1 class="tw-text-display tw-mb-2">
							Kiva Cards
						</h1>
						<KvGrid class="tw-grid-cols-12 tw-gap-2 tw-items-center">
							<div class="tw-col-span-6 sm:tw-col-span-2">
								<a
									href="/gifts/kiva-cards"
									v-kv-track-event="['portfolio', 'click', 'Kiva Cards hero purchase']"
								>
									<img
										:src="heroImageUrl"
										alt="Kiva Card"
										class="tw-w-full tw-rounded"
										width="280"
										height="174"
									>
								</a>
							</div>
							<div class="tw-col-span-12 sm:tw-col-span-10">
								<p class="tw-mb-1">
									Kiva Cards are the perfect gift for any occasion! Buy one today and give someone
									the power to change lives.
								</p>
								<p class="tw-text-small tw-flex tw-gap-1 tw-items-center">
									<a
										v-if="canWithdraw"
										href="/gifts/kiva-cards"
										class="tw-no-underline"
										v-kv-track-event="['portfolio', 'click', 'Purchase Kiva Card']"
									>Purchase</a>
									<span v-if="canWithdraw" aria-hidden="true">|</span>
									<a
										href="/redeem"
										class="tw-no-underline"
										v-kv-track-event="['portfolio', 'click', 'How to redeem Kiva Card']"
									>How to Redeem</a>
									<span aria-hidden="true">|</span>
									<a
										href="/help"
										class="tw-no-underline"
										v-kv-track-event="['portfolio', 'click', 'Kiva Cards help']"
									>Need Help?</a>
								</p>
							</div>
						</KvGrid>
					</div>

					<!-- Listing -->
					<div class="tw-rounded-none md:tw-rounded tw-py-3 tw-px-2 md:tw-px-3 md:tw-mt-3 tw-bg-primary">
						<!-- Non-withdrawable warning -->
						<p
							v-if="!loading && !canWithdraw"
							class="tw-font-medium"
							:class="{ 'tw-mb-2': hasCards }"
						>
							Your account is non-withdrawable. This type of account must not purchase Kiva Cards.
						</p>

						<!-- Count -->
						<template v-if="loading || hasCards">
							<p v-if="!loading" class="tw-font-medium tw-mb-2">
								{{ total }} Kiva Cards purchased
							</p>
							<KvLoadingPlaceholder v-else class="tw-mb-2" style="width: 12rem; height: 1rem;" />
						</template>

						<!-- Export + sort -->
						<div
							v-if="loading || hasCards"
							class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-mb-1"
						>
							<KvButton
								v-if="!loading && hasCards"
								href="/portfolio/kiva-cards?export_excel=1"
								variant="primary"
								v-kv-track-event="['portfolio', 'click', 'Export Kiva Cards']"
							>
								Export
							</KvButton>
							<label class="tw-flex tw-items-center tw-gap-1 tw-text-small">
								<span class="tw-shrink-0">Sort by:</span>
								<KvSelect
									id="kiva-cards-sort"
									class="data-hj-suppress"
									:model-value="sortBy"
									:disabled="loading"
									aria-label="Sort Kiva Cards by"
									@update:model-value="handleSortChange"
								>
									<option
										v-for="option in sortOptions"
										:key="option.value"
										:value="option.value"
									>
										{{ option.label }}
									</option>
								</KvSelect>
							</label>
						</div>

						<div ref="listTop">
							<KivaCardList
								:cards="cards"
								:loading="loading"
								:has-error="loadError"
								:can-withdraw="canWithdraw"
							/>
						</div>

						<KvPagination
							v-if="showPagination"
							class="tw-mt-3"
							:class="{ 'tw-pointer-events-none tw-opacity-low': loading }"
							:limit="limit"
							:offset="offset"
							:aria-disabled="loading ? 'true' : undefined"
							:scroll-to-top="false"
							:total="total"
							@page-changed="handlePageChange"
						/>
					</div>
				</div>
			</KvGrid>
		</KvPageContainer>
	</WwwPage>
</template>

<script>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import {
	KvPageContainer,
	KvGrid,
	KvPagination,
	KvSelect,
	KvButton,
	KvLoadingPlaceholder,
} from '@kiva/kv-components';
import logFormatter from '#src/util/logFormatter';
import KivaCardList from '#src/components/Portfolio/KivaCardList';
import kCardHeroImage from '#src/assets/images/gifts/kCardLarge.jpg';
import myKivaCardsQuery from '#src/graphql/query/portfolio/myKivaCards.graphql';

const PAGE_LIMIT = 10;

const SORT_OPTIONS = [
	{ value: 'amount', label: 'Amount' },
	{ value: 'code', label: 'Code' },
	{ value: 'purchasedDate', label: 'Purchased on Date' },
	{ value: 'redeemedBy', label: 'Redeemed by' },
	{ value: 'redeemedDate', label: 'Redeemed on Date' },
];

export default {
	name: 'KivaCardsPage',
	inject: ['apollo'],
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		KvPageContainer,
		KvGrid,
		KvPagination,
		KvSelect,
		KvButton,
		KvLoadingPlaceholder,
		KivaCardList,
	},
	data() {
		return {
			// Bundled via Vite so the hero resolves in local dev and prod (hashed asset URL).
			heroImageUrl: kCardHeroImage,
			sortOptions: SORT_OPTIONS,
			cards: [],
			total: 0,
			canWithdraw: false,
			loading: true,
			// Set when a fetch rejects so the list shows a distinct error state.
			loadError: false,
			offset: 0,
			limit: PAGE_LIMIT,
			sortBy: 'purchasedDate',
			// Guards against stale responses landing out of order after a page/sort change.
			requestSequence: 0,
		};
	},
	computed: {
		showPagination() {
			return this.total > this.limit;
		},
		hasCards() {
			return this.cards.length > 0;
		},
	},
	mounted() {
		this.fetchKivaCards();
	},
	methods: {
		fetchKivaCards({ clearCards = false } = {}) {
			const sequence = this.requestSequence + 1;
			this.requestSequence = sequence;
			this.loading = true;
			this.loadError = false;
			if (clearCards) {
				this.cards = [];
			}
			return this.apollo.query({
				query: myKivaCardsQuery,
				variables: {
					offset: this.offset,
					limit: this.limit,
					sortBy: this.sortBy,
				},
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				if (sequence !== this.requestSequence) {
					return;
				}
				const result = data?.my?.userAccount?.purchasedKivaCards;
				this.cards = result?.values ?? [];
				this.total = result?.total ?? 0;
				this.canWithdraw = result?.canWithdraw ?? true;
			}).catch(error => {
				if (sequence !== this.requestSequence) {
					return;
				}
				this.loadError = true;
				logFormatter(`Error fetching Kiva Cards: ${error}`, 'error');
			}).finally(() => {
				if (sequence === this.requestSequence) {
					this.loading = false;
				}
			});
		},
		handlePageChange({ pageOffset }) {
			if (this.loading) {
				return undefined;
			}
			this.offset = pageOffset;
			this.scrollToTop();
			return this.fetchKivaCards({ clearCards: true });
		},
		handleSortChange(value) {
			if (this.loading || value === this.sortBy) {
				return undefined;
			}
			this.sortBy = value;
			this.offset = 0;
			return this.fetchKivaCards({ clearCards: true });
		},
		scrollToTop() {
			this.$refs.listTop?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		},
	},
};
</script>
