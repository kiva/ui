<template>
	<div>
		<promo-banner-large :basket-state="basketState" />
		<promo-banner-small :basket-state="basketState" />
	</div>
</template>

<script>
import headerQuery from '@/graphql/query/wwwHeader.graphql';
import PromoBannerLarge from './PromoBannerLarge';
import PromoBannerSmall from './PromoBannerSmall';


export default {
	inject: ['apollo', 'cookieStore'],
	props: {
		basketState: {
			type: Object,
			default: () => {},
		},
	},

	components: {
		PromoBannerLarge,
		PromoBannerSmall,
	},

}
</script>
