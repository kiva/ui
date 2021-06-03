<template>
	<div class="borrower-name-wrapper">
		<h2>{{ name }}</h2>
	</div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			default: ''
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.borrower-name-wrapper {
	position: absolute;
	width: 160px;
	height: 48px;
	left: 336px;
	top: 188px;
	color: $umbreon;

	@include breakpoint(large) {
		h2 {
			font-family: $body-font-family;
			font-size: 32px;
			line-height: 150%;
			letter-spacing: -1px;
		}
	}
}
</style>
