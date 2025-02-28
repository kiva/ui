<template>
	<async-portfolio-section @visible="whenVisible" data-testid="credit-stats">
		<h2 class="tw-mb-0.5">
			The Kiva effect
		</h2>
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 lg:tw-col-span-6">
				<kiva-effect-figure :deposit-amount="depositAmount" :lend-amount="lendAmount" :loading="loading" />
			</div>
			<div class="tw-col-span-12 lg:tw-col-span-6">
				<dl class="tw-flex tw-flex-wrap tw-justify-between tw-items-center">
					<dt class="tw-text-h4">
						Total deposits
					</dt>
					<kv-loading-placeholder v-if="loading" style="width: 40px; height: 16px;" />
					<dd v-if="!loading" class="tw-text-action tw-text-h4">
						{{ $filters.numeral(depositAmount, '$0,0.00') }}
					</dd>
					<dd class="tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8">
						The total amount of funds you've deposited into your Kiva account.
					</dd>
					<dt class="tw-text-h4">
						Total amount lent
					</dt>
					<kv-loading-placeholder v-if="loading" style="width: 56px; height: 16px;" />
					<dd v-if="!loading" class="tw-text-brand tw-text-h4">
						{{ $filters.numeral(lendAmount, '$0,0.00') }}
					</dd>
					<dd class="tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8">
						The total amount of funds you've lent to borrowers.
						This includes loans made using repaid Kiva credit.
					</dd>
				</dl>
				<credit-summary-lightbox v-if="showCreditSummary" />
			</div>
		</kv-grid>
	</async-portfolio-section>
</template>

<script>
import { gql } from 'graphql-tag';
import numeral from 'numeral';
import { defineAsyncComponent } from 'vue';
import getCacheKey from '#src/util/getCacheKey';
import { KvGrid, KvLoadingPlaceholder } from '@kiva/kv-components';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import KivaEffectFigure from './KivaEffectFigure';

const CreditSummaryLightbox = defineAsyncComponent(() => import('./CreditSummaryLightbox'));

export default {
	name: 'KivaCreditStats',
	serverCacheKey: () => getCacheKey('KivaCreditStats'),
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		CreditSummaryLightbox,
		KivaEffectFigure,
		KvGrid,
		KvLoadingPlaceholder,
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			depositAmount: 25,
			lendAmount: 1000,
			showCreditSummary: false,
		};
	},
	methods: {
		fetchAsyncData() {
			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = this.apollo.query({
					query: gql`query kivaCreditStats {
						my {
							id
							lendingStats {
								id
								totalAmountDeposited
							}
							userStats {
								amount_of_loans
							}
						}
					}`
				}).then(({ data }) => {
					this.loading = false;
					this.depositAmount = numeral(data?.my?.lendingStats?.totalAmountDeposited ?? 0).value();
					this.lendAmount = numeral(data?.my?.userStats?.amount_of_loans ?? 0).value();
				}).finally(() => {
					this.loadingPromise = null;
				});
			}
		},
		whenVisible() {
			this.showCreditSummary = true;
			this.fetchAsyncData();
		}
	},
};
</script>
