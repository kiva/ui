<template>
	<div class="header section">
		<div class="row align-middle">
			<div class="header__text large-4 columns">
				<h1 class="header__headline">
					<span class="header__headline-stroked one-line">Power in</span>Numbers
				</h1>
				<p>
					Rally Interactive will be handling this entire module
				</p>
				<a href="#">Link text</a>
			</div>

			<div class="header__globe large-offset-2 large-6 columns">
				<img
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
export default {

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

	&__headline-stroked {
		-webkit-text-stroke: 1px $body-font-color;
		-webkit-text-fill-color: $offwhite;
	}
}
</style>
