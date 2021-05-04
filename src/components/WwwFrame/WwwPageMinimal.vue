<template>
	<div class="www-page">
		<the-header
			:theme="headerTheme"
			:minimal="true"
		/>
		<main>
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
import _get from 'lodash/get';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import { fetchAllExpSettings } from '@/util/experimentPreFetch';
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
	props: {
		headerTheme: {
			type: Object,
			default() {},
		},
		footerTheme: {
			type: Object,
			default() {},
		},
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
