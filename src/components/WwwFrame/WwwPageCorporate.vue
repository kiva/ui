<template>
	<div class="www-page">
		<the-header
			:theme="headerTheme"
			:corporate="true"
		>
			<template v-slot:corporateLogo v-if="corporateLogoUrl">
				<img :src="corporateLogoUrl" alt="">
			</template>
		</the-header>
		<main>
			<slot></slot>
		</main>
		<the-footer
			:theme="footerTheme"
		/>
		<cookie-banner />
	</div>
</template>

<script>
import _get from 'lodash/get';
import { fetchAllExpSettings } from '@/util/experimentPreFetch';
import CookieBanner from '@/components/WwwFrame/CookieBanner';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';

export default {
	inject: [
		'apollo'
	],
	components: {
		CookieBanner,
		TheFooter,
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
