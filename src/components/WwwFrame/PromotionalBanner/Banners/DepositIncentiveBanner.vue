<template>
	<generic-promo-banner
		class="tw-text-center"
		:promo-banner-content="promoBannerContent"
		:enable-deposit-incentive-exp="isLoggedin"
		:progress-bar-value="basketTotal"
		:amount-to-lend="amountToLend"
	/>
</template>

<script>
import GenericPromoBanner from '@/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';
import numeral from 'numeral';
import { gql } from '@apollo/client';

const amountToLendQuery = gql`
	query amountToLendQuery ($basketId: String) {
		shop (basketId: $basketId) {
			id
			basket {
				id
				totals {
					loanReservationTotal
				}
			}
		}
		my {
			id
			depositIncentiveAmountToLend
		}
	}
`;

export default {
	name: 'DepositIncentiveBanner',
	components: {
		GenericPromoBanner,
	},
	data() {
		return {
			amountToLend: 0,
			isLoggedin: false,
			basketTotal: 0,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: amountToLendQuery,
		preFetch: true,
		result({ data }) {
			this.amountToLend = data?.my?.depositIncentiveAmountToLend ?? 0;
			this.isLoggedin = !!data?.my?.id ?? false;
			this.basketTotal = parseFloat(data.shop?.basket?.totals?.loanReservationTotal ?? 0);
		},
	},
	computed: {
		promoBannerContent() {
			const richText = this.isLoggedin
				? `Just for you! Lend ${numeral(this.amountToLend).format('$0,0')} and get a $25 lending credit!¹`
				: 'Lend & get a free lending credit reward!¹ Log in or sign up to get started →';

			const link = this.isLoggedin
				? '/lend-by-category'
				: '/ui-login?force=true&doneUrl=/lend-by-category';

			return {
				richText,
				link,
				disclaimer: '',
			};
		}
	},
};
</script>
