<template>
	<div
		class="tw-overflow-hidden tw-relative tw-h-full tw-w-full tw-bg-primary tw-border tw-border-tertiary tw-rounded"
	>
		<kv-responsive-image
			class="promo-background-image tw-object-cover"
			:images="backgroundImage" loading="lazy" alt=""
		/>
		<div class="tw-pb-1 tw-px-1.5 tw-absolute tw-bottom-1">
			<div class="tw-flex tw-flex-col tw-gap-1 md:tw-gap-0.5" style="color: #F5F5F5;">
				<h3 class="tw-mb-1 tw-text-h2 md:tw-text-h3">
					Make a monthly impact
				</h3>
				<p class="tw-text-base" v-if="categoryLabel">
					We’ll lend to {{ categoryLabel }} for you every month with a Monthly Good subscription.
				</p>
				<p class="tw-text-base" v-else>
					We’ll make a loan for you every month with a Monthly Good subscription.
				</p>
				<router-link
					style="background: #212121; color: #F5F5F5;"
					class="tw-rounded tw-block tw-mt-2 tw-px-3 tw-py-1.5 tw-text-center tw-w-auto"
					:to="categoryUrl"
					v-kv-track-event="['Lending', 'PromoGridCard-click-Learn more', 'CASH-1426 Dec2019']"
				>
					Learn about Monthly Good
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import { paramCase } from 'change-case';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import getCacheKey from '@/util/getCacheKey';

const promoLoanImageRequire = require.context('@/assets/images/mg-promo-loan-card/', true);

export default {
	name: 'PromoGridLoanCardExp',
	serverCacheKey: props => getCacheKey(`${props.categoryLabel}-${props.categoryUrl}-exp`),
	components: {
		KvResponsiveImage
	},
	props: {
		categoryLabel: {
			type: String,
			default: ''
		},
		categoryUrl: {
			type: String,
			default: '/monthlygood',
		},
	},
	computed: {
		backgroundImage() {
			if (this.categoryLabel) {
				return [
					['small', promoLoanImageRequire(`./mg-promo-${paramCase(this.categoryLabel)}-std.jpg`)],
					['small retina', promoLoanImageRequire(`./mg-promo-${paramCase(this.categoryLabel)}-retina.jpg`)],
				];
			}
			return [
				['small', promoLoanImageRequire('./mg-promo-default-std.jpg')],
				['small retina', promoLoanImageRequire('./mg-promo-default-retina.jpg')],
			];
		}
	},
};
</script>

<style scoped>

.promo-background-image::after {
	display: block;
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: linear-gradient(transparent 25%, rgb(0, 0, 0) 75%);
}

</style>
