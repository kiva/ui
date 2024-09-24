<template>
	<div class="kv-carousel-slide">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'KvCarouselSlide',
};
</script>

<style lang="scss" scoped>
@import '#src/assets/scss/settings';

.kv-carousel-slide {
	position: relative;
	flex: 0 0 auto;
	width: 100%;
}
</style>
