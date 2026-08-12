<template>
	<div
		class="tw-h-full tw-bg-primary"
		:data-hydrated="dataHydrated"
	>
		<router-view />
		<vue-progress-bar v-if="dataHydrated" />
		<the-tip-message />
	</div>
</template>

<script>
import '#src/assets/scss/tailwind/tailwind.css';
import TheTipMessage from '#src/components/WwwFrame/TheTipMessage';
import unbounceEventMixin from '#src/plugins/unbounce-event-mixin';
import { metaGlobReader } from '#src/util/importHelpers';

const faviconsGlob = import.meta.glob('./assets/images/favicons/*.*', { eager: true });
const favicons = metaGlobReader(faviconsGlob, './assets/images/favicons/');

export default {
	name: 'App',
	data() {
		return {
			dataHydrated: false
		};
	},
	components: {
		TheTipMessage,
	},
	mixins: [unbounceEventMixin],
	head() {
		return {
			title: 'Loans that change lives',
			titleTemplate: '%s | Kiva',
			meta: [
				// Referrer policy
				{
					vmid: 'referrer',
					name: 'referrer',
					content: 'strict-origin-when-cross-origin'
				},
				{
					vmid: 'description',
					name: 'description',
					// eslint-disable-next-line max-len
					content: 'Make a loan to an entrepreneur across the globe for as little as $25. Kiva is the world\'s first online lending platform connecting online lenders to entrepreneurs across the globe.'
				}
			].concat(this.$appConfig.enableFB ? [
				// Facebook Specific Tags
				// TODO: We should consider omitting these on protected pages
				{
					vmid: 'facebook_label',
					name: 'facebook_label',
					content: 'Kiva - Loans that change lives'
				},
				{
					vmid: 'fb:app_id',
					property: 'fb:app_id',
					content: this.$appConfig.fbApplicationId
				}
			] : []).concat([
				// Open Graph Tags
				{ property: 'og:site_name', vmid: 'og:site_name', content: 'Kiva' },
				{ property: 'og:title', vmid: 'og:title', content: 'Kiva - Loans that change lives' },
				// eslint-disable-next-line max-len
				{ property: 'og:description', vmid: 'og:description', content: 'Support women, entrepreneurs, students and refugees around the world with as little as $25 on Kiva. 100% of your loans go to support borrowers.' },
				{ property: 'theme-color', content: '#4faf4e' },
				{
					property: 'og:image',
					vmid: 'og:image',
					content: 'https://www.kiva.org/cms/kiva-og-image.jpg'
				},
				{ property: 'og:image:width', vmid: 'og:image:width', content: '1200' },
				{ property: 'og:image:height', vmid: 'og:image:height', content: '630' },
			]).concat([
				// Microsoft Tile Tags
				{
					name: 'application-name',
					vmid: 'application-name',
					content: 'Kiva'
				},
				{ name: 'msapplication-TileColor', content: '#4faf4e' },
				{
					name: 'msapplication-TileImage',
					content: favicons('mstile-144x144.png'),
				},
				{
					name: 'msapplication-square70x70logo',
					content: favicons('mstile-70x70.png'),
				},
				{
					name: 'msapplication-square150x150logo',
					content: favicons('mstile-150x150.png'),
				},
			]).concat([
				// Twitter Tags
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:site', content: '@kiva' },
				{ name: 'twitter:title', vmid: 'twitter:title', content: 'Kiva' },
				{
					name: 'twitter:description',
					vmid: 'twitter:description',
					// eslint-disable-next-line max-len
					content: 'Support women, entrepreneurs, students and refugees around the world with as little as $25 on Kiva. 100% of your loan go to support borrowers.'
				},
				{
					name: 'twitter:image',
					vmid: 'twitter:image',
					content: 'https://www.kiva.org/cms/kiva-ogtwitter-image.jpg'
				},
			]),
			link: [
				// Install typekit Dovetail font
				{
					rel: 'preload',
					href: 'https://use.typekit.net/pmj7shs.css',
					as: 'style',
					onload: 'this.onload=null;this.rel="stylesheet"',
				},
				// Fonts in format woff2nt'
				{
					rel: 'preload',
					href: 'https://www.kiva.org/kvui/PostGrotesk-Medium.woff2',
					crossorigin: 'anonymous',
					as: 'font'
				},
				{
					rel: 'preload',
					href: 'https://www.kiva.org/kvui/PostGrotesk-MediumItalic.woff2',
					crossorigin: 'anonymous',
					as: 'font'
				},
				{
					rel: 'preload',
					href: 'https://www.kiva.org/kvui/PostGrotesk-Book.woff2',
					crossorigin: 'anonymous',
					as: 'font'
				},
				{
					rel: 'preload',
					href: 'https://www.kiva.org/kvui/PostGrotesk-BookItalic.woff2',
					crossorigin: 'anonymous',
					as: 'font'
				},
				// apple icons
				{
					rel: 'apple-touch-icon',
					href: favicons('apple-touch-icon-120x120.png'),
				},
				{
					rel: 'apple-touch-icon',
					sizes: '152x152',
					href: favicons('apple-touch-icon-152x152.png'),
				},
				{
					vmid: 'canonical',
					rel: 'canonical',
					href: `${this.$appConfig.transport}://${this.$appConfig.host}${this.$route.path}`
				}
			].concat(/^[a-z]+:\/\//i.test(this.$appConfig?.publicPath) ? [
				{
					vmid: 'dns-prefetch',
					rel: 'dns-prefetch',
					href: `https://${new URL(this.$appConfig.publicPath).hostname}`
				},
				{
					vmid: 'preconnect',
					rel: 'preconnect',
					href: `https://${new URL(this.$appConfig.publicPath).hostname}`
				},
				{
					vmid: 'preconnect-crossorigin',
					rel: 'preconnect',
					crossorigin: '',
					href: `https://${new URL(this.$appConfig.publicPath).hostname}`
				},
			] : []).concat([
				// Standard Favicons + Android favicons
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: favicons('favicon.ico'),
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: favicons('favicon-16x16.png'),
					sizes: '16x16'
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: favicons('favicon-32x32.png'),
					sizes: '32x32'
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: favicons('favicon-96x96.png'),
					sizes: '96x96'
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: favicons('favicon-128.png'),
					sizes: '128x128'
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: favicons('favicon-196x196.png'),
					sizes: '196x196'
				}
			])
		};
	},
	mounted() {
		this.dataHydrated = true;
	}
};
</script>

<style lang="scss">
@use 'assets/scss/app';
</style>
