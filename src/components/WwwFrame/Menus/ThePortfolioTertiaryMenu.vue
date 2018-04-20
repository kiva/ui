<template>
	<tertiary-menu>
		<ul>
			<li><router-link to="/portfolio">Portfolio</router-link></li>
			<li><router-link to="/portfolio/lending-stats-vue">Lending stats</router-link></li>
			<li><router-link to="/portfolio/loans">My loans</router-link></li>
			<li><router-link to="/portfolio/estimated-repayments">Estimated repayments</router-link></li>
			<li><router-link to="/portfolio/credit/deposit">Add credit</router-link></li>
			<li><router-link to="/withdraw">Withdraw</router-link></li>
			<li><router-link :to="donateCreditUrl">Donate credit</router-link></li>
			<li v-if="publicId">
				<router-link :to="publicLenderUrl">Public lender profile</router-link>
			</li>
			<li><router-link to="/portfolio/transactions">Transaction history</router-link></li>
			<li><router-link to="/portfolio/donations">My donations</router-link></li>
			<li><router-link to="/portfolio/kiva-cards">Purchased Kiva Cards</router-link></li>
			<li><router-link to="/portfolio/invites">Invite friends</router-link></li>
			<li><router-link to="/portfolio/credit/bonus-history">Free credit history</router-link></li>
		</ul>
	</tertiary-menu>
</template>

<script>
import { mapState } from 'vuex';

import TertiaryMenu from '@/components/WwwFrame/TertiaryMenu';

export default {
	components: { TertiaryMenu },
	computed: {
		...mapState({
			userBalance: state => state.my.userAccount.balance,
			publicId: state => state.my.userAccount.publicId
		}),
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
	asyncData({ store }) {
		return store.dispatch('getPortfolioTertiaryMenu');
	}
};
</script>

