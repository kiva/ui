<template>
	<div class="fifteen-year-styled">
		<slot></slot>
	</div>
</template>

<style lang="scss">
@import '#src/assets/scss/settings';
@import '#src/assets/scss/components/15-years/15-years';

@import 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap';

.fifteen-year-styled {
	--fifteen-years-font-family-monospace: 'Roboto Mono', monospace;
	--fifteen-years-color-carousel-arrow-fill: #{$twilight};
	--fifteen-years-color-carousel-arrow-fill-hover: #{$mint};
	--fifteen-years-color-carousel-btn-color: #{$twilight};
	--fifteen-years-color-carousel-btn-background: #{$offwhite};
	--fifteen-years-color-carousel-btn-background-hover: #{$white};
	--fifteen-years-color-carousel-btn-border-hover: #{$white};
	--fifteen-years-color-carousel-btn-border-focus: #{$mint};

	h2 {
		@include h2();
	}

	h3 {
		@include h3();
	}

	h4 {
		@include h4();
	}

	h5 {
		@include h5();
	}

	p {
		@include body-text();
	}

	a {
		@include link();
	}

	.section {
		padding: rem-calc(96) 0;
	}

	.row {
		// the width of the comp is larger than our normal 990px
		max-width: rem-calc(1152);
	}
}
</style>
