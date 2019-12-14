<template>
	<transition :name="transitionName">
		<div v-show="display" class="kv-carousel-slide">
			<slot></slot>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'KvCarouselSlide',
	props: {
		transitionName: {
			type: String,
			default: 'kv-slide-left'
		}
	},
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

.kv-carousel-slide {
	position: absolute;
	left: 0;
	top: 0;
}
</style>
