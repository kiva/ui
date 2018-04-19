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
			<li v-if="publicLenderName">
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
import TertiaryMenu from '@/components/WwwFrame/TertiaryMenu';

export default {
	components: { TertiaryMenu },
	data() {
		return {
			publicLenderName: 'myName'
		};
	},
	computed: {
		// donateCreditAmount() {
		// 	return 0;
		// },
		donateCreditUrl() {
			return {
				path: '/donate/supportusprocess',
				query: {
					// donationAmount: context.donateCreditAmount
					donationAmount: 10
				}
			};
		},
		publicLenderUrl() {
			return {
				path: `/lender/${this.publicLenderName}`
				// path: '/lender/myName'
			};
		}
	}
};
</script>

