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
import hasEverLoggedInQuery from '#src/graphql/query/shared/hasEverLoggedIn.graphql';
import appInstallMixin from '#src/plugins/app-install-mixin';
import CookieBanner from '#src/components/WwwFrame/CookieBanner';
import { assignAllActiveExperiments } from '#src/util/experiment/experimentUtils';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';

export default {
	name: 'WwwPageMinimal',
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
		preFetch(_, client) {
			return Promise.all([
				client.query({ query: hasEverLoggedInQuery }),
				assignAllActiveExperiments(client)
			]);
		}
	}
};
</script>

<style lang="scss">
@import '#src/assets/scss/settings';

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
