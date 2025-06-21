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
import CookieBanner from '#src/components/WwwFrame/CookieBanner';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';

export default {
	name: 'WwwPageMinimal',
	components: {
		CookieBanner,
		TheBasketBar,
		TheFooter,
		TheHeader,
	},
};
</script>

<style lang="scss">
@use '#src/assets/scss/settings' as *;

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
