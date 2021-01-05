<template>
	<div class="www-page-corporate">
		<the-header
			:theme="headerTheme"
			:corporate="true"
			class="www-page-corporate__header"
		>
			<template v-slot:corporateLogo v-if="corporateLogoUrl">
				<img :src="corporateLogoUrl" alt="">
			</template>
		</the-header>
		<main>
			<slot></slot>
		</main>
		<the-footer-corporate
			:theme="footerTheme"
			:corporate-logo="corporateLogoUrl"
		/>
		<cookie-banner />
	</div>
</template>

<script>
import _get from 'lodash/get';
import { fetchAllExpSettings } from '@/util/experimentPreFetch';
import CookieBanner from '@/components/WwwFrame/CookieBanner';
import TheFooterCorporate from '@/components/WwwFrame/TheFooterCorporate';
import TheHeader from '@/components/WwwFrame/TheHeader';

export default {
	inject: [
		'apollo'
	],
	components: {
		CookieBanner,
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
			return fetchAllExpSettings(config, client, {
				query: _get(args, 'route.query'),
				path: _get(args, 'route.path')
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
// Position: sticky should work, but nav bounces some during scroll */

/* .www-page-corporate {
	position: relative;

&__header {
	position: sticky;
	top: 0;
} */

// workaround for position: sticky jank
.www-page-corporate {
	padding-top: 2.8125rem; // height of the nav bar
	@include breakpoint(large) {
		padding-top: 4rem;
	}

	&__header {
		position: fixed;
		top: 0;
		width: 100%;
	}
}
</style>
