<template>
	<async-portfolio-section @visible="fetchAsyncData">
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
						{{ depositAmount | numeral('$0,0.00') }}
					</dd>
					<dd class="tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8">
						The total amount of funds you've deposited into your Kiva account.
					</dd>
					<dt class="tw-text-h4">
						Total amount lent
					</dt>
					<kv-loading-placeholder v-if="loading" style="width: 56px; height: 16px;" />
					<dd v-if="!loading" class="tw-text-brand tw-text-h4">
						{{ lendAmount | numeral('$0,0.00') }}
					</dd>
					<dd class="tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8">
						The total amount of funds you've lent to borrowers.
						This includes loans made using repaid Kiva credit.
					</dd>
				</dl>
				<kv-text-link :icon="mdiFileDocumentOutline" @click="showCreditSummary = true">
					Details
				</kv-text-link>
				<credit-summary-lightbox v-if="false" />
			</div>
		</kv-grid>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import { mdiFileDocumentOutline } from '@mdi/js';
import numeral from 'numeral';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import KivaEffectFigure from './KivaEffectFigure';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

const CreditSummaryLightbox = () => import('./CreditSummaryLightbox');

export default {
	name: 'KivaCreditStats',
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		CreditSummaryLightbox,
		KivaEffectFigure,
		KvGrid,
		KvLoadingPlaceholder,
		KvTextLink,
	},
	data() {
		return {
			loading: true,
			depositAmount: 25,
			lendAmount: 1000,
			mdiFileDocumentOutline,
			showCreditSummary: false,
		};
	},
	methods: {
		fetchAsyncData() {
			if (this.loading) {
				this.apollo.query({
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
				});
			}
		},
	},
};
</script>
