<template>
	<generic-promo-banner
		:promo-banner-content="promoBannerContent"
	/>
</template>

<script>
import GenericPromoBanner from '@/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';
import numeral from 'numeral';
import { gql } from '@apollo/client';

const amountToLendQuery = {
	query: gql`
    query RewardBalanceQuery {
      my {
        id
        depositIncentiveAmountToLend
      }
    }
  `,
};

export default {
	name: 'DepositIncentiveBanner',
	components: {
		GenericPromoBanner,
	},
	data() {
		return {
			amountToLend: 0,
		};
	},
	inject: ['apollo', 'cookieStore'],
	preFetch() {
		return this.apollo.query({ query: amountToLendQuery });
	},
	computed: {
		promoBannerContent() {
			const richText = this.amountToLend
				? `Just for you! Lend ${numeral(this.amountToLend).format('$0,0')} and get a $25 lending credit!¹`
				: 'Lend & get a free lending credit reward!¹ Log in or sign up to get started →';

			const link = this.amountToLend
				? '/lend-by-category'
				: '/ui-login?force=true&doneUrl=/lend-by-category';

			return {
				richText,
				link,
				disclaimer: '',
			};
		}
	},
	mounted() {
		const userInfo = this.apollo.readQuery({
			query: amountToLendQuery,
		});

		this.amountToLend = userInfo?.my?.depositIncentiveAmountToLend ?? 0;
	}
};
</script>
