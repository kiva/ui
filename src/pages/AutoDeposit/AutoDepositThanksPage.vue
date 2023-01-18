<template>
	<www-page>
		<kv-default-wrapper class="tw-bg-secondary">
			<kv-grid class="tw-grid-cols-12">
				<div
					class="
					tw-col-span-12 md:tw-col-span-10 lg:tw-col-span-8
					md:tw-col-start-2 lg:tw-col-start-3
					auto-deposit-thanks-page"
				>
					<!-- Auto Deposit Thanks Page -->
					<div class="tw-my-3">
						<img
							class="tw-mx-auto"
							:src="imageRequire(`./thumbs-up.svg`)"
							alt="loan to loan relending graphic"
						>
					</div>
					<h1 class="tw-mb-3 tw-text-center">
						<span>Thank you!</span>
					</h1>
					<p class="tw-text-subhead tw-mb-3 tw-text-left md:tw-text-center">
						Thanks for being a part of our community and keeping the momentum going.
					</p>
					<p class="tw-mb-3 tw-text-left md:tw-text-center">
						Now, your balance will grow by ${{ autoDepositAmount }} every month.
						We’ll email you when you have enough balance to support more borrowers.
						<template v-if="donationAmount > 0">
							<br>
							<em>You’re also making a ${{ donationAmount }}
								donation to Kiva each month – thank you!</em>
						</template>
					</p>
					<div class="tw-mb-3">
						<img
							class="tw-mx-auto"
							:src="imageRequire(`./email-opening.svg`)"
							alt="loan to loan relending graphic"
						>
					</div>
					<div
						class="tw-bg-white tw-p-3.5 tw-rounded tw-mx-auto"
						style="max-width: 35rem;"
					>
						<p class="tw-text-center">
							Auto-lending is the fastest way to fund borrowers
							<br>
							<router-link
								class="tw-underline"
								to="/settings/autolending"
								v-kv-track-event="[
									'Auto-deposit',
									'click-Define-auto-lend-settings',
									'Define your criteria'
								]"
							>
								Define your criteria
							</router-link>
						</p>
					</div>
				</div>
			</kv-grid>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

const imageRequire = require.context('@/assets/images/kiva-classic-illustrations/', true);

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
	name: 'AutoDepositThanksPage',
	components: {
		WwwPage,
		KvDefaultWrapper,
		KvGrid,
	},
	props: { },
	data() {
		return {
			totalAmount: 0,
			donationAmount: 0,
			autoDepositAmount: 0,
			imageRequire,
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
