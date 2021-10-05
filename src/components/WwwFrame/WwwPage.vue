<template>
	<div class="www-page">
		<the-banner-area />
		<the-header
			:hide-search-in-header="hideSearchInHeader"
			:theme="headerTheme"
		/>
		<slot name="secondary"></slot>
		<main :class="mainClasses">
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer
			:theme="footerTheme"
		/>
		<the-basket-bar
			v-if="activeOnPage"
		/>
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
import TheBannerArea from './TheBannerArea';

export default {
	inject: [
		'apollo',
		'cookieStore',
	],
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
		mainClass: {
			type: [Object, String],
			default: '',
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
	},
	computed: {
		// Hiding basket footer on /lend-beta page
		activeOnPage() {
			if (this.$route.path.includes('lend-beta')) {
				return false;
			}
			return true;
		},
		mainClasses() {
			return [
				this.mainClass,
				{ 'gray-background': this.grayBackground },
			];
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

<style lang="scss" scoped>
.tw-bg-primary {
	background-color: rgb(var(--bg-primary));
}

.tw-bg-secondary {
	background-color: rgb(var(--bg-secondary));
}

.tw-bg-tertiary {
	background-color: rgb(var(--bg-tertiary));
}
</style>
