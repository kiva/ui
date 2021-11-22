<template>
	<www-page>
		<kv-default-wrapper>
			<!-- Auto Deposit Thanks Page -->
			<div class="row align-center auto-deposit-thanks-page tw-text-center">
				<div class="small-12 medium-11 large-8 column">
					<h1 class="tw-mb-4 tw-flex tw-gap-1 tw-items-center tw-justify-center">
						<kv-material-icon
							:icon="mdiCheckboxMarkedCircle"
							class="tw-h-6 tw-w-6 tw-text-brand tw-fill-current"
						/>
						<span>Thanks!</span>
					</h1>
					<p class="tw-mb-4">
						Every month your balance will grow by ${{ autoDepositAmount }}!
						<template v-if="donationAmount > 0">
							<br>
							<em>You’re also making a ${{ donationAmount }} donation to Kiva each month – thank you!</em>
						</template>
					</p>
					<kv-material-icon
						:icon="mdiEmailOutline"
						class="tw-h-6 tw-w-6 tw-mb-1 tw-text-brand tw-fill-current"
					/>
					<p class="tw-mb-4">
						You’ll get an email after each deposit so you can make more loans.
					</p>
					<div class="tw-border tw-border-tertiary tw-bg-secondary tw-p-2">
						<p class="tw-font-medium">
							Auto lending is the fastest way to lend your balance
						</p>
						<router-link to="/settings/autolending">
							Define your criteria
						</router-link>
					</div>
				</div>
			</div>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import numeral from 'numeral';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import { mdiCheckboxMarkedCircle, mdiEmailOutline } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

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
		KvDefaultWrapper,
		KvMaterialIcon,
	},
	props: { },
	data() {
		return {
			totalAmount: 0,
			donationAmount: 0,
			autoDepositAmount: 0,
			mdiCheckboxMarkedCircle,
			mdiEmailOutline,
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
