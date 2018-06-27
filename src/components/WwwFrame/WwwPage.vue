<template>
	<div class="www-page">
		<the-header />
		<slot name="secondary"></slot>
		<main>
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer />
		<the-basket-bar />
		<the-tip-message />
	</div>
</template>

<script>
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';
import TheTipMessage from './TheTipMessage';

export default {
	components: {
		TheHeader,
		TheFooter,
		TheBasketBar,
		TheTipMessage
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
