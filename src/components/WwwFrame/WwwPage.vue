<template>
	<div class="www-page">
		<the-banner-area v-show="!isKivaAppReferral" />
		<the-header
			v-show="!isKivaAppReferral"
			:hide-search-in-header="hideSearchInHeader"
		/>
		<slot name="secondary" v-if="!isKivaAppReferral"></slot>

		<main :class="mainClasses">
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer	/>
		<the-basket-bar />
		<cookie-banner />
	</div>
</template>

<script>
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import { userHasEverLoggedInBefore } from '@/util/optimizelyUserMetrics';
import logReadQueryError from '@/util/logReadQueryError';
import { fetchAllExpSettings } from '@/util/experimentPreFetch';
import appInstallMixin from '@/plugins/app-install-mixin';
import CookieBanner from '@/components/WwwFrame/CookieBanner';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';
import TheBannerArea from './TheBannerArea';

export default {
	name: 'WwwPage',
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
				})
			]);
		},
	},
	created() {
		try {
			const data = this.apollo.readQuery({
				query: hasEverLoggedInQuery,
			});

			userHasEverLoggedInBefore(data?.hasEverLoggedIn);
		} catch (e) {
			logReadQueryError(e, 'User has ever logged in');
		}

		this.isKivaAppReferral = this.$route?.query?.kivaAppReferral === 'true';
	},
	computed: {
		mainClasses() {
			return [
				this.mainClass,
				{ 'tw-bg-secondary': this.grayBackground },
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
	}
}
</style>
