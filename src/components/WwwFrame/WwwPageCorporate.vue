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
import CookieBanner from '#src/components/WwwFrame/CookieBanner';
import TheBasketBar from '#src/components/WwwFrame/TheBasketBar';
import TheBrowserCheck from '#src/components/WwwFrame/TheBrowserCheck';
import TheFooterCorporate from '#src/components/WwwFrame/TheFooterCorporate';
import TheHeader from '#src/components/WwwFrame/TheHeader';

export default {
	name: 'WwwPageCorporate',
	components: {
		CookieBanner,
		TheBasketBar,
		TheBrowserCheck,
		TheFooterCorporate,
		TheHeader,
	},
	emits: ['show-basket'],
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
};
</script>
