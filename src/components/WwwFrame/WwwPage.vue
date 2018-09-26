<template>
	<div class="www-page">
		<appeal-banner />
		<the-header />
		<slot name="secondary"></slot>
		<main>
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer />
		<the-basket-bar />
	</div>
</template>

<script>
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';
import AppealBanner from './AppealBanner';

export default {
	components: {
		TheHeader,
		TheFooter,
		TheBasketBar,
		AppealBanner,
	}
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
	}
}
</style>
