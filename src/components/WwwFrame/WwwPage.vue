<template>
	<div class="www-page">
		<appeal-banner />
		<global-promo />
		<the-header :hide-search-in-header="hideSearchInHeader" />
		<slot name="secondary"></slot>
		<main :class="{'gray-background': grayBackground}">
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer />
		<the-basket-bar />
		<cookie-banner />
	</div>
</template>

<script>
import _get from 'lodash/get';
import usingTouchMutation from '@/graphql/mutation/updateUsingTouch.graphql';
import { fetchAllExpSettings } from '@/util/experimentPreFetch';
import CookieBanner from '@/components/WwwFrame/CookieBanner';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';
import AppealBanner from './EndOfYearAppealBanner/AppealBanner';
import GlobalPromo from './PromotionalBanner/GlobalPromotionalBanner';

export default {
	inject: [
		'apollo'
	],
	components: {
		TheHeader,
		TheFooter,
		TheBasketBar,
		AppealBanner,
		GlobalPromo,
		CookieBanner,
	},
	props: {
		grayBackground: {
			type: Boolean,
			default: false,
		},
		hideSearchInHeader: {
			type: Boolean,
			default: false,
		},
	},
	apollo: {
		preFetch(config, client, args) {
			return fetchAllExpSettings(config, client, {
				query: _get(args, 'route.query'),
				path: _get(args, 'route.path')
			});
		}
	},
	mounted() {
		const usingTouch =
			('ontouchstart' in window)
			|| window.TouchEvent;
		this.apollo.mutate({
			mutation: usingTouchMutation,
			variables: { usingTouch }
		});
	},
};
</script>

<style lang="scss">
@import 'settings';

.www-page {
	height: 100%;
	display: flex;
	flex-flow: column nowrap;

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
