<template>
	<div class="www-page">
		<the-header />
		<slot name="secondary"></slot>
		<main>
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer />
	</div>
</template>

<script>
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';

export default {
	components: { TheHeader, TheFooter },
};
</script>

<style lang="scss">
@import 'settings';

.www-page {
	min-height: 100%;
	display: flex;
	flex-flow: column nowrap;

	main {
		flex-grow: 1;
	}
}
</style>
