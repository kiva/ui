<template>
	<div class="header section">
		<div class="row align-middle">
			<div class="header__text large-4 columns">
				<h1 class="header__headline">
					<span class="header__headline-stroked">Power in</span><br> Numbers
				</h1>
				<p>
					Rally Interactive will be handling this entire module
				</p>
				<kv-button>Button</kv-button>
				<a href="#">Link text</a>
			</div>

			<div class="header__globe large-offset-2 large-6 columns">
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
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton
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

	&__headline-stroked {
		-webkit-text-stroke: 1px $body-font-color;
		-webkit-text-fill-color: $offwhite;
	}

	&__globe-img {
		margin: 4rem 0;
	}
}
</style>
