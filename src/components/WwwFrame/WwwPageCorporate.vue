<template>
	<div class="www-page-corporate">
		<the-browser-check class="www-page-corporate__browser-check" ref="theBrowserCheck" />
		<the-header
			:theme="headerTheme"
			:corporate="true"
			:corporate-logo-url="corporateLogoUrl"
			class="www-page-corporate__header"
		/>
		<main>
			<slot></slot>
		</main>
		<the-footer-corporate
			:theme="footerTheme"
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
import _get from 'lodash/get';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import { fetchAllExpSettings } from '@/util/experimentPreFetch';
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
		headerTheme: {
			type: Object,
			default() {},
		},
		footerTheme: {
			type: Object,
			default() {},
		},
		corporateLogoUrl: {
			type: String,
			default: ''
		}
	},
	apollo: {
		preFetch(config, client, args) {
			return Promise.all([
				client.query({ query: hasEverLoggedInQuery }),
				fetchAllExpSettings(config, client, {
					query: _get(args, 'route.query'),
					path: _get(args, 'route.path')
				}),
			]);
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.www-page-corporate {
	position: relative;

	&__header {
		position: sticky;
		top: 0;
	}
}
</style>
