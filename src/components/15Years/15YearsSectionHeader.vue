<template>
	<div class="section-header">
		<h2 class="section-header__h2">
			<slot name="header"></slot>
		</h2>
		<div class="section-header__line"></div>
		<p class="section-header__subhead">
			<slot name="subhead"></slot>
		</p>
	</div>
</template>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;
@use '#src/assets/scss/components/15-years/15-years' as *;

.section-header {
	--section-header-line-color: #{$offwhite};

	@include breakpoint(xxlarge) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-align: right;
	}

	&__h2 {
		flex-shrink: 0;
	}

	&__line {
		display: inline-block;
		background-color: $offwhite;
		background-color: var(--section-header-line-color);
		width: rem-calc(1);
		height: 2.125em;
		margin-right: 0.5rem;
		vertical-align: top;

		@include breakpoint(large) {
			display: none;
		}

		@include breakpoint(xxlarge) {
			display: block;
			background-color: $offwhite;
			background-color: var(--section-header-line-color);
			width: 100%;
			height: rem-calc(1);
			margin: 0 1.5rem;
		}
	}

	&__subhead {
		margin-bottom: 0;
		flex-shrink: 0;
		display: inline-block;
	}
}
</style>
