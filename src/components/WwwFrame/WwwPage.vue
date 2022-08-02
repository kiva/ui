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
import gql from 'graphql-tag';
import { fetchAllExpSettings } from '@/util/experimentPreFetch';
import appInstallMixin from '@/plugins/app-install-mixin';
import CookieBanner from '@/components/WwwFrame/CookieBanner';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';
import TheBannerArea from './TheBannerArea';

const hasLentBeforeCookie = 'kvu_lb';
const hasDepositBeforeCookie = 'kvu_db';

const optimizelyUserDataQuery = gql`query optimizelyUserDataQuery {
  	my {
    	loans(limit:1) {
      		totalCount
    	}
    	transactions(limit:1, filter:{category:deposit}) {
      		totalCount
   		}
	}
}`;

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
				}),
				client.query({ query: optimizelyUserDataQuery })
			]);
		}
	},
	created() {
		let userData = {};
		const currentHasLentBeforeValue = this.cookieStore.get(hasLentBeforeCookie);
		const currentHasDepositBeforeValue = this.cookieStore.get(hasDepositBeforeCookie);

		userData = this.apollo.readQuery({
			query: optimizelyUserDataQuery,
		});

		const hasLentBefore = userData?.my?.loans?.totalCount > 0;
		const hasDepositBefore = userData?.my?.transactions?.totalCount > 0;

		if (currentHasLentBeforeValue !== hasLentBefore.toString() || currentHasDepositBeforeValue !== hasDepositBefore.toString()) { // eslint-disable-line max-len
			this.cookieStore.set(hasLentBeforeCookie, hasLentBefore, { secure: true, sameSite: 'strict' });
			this.cookieStore.set(hasDepositBeforeCookie, hasDepositBefore, { secure: true, sameSite: 'strict' });
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
