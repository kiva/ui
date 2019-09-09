<template>
	<transition name="kv-slide-left">
		<div v-show="display" class="kv-carousel-slide">
			<slot></slot>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'KvCarouselSlide',
	data() {
		return {
			display: false,
		};
	},
	methods: {
		hide() {
			this.display = false;
		},
		show() {
			this.display = true;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'global/transitions';

.kv-carousel-slide {
	position: absolute;
	left: 0;
	top: 0;
}
</style>
