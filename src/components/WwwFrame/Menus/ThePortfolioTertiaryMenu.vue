<template>
	<ul class="tw-font-medium">
		<li>
			<router-link
				to="/portfolio"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-My-impact']"
			>
				My impact
			</router-link>
		</li>
		<li>
			<router-link
				to="/portfolio/lending-stats"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Lending-stats']"
			>
				Lending stats
			</router-link>
		</li>
		<li>
			<router-link
				to="/portfolio/loans"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-My-loans']"
			>
				My loans
			</router-link>
		</li>
		<li>
			<router-link
				to="/portfolio/estimated-repayments"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Estimated-repayments']"
			>
				Estimated repayments
			</router-link>
		</li>
		<li>
			<router-link
				to="/portfolio/credit/deposit"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Add-credit']"
			>
				Add credit
			</router-link>
		</li>
		<li>
			<router-link
				to="/withdraw"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Withdraw']"
			>
				Withdraw
			</router-link>
		</li>
		<li>
			<router-link
				:to="donateCreditUrl"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Donate-credit']"
			>
				Donate credit
			</router-link>
		</li>
		<li v-if="publicId">
			<router-link
				:to="publicLenderUrl"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Public-lender-profile']"
			>
				Public lender profile
			</router-link>
		</li>
		<li>
			<router-link
				to="/portfolio/transactions"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Transaction-history']"
			>
				Transaction history
			</router-link>
		</li>
		<li>
			<router-link
				to="/portfolio/donations"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-My-donations']"
			>
				My donations
			</router-link>
		</li>
		<li>
			<router-link
				to="/portfolio/kiva-cards"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Purchases-Kiva-Cards']"
			>
				Purchased Kiva Cards
			</router-link>
		</li>
		<li>
			<router-link
				to="/portfolio/invites"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Invite-friends']"
			>
				Invite friends
			</router-link>
		</li>
		<li>
			<router-link
				to="/portfolio/credit/bonus-history"
				class="portfolio-tertitary-menu-link"
				exact-active-class="portfolio-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Free-credit-history']"
			>
				Free credit history
			</router-link>
		</li>
	</ul>
</template>

<script>
import { gql } from '@apollo/client';

export default {
	name: 'ThePortfolioTertiaryMenu',
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			userBalance: 0,
			publicId: '',
		};
	},
	computed: {
		donateCreditUrl() {
			return {
				path: '/donate/supportusprocess',
				query: {
					donationAmount: this.userBalance
				}
			};
		},
		publicLenderUrl() {
			return {
				path: `/lender/${this.publicId}`
			};
		}
	},
	apollo: {
		query: gql`query portfolioTertiaryMenu {
			my {
				id
				userAccount {
					id
					publicId
					balance
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.userBalance = data?.my?.userAccount?.balance ?? 0;
			this.publicId = data?.my?.userAccount?.publicId ?? '';
		}
	},
};
</script>

<style lang="postcss" scoped>
.portfolio-tertitary-menu-link {
	@apply tw-block tw-py-1 tw-w-full;
}

.portfolio-tertitary-menu-active-link {
	@apply tw-text-tertiary hover:tw-text-tertiary hover:tw-no-underline;
}
</style>
