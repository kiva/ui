<template>
	<div class="www-page">
		<the-header
			:minimal="true"
		/>
		<main>
			<slot></slot>
		</main>
		<the-footer />
		<the-basket-bar />
		<cookie-banner />
	</div>
</template>

<script>
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import appInstallMixin from '@/plugins/app-install-mixin';
import CookieBanner from '@/components/WwwFrame/CookieBanner';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';

export default {
	inject: [
		'apollo',
		'cookieStore',
	],
	components: {
		CookieBanner,
		TheBasketBar,
		TheFooter,
		TheHeader,
	},
	mixins: [
		appInstallMixin
	],
	apollo: {
		// ensure hasEverLoggedIn is set in cache from server for all pages
		query: hasEverLoggedInQuery,
		preFetch: true,
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
	}
}
</style>
