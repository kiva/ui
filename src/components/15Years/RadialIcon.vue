<template>
	<div class="radial-icon"></div>
</template>

<style lang="scss" scoped>
@import '#src/assets/scss/settings';
@import '#src/assets/scss/components/15-years/15-years';

.radial-icon {
	position: relative;
	width: rem-calc(8);
	height: rem-calc(8);
	display: inline-block;
	background-color: $twilight;
	border-radius: 50%;

	&::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		border: rem-calc(3) solid $twilight;
		animation: radial-grow 1s infinite;
	}
}

@keyframes radial-grow {
	0%,
	25% {
		width: 0%;
		height: 0%;
		opacity: 1;
	}

	100% {
		width: 275%;
		height: 275%;
		opacity: 0;
	}
}
</style>
