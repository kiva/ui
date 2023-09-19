<template>
	<section class="tw-mb-3 tw-px-2 tw-rounded md:tw-bg-primary md:tw-p-3" data-testid="account-overview">
		<h1 class="tw-text-h3 tw-mb-2">
			Account overview
		</h1>
		<kv-grid class="tw-grid-cols-12">
			<dl
				class="
					tw-grid
					tw-gap-2 md:tw-gap-x-3 lg:tw-gap-x-3.5
					tw-grid-cols-12
					tw-col-span-12 lg:tw-col-span-8
				"
			>
				<div class="tw-col-span-6">
					<dt class="tw-text-h4">
						Available to lend
					</dt>
					<kv-loading-placeholder
						v-if="loading"
						class="placeholder tw-my-0.5 lg:tw-my-1"
						style="width: 6rem;"
					/>
					<dd v-else class="tw-text-h2 tw-text-brand">
						{{ availableBalance | numeral('$0,0.00') }}
					</dd>
					<dd v-if="promoBalance > 0" class="tw-text-small tw-text-secondary">
						{{ balance | numeral('$0,0.00') }} + {{ promoBalance | numeral('$0,0[.]00') }} free Kiva credit
					</dd>
				</div>
				<div class="tw-col-span-6">
					<dt class="tw-text-h4">
						Outstanding loans
					</dt>
					<kv-loading-placeholder
						v-if="loading"
						class="placeholder tw-my-0.5 lg:tw-my-1"
						style="width: 6rem;"
					/>
					<dd v-else class="tw-text-h2 tw-text-secondary">
						{{ amountOutstanding | numeral('$0,0.00') }}
					</dd>
				</div>
			</dl>
			<kv-button
				class="tw-col-span-12 lg:tw-col-span-4"
				to="/lend-by-category"
				v-kv-track-event="['portfolio', 'click', 'find-a-loan']"
			>
				Find a loan
			</kv-button>
		</kv-grid>
	</section>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import getCacheKey from '@/util/getCacheKey';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'AccountOverview',
	serverCacheKey: () => getCacheKey('AccountOverview'),
	inject: ['apollo', 'cookieStore'],
	components: {
		KvButton,
		KvGrid,
		KvLoadingPlaceholder,
	},
	data() {
		return {
			loading: true,
			amountOutstanding: 0,
			balance: 0,
			promoBalance: 0,
		};
	},
	computed: {
		availableBalance() {
			return this.balance + this.promoBalance;
		},
	},
	apollo: {
		query: gql`query accountOverview {
			my {
				id
				userStats {
					amount_outstanding
				}
				userAccount {
					id
					balance
					promoBalance
				}
			}
		}`,
		result({ data }) {
			this.amountOutstanding = numeral(data?.my?.userStats?.amount_outstanding ?? 0).value();
			this.balance = numeral(data?.my?.userAccount?.balance ?? 0).value();
			this.promoBalance = numeral(data?.my?.userAccount?.promoBalance ?? 0).value();
			this.loading = false;
		},
	},
};
</script>

<style lang="postcss" scoped>
.placeholder {
	height: 22px;
}

@screen md {
	.placeholder {
		height: 27px;
	}
}

@screen lg {
	.placeholder {
		height: 32px;
	}
}
</style>
