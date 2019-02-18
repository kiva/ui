<template>
	<div class="www-page">
		<appeal-banner />
		<global-promo />
		<the-header />
		<slot name="secondary"></slot>
		<main :class="{'gray-background': grayBackground}">
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer />
		<the-basket-bar />
		<cookie-banner />
	</div>
</template>

<script>
import CookieBanner from '@/components/WwwFrame/CookieBanner';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';
import AppealBanner from './EndOfYearAppealBanner/AppealBanner';
import GlobalPromo from './PromotionalBanner/GlobalPromotionalBanner';

export default {
	components: {
		TheHeader,
		TheFooter,
		TheBasketBar,
		AppealBanner,
		GlobalPromo,
		CookieBanner,
	},
	props: {
		grayBackground: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.www-page {
	height: 100%;
	display: flex;
	flex-flow: column nowrap;

	& > * {
		flex-shrink: 0; // Handle IE defaulting flex-shrink to 1
	}

	main {
		flex-grow: 1;

		&.gray-background {
			background: $kiva-bg-lightgray;
		}
	}
}
</style>
