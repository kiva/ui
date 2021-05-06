<template>
	<section class="section-with-background">
		<div class="section-with-background__wrapper">
			<slot name="content">
			</slot>
		</div>
		<slot name="background">
		</slot>
	</section>
</template>

<script>

/**
* Section Background
* Creates a full width section with a full bleed background.

* When using this component you must specify a height in CSS
* in the parent, for example:
*
* 	height: rem-calc(920);
*
* 	@include breakpoint(large) {
* 		height: rem-calc(550);
*	}

* */

export default {
};
</script>

<style lang="scss" scoped>
@import 'settings';

.section-with-background {
	padding: 0;
	position: relative;

	&__wrapper {
		padding: 2rem 0;

		@include breakpoint(large) {
			padding: 4rem 0 2rem;
		}

		width: 100%;
		overflow: hidden;
		z-index: 2;
		margin: 0;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>
