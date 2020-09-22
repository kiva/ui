<template>
	<div class="header section">
		<div class="row align-middle">
			<div class="header__text small-12 large-4 columns">
				<h1 class="header__headline">
					<span class="header__headline-stroked no-wrap">Power in</span> Numbers
				</h1>
				<p>
					Rally Interactive will be handling this entire module
				</p>
				<fifteen-years-button to="/help/">
					button
				</fifteen-years-button>
			</div>

			<div class="header__globe small-12 large-offset-2 large-6 columns">
				<img
					class="header__globe-img"
					width="503"
					height="503"
					src="@/assets/images/15-years/temp/globe.png"
					alt=""
				>
			</div>
		</div>
	</div>
</template>

<script>
import FifteenYearsButton from './15YearsButton';

export default {
	components: {
		FifteenYearsButton
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.header {
	background: $offwhite;
	position: relative;
	z-index: 1;

	&__headline {
		@include huge-headline();
	}

	&__globe-img {
		width: 100%;
		max-width: rem-calc(615);
		margin: 2rem auto 0;
	}

	&__headline-stroked {
		-webkit-text-stroke: 1px $body-font-color;
		-webkit-text-fill-color: $offwhite;
	}
}
</style>
