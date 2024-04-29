<template>
	<generic-promo-banner
		:promo-banner-content="promoBannerContent"
	/>
</template>

<script>
import GenericPromoBanner from '@/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';
import numeral from 'numeral';
import { gql } from '@apollo/client';

const amountToLendQuery = gql`
	query RewardBalanceQuery {
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
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: amountToLendQuery,
		preFetch: true,
		result({ data }) {
			this.amountToLend = data?.my?.depositIncentiveAmountToLend ?? 0;
			this.isLoggedin = !!data?.my?.id ?? false;
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
