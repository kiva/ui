<template>
	<div class="tw-relative">
		<the-browser-check ref="theBrowserCheck" />
		<the-header
			:corporate="true"
			:corporate-logo-url="corporateLogoUrl"
			class="tw-sticky tw-z-sticky tw-top-0"
		/>
		<main>
			<slot></slot>
		</main>
		<the-footer-corporate
			:corporate-logo-url="corporateLogoUrl"
		/>
		<the-basket-bar
			:corporate="true"
			:floating="true"
		/>
		<cookie-banner />
	</div>
</template>

<script>
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import CookieBanner from '@/components/WwwFrame/CookieBanner';
import TheBasketBar from '@/components/WwwFrame/TheBasketBar';
import TheBrowserCheck from '@/components/WwwFrame/TheBrowserCheck';
import TheFooterCorporate from '@/components/WwwFrame/TheFooterCorporate';
import TheHeader from '@/components/WwwFrame/TheHeader';

export default {
	inject: [
		'apollo',
		'cookieStore',
	],
	components: {
		CookieBanner,
		TheBasketBar,
		TheBrowserCheck,
		TheFooterCorporate,
		TheHeader,
	},
	props: {
		corporateLogoUrl: {
			type: String,
			default: ''
		}
	},
	apollo: {
		// ensure hasEverLoggedIn is set in cache from server for all pages
		query: hasEverLoggedInQuery,
		preFetch: true,
	}
};
</script>
