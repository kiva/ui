<template>
	<div class="fifteen-year-styled">
		<slot></slot>
	</div>
</template>

<style lang="scss">
@import 'settings';
@import 'components/15-years/15-years';

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

.fifteen-year-styled {
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
