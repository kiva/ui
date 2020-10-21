<template>
	<div class="www-page">
		<the-banner-area />
		<the-header
			:hide-search-in-header="hideSearchInHeader"
			:theme="headerTheme"
		/>
		<slot name="secondary"></slot>
		<main :class="{'gray-background': grayBackground}">
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer
			:theme="footerTheme"
		/>
		<the-basket-bar />
		<cookie-banner />
	</div>
</template>

<script>
import appInstallMixin from '@/plugins/app-install-mixin';
import CookieBanner from '@/components/WwwFrame/CookieBanner';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';
import TheBannerArea from './TheBannerArea';

export default {
	components: {
		CookieBanner,
		TheBannerArea,
		TheBasketBar,
		TheFooter,
		TheHeader,
	},
	mixins: [
		appInstallMixin
	],
	props: {
		grayBackground: {
			type: Boolean,
			default: false,
		},
		hideSearchInHeader: {
			type: Boolean,
			default: false,
		},
		headerTheme: {
			type: Object,
			default: null,
		},
		footerTheme: {
			type: Object,
			default: null,
		},
	}
};
</script>

<style lang="scss">
@import 'settings';

.www-page {
	height: 100%;
	display: flex;
	flex-flow: column nowrap;

	@media print {
		display: block;
	}

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
