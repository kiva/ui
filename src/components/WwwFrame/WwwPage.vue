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
import hasEverLoggedInQuery from '#src/graphql/query/shared/hasEverLoggedIn.graphql';
import { userHasEverLoggedInBefore } from '#src/util/optimizelyUserMetrics';
import logReadQueryError from '#src/util/logReadQueryError';
import appInstallMixin from '#src/plugins/app-install-mixin';
import CookieBanner from '#src/components/WwwFrame/CookieBanner';
import { assignAllActiveExperiments } from '#src/util/experiment/experimentUtils';
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
			isKivaAppReferral: false,
		};
	},
	apollo: {
		preFetch(_, client) {
			return Promise.all([
				client.query({ query: hasEverLoggedInQuery }),
				assignAllActiveExperiments(client)
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
@import '#src/assets/scss/settings';

.www-page {
	display: flex;
	flex-flow: column nowrap;
	min-height: 100vh;

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
