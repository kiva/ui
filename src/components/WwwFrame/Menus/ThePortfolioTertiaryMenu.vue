<template>
	<tertiary-menu>
		<ul>
			<li>
				<router-link
					to="/portfolio"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Portfolio']"
				>
					Portfolio
				</router-link>
			</li>
			<li>
				<router-link
					to="/portfolio/lending-stats"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Lending-stats']"
				>
					Lending stats
				</router-link>
			</li>
			<li>
				<router-link
					to="/portfolio/loans"
					v-kv-track-event="['TertiaryNav','click-MyKiva-My-loans']"
				>
					My loans
				</router-link>
			</li>
			<li>
				<router-link
					to="/portfolio/estimated-repayments"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Estimated-repayments']"
				>
					Estimated repayments
				</router-link>
			</li>
			<li>
				<router-link
					to="/portfolio/credit/deposit"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Add-credit']"
				>
					Add credit
				</router-link>
			</li>
			<li>
				<router-link
					to="/withdraw"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Withdraw']"
				>
					Withdraw
				</router-link>
			</li>
			<li>
				<router-link
					:to="donateCreditUrl"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Donate-credit']"
				>
					Donate credit
				</router-link>
			</li>
			<li v-if="publicId">
				<router-link
					:to="publicLenderUrl"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Public-lender-profile']"
				>
					Public lender profile
				</router-link>
			</li>
			<li>
				<router-link
					to="/portfolio/transactions"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Transaction-history']"
				>
					Transaction history
				</router-link>
			</li>
			<li>
				<router-link
					to="/portfolio/donations"
					v-kv-track-event="['TertiaryNav','click-MyKiva-My-donations']"
				>
					My donations
				</router-link>
			</li>
			<li>
				<router-link
					to="/portfolio/kiva-cards"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Purchases-Kiva-Cards']"
				>
					Purchased Kiva Cards
				</router-link>
			</li>
			<li>
				<router-link
					to="/portfolio/invites"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Invite-friends']"
				>
					Invite friends
				</router-link>
			</li>
			<li>
				<router-link
					to="/portfolio/credit/bonus-history"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Free-credit-history']"
				>
					Free credit history
				</router-link>
			</li>
		</ul>
	</tertiary-menu>
</template>

<script>
import _get from 'lodash/get';
import portfolioTertiaryMenuQuery from '@/graphql/query/portfolioTertiaryMenu.graphql';
import TertiaryMenu from '@/components/WwwFrame/TertiaryMenu';

export default {
	components: { TertiaryMenu },
	inject: ['apollo'],
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
		query: portfolioTertiaryMenuQuery,
		preFetch: true,
		result({ data }) {
			this.userBalance = _get(data, 'my.userAccount.balance');
			this.publicId = _get(data, 'my.userAccount.publicId');
		}
	},
};
</script>
