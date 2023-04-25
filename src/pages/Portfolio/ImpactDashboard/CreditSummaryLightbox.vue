<template>
	<div>
		<kv-text-link
			:icon="mdiFileDocumentOutline"
			@click="openLightbox"
			v-kv-track-event="['portfolio', 'click', 'credit-stats-details']"
		>
			Details
		</kv-text-link>
		<kv-lightbox
			:visible="showLightbox"
			title="Account balance sheet"
			@lightbox-closed="closeLightbox"
			data-testid="credit-summary"
			class="credit-summary"
		>
			<p class="tw-text-small tw-text-secondary tw-mb-2">
				Please note, summary data may be up to one hour old.
			</p>
			<table class="tw-w-full tw-mb-4">
				<caption class="tw-sr-only">
					Deposits
				</caption>
				<thead class="tw-sr-only">
					<tr>
						<th>Deposit type</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr class="tw-text-h3">
						<td class="tw-py-1">
							Total deposits
						</td>
						<td class="tw-p-1 tw-text-right tw-text-action">
							<kv-loading-placeholder v-if="loading" class="header-amount-placeholder" />
							<span v-else>{{ formatCash(depositSubTotal) }}</span>
						</td>
					</tr>
					<template v-for="deposit in deposits">
						<tr
							v-if="!deposit.hideWhenZero || deposit.value !== 0"
							:key="deposit.label"
							class="amount-table-row"
						>
							<td>{{ deposit.label }}</td>
							<td>
								<kv-loading-placeholder v-if="loading" class="amount-placeholder" />
								<span v-else>{{ formatCash(deposit.value) }}</span>
							</td>
						</tr>
					</template>
				</tbody>
			</table>
			<table class="tw-w-full tw-mb-4">
				<caption class="tw-sr-only">
					Deductions
				</caption>
				<thead class="tw-sr-only">
					<tr>
						<th>Deduction type</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr class="tw-text-h3">
						<td class="tw-py-1">
							Total deductions
						</td>
						<td class="tw-p-1 tw-text-right tw-text-danger">
							<kv-loading-placeholder v-if="loading" class="header-amount-placeholder" />
							<span v-else>{{ formatCash(deductionSubTotal) }}</span>
						</td>
					</tr>
					<template v-for="deduction in deductions">
						<tr
							v-if="!deduction.hideWhenZero || deduction.value !== 0"
							:key="deduction.label"
							class="amount-table-row"
						>
							<td>{{ deduction.label }}</td>
							<td>
								<kv-loading-placeholder v-if="loading" class="amount-placeholder" />
								<span v-else>{{ formatCash(deduction.value) }}</span>
							</td>
						</tr>
					</template>
				</tbody>
			</table>
			<table class="tw-w-full">
				<caption class="tw-sr-only">
					Current credits
				</caption>
				<thead class="tw-sr-only">
					<tr>
						<th>Credit type</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr class="tw-text-h3">
						<td class="tw-py-1">
							Total credit in Kiva
						</td>
						<td class="tw-p-1 tw-text-right">
							<kv-loading-placeholder v-if="loading" class="header-amount-placeholder" />
							<span v-else>{{ formatCash(totalCreditInKiva) }}</span>
						</td>
					</tr>
					<tr class="amount-table-row">
						<td>
							Outstanding balance
							<span v-if="promoOutstanding > 0">
								(minus {{ formatCash(promoOutstanding) }} promo credit balance)
							</span>
						</td>
						<td>
							<kv-loading-placeholder v-if="loading" class="amount-placeholder" />
							<span v-else>{{ formatCash(amountOutstanding) }}</span>
						</td>
					</tr>
					<tr class="amount-table-row">
						<td>Kiva credit</td>
						<td>
							<kv-loading-placeholder v-if="loading" class="amount-placeholder" />
							<span v-else>{{ formatCash(kivaCredit) }}</span>
						</td>
					</tr>
				</tbody>
			</table>
		</kv-lightbox>
	</div>
</template>

<script>
import { gql } from '@apollo/client';
import { mdiFileDocumentOutline } from '@mdi/js';
import numeral from 'numeral';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

const asNumber = value => numeral(value ?? 0).value();

export default {
	name: 'CreditSummaryLightbox',
	inject: ['apollo'],
	components: {
		KvLightbox,
		KvLoadingPlaceholder,
		KvTextLink,
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			mdiFileDocumentOutline,
			showLightbox: false,

			// Deposits
			totalAmountDeposited: 0,
			amountDepositedByKiva: 0,
			kivaCardsRedeemedAmount: 0,
			kivaCardsCanceledAmount: 0,
			currencyGainsAmount: 0,

			// Deductions
			amountDonated: 0,
			currencyLossesAmount: 0,
			defaultLossesAmount: 0,
			kivaCardsPurchasedAmount: 0,
			amountWithdrawn: 0,

			// Current credit
			amountOutstanding: 0,
			promoOutstanding: 0,
			kivaCredit: 0,
		};
	},
	computed: {
		deposits() {
			return [
				{
					label: 'Your deposits',
					value: this.totalAmountDeposited,
				},
				{
					label: 'Deposits by Kiva',
					value: this.amountDepositedByKiva,
					hideWhenZero: true,
				},
				{
					label: 'Kiva Card redemptions',
					value: this.kivaCardsRedeemedAmount,
				},
				{
					label: 'Kiva Card cancellations',
					value: this.kivaCardsCanceledAmount,
				},
				{
					label: 'Currency loss reimbursements',
					value: this.currencyGainsAmount,
				},
			];
		},
		deductions() {
			return [
				{
					label: 'Donations to Kiva',
					value: this.amountDonated,
				},
				{
					label: 'Currency losses',
					value: this.currencyLossesAmount,
				},
				{
					label: 'Default losses',
					value: this.defaultLossesAmount,
				},
				{
					label: 'Kiva Card purchases',
					value: this.kivaCardsPurchasedAmount,
				},
				{
					label: 'Withdrawals',
					value: this.amountWithdrawn,
				},
			];
		},
		depositSubTotal() {
			// sum of all deposits
			return this.deposits.reduce((total, { value }) => total + value, 0);
		},
		deductionSubTotal() {
			// sum of all deductions
			return this.deductions.reduce((total, { value }) => total + value, 0);
		},
		totalCreditInKiva() {
			// assuming deductionSubTotal is negative
			return this.depositSubTotal + this.deductionSubTotal;
		},
	},
	methods: {
		openLightbox() {
			this.showLightbox = true;
			this.fetchAsyncData();
		},
		closeLightbox() {
			this.showLightbox = false;
		},
		formatCash(value) {
			return numeral(value).format('$0,0.00');
		},
		fetchAsyncData() {
			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = this.apollo.query({
					query: gql`query creditSummary {
						my {
							id
							amountDonated
							amountWithdrawn
							amountDepositedByKiva
							currencyGainsAmount
							currencyLossesAmount
							defaultLossesAmount
							outstandingPromoCreditAmount
							kivaCardsCanceledAmount
							kivaCardsPurchasedAmount
							kivaCardsRedeemedAmount
							lendingStats {
								id
								totalAmountDeposited
							}
							userAccount {
								id
								balance
							}
							userStats {
								amount_outstanding
							}
						}
					}`
				}).then(({ data }) => {
					this.loading = false;

					this.totalAmountDeposited = asNumber(data?.my?.lendingStats?.totalAmountDeposited);
					this.amountDepositedByKiva = asNumber(data?.my?.amountDepositedByKiva);
					this.kivaCardsRedeemedAmount = asNumber(data?.my?.kivaCardsRedeemedAmount);
					this.kivaCardsCanceledAmount = asNumber(data?.my?.kivaCardsCanceledAmount);
					this.currencyGainsAmount = asNumber(data?.my?.currencyGainsAmount);

					this.amountDonated = asNumber(data?.my?.amountDonated);
					this.currencyLossesAmount = asNumber(data?.my?.currencyLossesAmount);
					this.defaultLossesAmount = asNumber(data?.my?.defaultLossesAmount);
					this.kivaCardsPurchasedAmount = asNumber(data?.my?.kivaCardsPurchasedAmount);
					this.amountWithdrawn = asNumber(data?.my?.amountWithdrawn);

					this.kivaCredit = asNumber(data?.my?.userAccount?.balance);
					this.amountOutstanding = asNumber(data?.my?.userStats?.amount_outstanding);
					this.promoOutstanding = asNumber(data?.my?.outstandingPromoCreditAmount);
				}).finally(() => {
					this.loadingPromise = null;
				});
			}
		},
	},
};
</script>

<style lang="postcss" scoped>
.amount-table-row {
	@apply even:tw-bg-secondary;
}

.amount-table-row td {
	@apply tw-px-1 tw-py-0.5 last:tw-text-right;
}

.amount-placeholder {
	@apply tw-float-right tw-h-2 tw-w-5;
}

.header-amount-placeholder {
	@apply tw-float-right tw-h-2.5 tw-w-7;
}

@screen md {
	/* lightbox body */
	.credit-summary >>> [role=dialog] {
		min-width: 32rem;
	}
}

@screen lg {
	/* lightbox body */
	.credit-summary >>> [role=dialog] {
		min-width: 40rem;
	}

	.amount-placeholder {
		@apply tw-h-2.5 tw-w-6;
	}

	.header-amount-placeholder {
		@apply tw-h-3.5 tw-w-9;
	}
}
</style>
