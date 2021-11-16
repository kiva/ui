<template>
	<www-page
		:header-theme="headerTheme"
	>
		<!-- Auto Deposit Thanks Page -->
		<div class="row align-center auto-deposit-thanks-page text-center">
			<div class="small-12 medium-11 large-8 column">
				<h1 class="text-center impact-text">
					<kv-icon name="confirmation" class="icon-confirmation" /> Thanks!
				</h1>

				<p>
					Every month your balance will grow by ${{ autoDepositAmount }}!<br>
					<span v-if="donationAmount > 0">
						<em>You’re also making a ${{ donationAmount }} donation to Kiva each month – thank you!</em>
					</span>
				</p>

				<p class="auto-deposit-thanks-page__email-message">
					<kv-icon class="icon-email" name="email" />
					You’ll get an email after each deposit so you can make more loans.
				</p>

				<div class="panel">
					<p>
						<strong>Auto lending is the fastest way to lend your balance</strong><br>
						<router-link to="/settings/autolending">
							Define your criteria
						</router-link>
					</p>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import numeral from 'numeral';
import { lightHeader } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvIcon from '@/components/Kv/KvIcon';

const pageQuery = gql`query autoDepositThanksPage {
	my {
		autoDeposit {
			id
			amount
			donateAmount
		}
	}
}`;

export default {
	components: {
		WwwPage,
		KvIcon,
	},
	props: { },
	data() {
		return {
			totalAmount: 0,
			donationAmount: 0,
			autoDepositAmount: 0,
			headerTheme: lightHeader,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			const isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber;
			const autoDepositId = data?.my?.autoDeposit?.id;
			this.isAutoDepositSubscriber = !isMonthlyGoodSubscriber && autoDepositId;

			if (!this.isAutoDepositSubscriber) {
				this.$router.push({ path: '/auto-deposit' }).catch({});
			}
			this.totalAmount = numeral(data?.my?.autoDeposit?.amount || 0).format('0.00');
			this.donationAmount = numeral(data?.my?.autoDeposit?.donateAmount || 0).format('0.00');
			this.autoDepositAmount = this.totalAmount - this.donationAmount;
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.auto-deposit-thanks-page {
	padding-top: 4rem;

	h1 { margin-bottom: 1rem; }

	.icon-confirmation,
	.icon-email {
		height: 3rem;
		width: 3rem;
		color: $kiva-green;
		fill: $kiva-green;
		vertical-align: middle;
		margin-top: -0.65rem;
	}

	.icon-email {
		display: block;
		margin: 0 auto;
	}

	.panel {
		border: 1px solid $light-gray;
		padding: 1rem 1rem 0;
		background-color: $platinum;
		margin: 2rem auto;
	}

	&__email-message {
		margin-top: 2.5rem;
	}
}
</style>
