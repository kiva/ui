<template functional>
	<div :class="[
			'loading-placeholder tw-w-full tw-h-full tw-relative tw-overflow-hidden tw-bg-tertiary',
			data.class,
			data.staticClass
		]"
		:style="[data.style, data.staticStyle]"
	></div>
</template>

<style lang="scss">
@import 'settings';

.loading-placeholder {
	&::before {
		content: '';
		display: block;
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: -100%;
		background: linear-gradient(to right, transparent 0%, rgb(var(--bg-secondary)) 50%, transparent 100%);
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
