<template functional>
	<div :class="['loading-placeholder', data.class, data.staticClass]" :style="[data.style, data.staticStyle]"></div>
</template>

<style lang="scss">
@import 'settings';

.loading-placeholder {
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
	background-color: $kiva-bg-darkgray;

	&::before {
		content: '';
		display: block;
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: -100%;
		background: linear-gradient(to right, transparent 0%, $kiva-bg-lightgray 50%, transparent 100%);
		animation: loading-placeholder 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
	}
}

@keyframes loading-placeholder {
	from {
		left: -100%;
	}

	to {
		left: 100%;
	}
}
</style>
