<template>
	<div class="tw-relative">
		<the-browser-check ref="theBrowserCheck" />
		<the-header
			:corporate="true"
			:corporate-logo-url="corporateLogoUrl"
			:logo-height="logoHeight"
			:logo-classes="logoClasses"
			class="tw-sticky tw-z-sticky tw-top-0"
			@show-basket="$emit('show-basket')"
		/>
		<main>
			<slot></slot>
		</main>
		<the-footer-corporate
			:corporate-logo-url="corporateLogoUrl"
			:logo-height="logoHeight"
			:logo-classes="logoClasses"
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
import { assignAllActiveExperiments } from '@/util/experiment/experimentUtils';

export default {
	name: 'WwwPageCorporate',
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
		},
		logoClasses: {
			type: String,
			default: ''
		},
		logoHeight: {
			type: String,
			default: '28'
		}
	},
	apollo: {
		preFetch(_, client) {
			return Promise.all([
				client.query({ query: hasEverLoggedInQuery }),
				assignAllActiveExperiments(client)
			]);
		},
	}
};
</script>
