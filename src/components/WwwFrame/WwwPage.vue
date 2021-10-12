<template>
	<div class="www-page">
		<template v-if="!isKivaAppReferral">
			<the-banner-area />
			<the-header
				:hide-search-in-header="hideSearchInHeader"
				:theme="headerTheme"
			/>
			<slot name="secondary"></slot>
		</template>
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
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import isKivaAppReferralQuery from '@/graphql/query/shared/isKivaAppReferral.graphql';
import logReadQueryError from '@/util/logReadQueryError';

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
	data() {
		return {
			isKivaAppReferral: false
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			return Promise.all([
				client.query({ query: hasEverLoggedInQuery }),
				fetchAllExpSettings(config, client, {
					query: route?.query,
					path: route?.path
				}),
				client.query({
					query: isKivaAppReferralQuery,
					variables: {
						kivaAppReferralQueryParam: route?.query?.kivaAppReferral,
					},
				})
			]);
		},
	},
	created() {
		let referralData = {};
		try {
			referralData = this.apollo.readQuery({
				query: isKivaAppReferralQuery,
				variables: {
					kivaAppReferralQueryParam: this.$route?.query?.kivaAppReferral,
				},
			});
			this.isKivaAppReferral = referralData?.isKivaAppReferral || false;
		} catch (e) {
			logReadQueryError(e, 'WwwPage isKivaAppReferralQuery');
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
