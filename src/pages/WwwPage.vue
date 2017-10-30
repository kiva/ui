<template>
	<div class="www-page">
		<www-header />
		<slot name="secondary"></slot>
		<main>
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<www-footer />
	</div>
</template>

<script>
import WwwHeader from '@/components/WwwHeader';
import WwwFooter from '@/components/WwwFooter';

export default {
	components: { WwwHeader, WwwFooter },
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
