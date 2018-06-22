<template functional>
	<a class="button lend-button">Lend $25</a>
</template>

<style lang="scss" scoped>
@import 'settings';

.button {
	margin-top: rem-calc(30);
	margin-bottom: rem-calc(10);
	height: rem-calc(46);
	line-height: 1;
	font-size: rem-calc(20);
	width: 100%;

	@include breakpoint(medium) {
		line-height: rem-calc(15);
	}
}
</style>
