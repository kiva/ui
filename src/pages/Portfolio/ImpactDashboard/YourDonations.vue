<template>
	<async-portfolio-section @visible="whenVisible" data-testid="your-donations">
		<h3 class="tw-mb-3 md:tw-mb-2 tw-text-center md:tw-text-left">
			Your donations to Kiva
		</h3>
		<kv-grid class="tw-grid-cols-12 tw-p-1.5 tw-rounded tw-bg-marigold-1 tw-gap-y-4">
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 tw-text-center">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" />
				<dt v-show="!loading" class="stat-value">
					{{ averageDonation }}
				</dt>
				<dd class="stat-def">
					Avg. donation per $25 lent
				</dd>
				<button
					class="staf-link" @click="donationLightboxVisible = true"
					v-kv-track-event="['portfolio', 'click', 'avg-donation-details']"
				>
					Details
					<kv-material-icon
						class="tw-ml-0.5 tw-w-2 tw-h-2"
						:icon="mdiArrowRight"
					/>
				</button>
				<kv-lightbox
					class="tw-text-left"
					:visible="donationLightboxVisible" title="Average donation per $25 lent"
					@lightbox-closed="donationLightboxVisible = false"
				>
					<p class="tw-mb-1">
						100% of every dollar lent on Kiva is used to fund loans. Kiva doesn't take a cut of the loans
						made on our website or charge interest to our Lending Partners. Instead, we rely on donations
						from our lender community to cover our operations and expand access to microfinance around the
						globe. This is why we ask for an optional donation each time you make a loan.
					</p>
					<p class="tw-mb-1">
						Whether you are depositing funds to make a loan or relending money that a borrower has paid
						back, please remember that Kiva can't exist without your support.
					</p>
					<template #controls>
						<kv-button
							href="/donate/supportus"
							v-kv-track-event="['portfolio', 'click', 'avg-donation-lightbox-donate']"
						>
							Donate
						</kv-button>
					</template>
				</kv-lightbox>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 tw-text-center">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" />
				<dt v-show="!loading" class="stat-value">
					{{ $filters.numeral(currentYearDonations, '$0,0[.]00') }}
				</dt>
				<dd class="stat-def">
					{{ currentYear }} donations
				</dd>
				<a
					href="/donate/supportus" class="staf-link"
					v-kv-track-event="['portfolio', 'click', 'donate-page']"
				>
					Donate
					<kv-material-icon
						class="tw-ml-0.5 tw-w-2 tw-h-2"
						:icon="mdiArrowRight"
					/>
				</a>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 tw-text-center">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" />
				<dt v-show="!loading" class="stat-value">
					{{ $filters.numeral(lastYearDonations, '$0,0[.]00') }}
				</dt>
				<dd class="stat-def">
					{{ lastYear }} donations
				</dd>
				<a
					v-if="lastYearDonations"
					:href="taxReceiptUrl" class="staf-link"
					target="_blank"
					v-kv-track-event="[
						'portfolio',
						'click',
						`${lastYear}-tax-receipt`]"
				>
					{{ lastYear }} tax receipt
					<kv-material-icon
						class="tw-ml-0.5 tw-w-2 tw-h-2"
						:icon="mdiArrowRight"
					/>
				</a>
			</div>
		</kv-grid>
	</async-portfolio-section>
</template>

<script>
import { gql } from 'graphql-tag';
import numeral from 'numeral';
import { mdiArrowRight } from '@mdi/js';
import {
	KvGrid, KvLightbox, KvButton, KvLoadingPlaceholder, KvMaterialIcon
} from '@kiva/kv-components';
import AsyncPortfolioSection from './AsyncPortfolioSection';

export default {
	name: 'YourDonations',
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvLightbox,
		KvButton,
		KvGrid,
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			averageDonation: 0,
			donationLightboxVisible: false,
			currentDate: new Date(),
			currentYearDonations: 0,
			lastYearDonations: 0,
			lastYear: null,
			currentYear: null,
			taxReceiptUrl: '',
			totalDonations: 0,
			limit: 100,
			mdiArrowRight
		};
	},
	methods: {
		fetchAsyncData() {
			const startDate = (new Date(this.currentDate.getFullYear() - 1, 0, 1)).toISOString();
			const endDate = (new Date(this.currentDate.getFullYear(), 11, 31)).toISOString();

			this.lastYear = this.currentDate.getFullYear() - 1;
			this.currentYear = this.currentDate.getFullYear();
			this.taxReceiptUrl = `https://${this.$appConfig.host}/portfolio/donations/print?year=${this.lastYear}`;

			const transactionFilters = {
				category: 'donation',
				startDate,
				endDate,
			};

			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = this.apollo.query({
					query: gql`query yourDonations ($filters: TransactionSearchFilters, $limit: Int) {
						my {
							id
							transactions(filter: $filters, limit: $limit) {
								totalCount
								values {
									createTime
									amount
								}
							}
							userStats {
								amount_donated
								amount_of_loans
							}
						}
					}`,
					variables: {
						filters: transactionFilters,
						limit: this.limit,
					},
				}).then(async ({ data }) => {
					const currentYear = this.currentDate.getFullYear();
					const transactions = data?.my?.transactions?.values ?? [];
					const amountOfLoans = numeral(data?.my?.userStats?.amount_of_loans ?? 0);
					const donation = numeral(data?.my?.userStats?.amount_donated ?? 0);
					if (amountOfLoans.value() > 0) {
						donation.multiply(1 / amountOfLoans.value()).multiply(25);
					}
					this.averageDonation = donation.format('$0,0[.]00');

					this.totalDonations = data?.my?.transactions?.totalCount ?? 0;
					this.currentYearDonations = this.filterAndSumDonations(transactions, currentYear);
					this.lastYearDonations = this.filterAndSumDonations(transactions, currentYear - 1);

					if (this.totalDonations > this.limit) {
						let offset = this.limit;
						const requests = [];
						while (offset < this.totalDonations) {
							requests.push(this.getRemainingDonations(transactionFilters, offset));
							offset += this.limit;
						}

						// Make all requests and sum remaining donations
						const response = await Promise.all(requests);
						response.forEach(result => {
							const values = result?.data?.my?.transactions?.values ?? [];
							this.currentYearDonations += this.filterAndSumDonations(values, currentYear);
							this.lastYearDonations += this.filterAndSumDonations(values, currentYear - 1);
						});
					}
					this.loading = false;
				}).finally(() => {
					this.loadingPromise = null;
				});
			}
		},
		whenVisible() {
			this.fetchAsyncData();
		},
		getRemainingDonations(transactionFilters, offset) {
			return this.apollo.query({
				query: gql`query yourDonations ($filters: TransactionSearchFilters, $limit: Int, $offset: Int) {
						my {
							id
							transactions(filter: $filters, limit: $limit, offset: $offset) {
								values {
									createTime
									amount
								}
							}
						}
					}`,
				variables: {
					filters: transactionFilters,
					limit: this.limit,
					offset,
				},
			});
		},
		filterAndSumDonations(donations, targetYear) {
			return donations.filter(donation => {
				const donationYear = new Date(donation.createTime).getFullYear();
				return donationYear === targetYear;
			}).reduce((acc, donation) => {
				return acc + donation.amount * -1;
			}, 0);
		}
	},
};
</script>

<style lang="postcss" scoped>
.stat-placeholder {
	margin-bottom: 6px;
	@apply tw-mt-1 tw-h-4.5;

	@screen md {
		height: 44px;
		margin-bottom: 10.5px;
	}
}

@screen lg {
	.stat-placeholder {
		margin-bottom: 11.5px;
		@apply tw-h-6;
	}
}

.stat-value {
	@apply tw-text-h2 tw-text-marigold-3;
}

.stat-def {
	@apply tw-text-base tw-mb-0.5;
}

.staf-link {
	@apply tw-inline-flex tw-text-marigold-3 hover:tw-underline tw-font-medium tw-justify-center tw-items-center;
}
</style>
