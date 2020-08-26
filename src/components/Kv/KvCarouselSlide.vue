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
@import 'settings';

.kv-carousel-slide {
	position: relative;
	min-width: 100%;
}
</style>
