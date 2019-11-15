<template>
	<div class="row">
		<div class="columns small-8">
			<template>
				<h1 class="headline">
					Possiblity Brews from fair trade
				</h1>
			</template>
			<template>
				<h3 class="subheading">
					Vava's passion for creating change started with possibilty in coffee farmers
				</h3>
			</template>
			<template>
				<kv-button
					class="smallest action-button"
					href="/blog/one-woman-brewing-change-in-africa-and-beyond">
					Read more
				</kv-button>
			</template>
		</div>
		<div class="columns small-4">
			<template>
				<!-- <kv-responsive-image
					:images="kivaContentBlockImages"
					href="/blog/one-woman-brewing-change-in-africa-and-beyond"
				/> -->
				<img src="http://placekitten.com/500/500">
			</template>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
// import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const kivaContentBlockImageRequire = require.context('@/assets/images/possibilities-banners/', true);

export default {
	components: {
		KvButton,
		// KvResponsiveImage,
	},
	data() {
		return {
			kivaContentBlockImages: [
				['small', kivaContentBlockImageRequire('./Phase1-sm-std.jpg')],
				['small retina', kivaContentBlockImageRequire('./Phase1-sm-retina.jpg')],
				['medium', kivaContentBlockImageRequire('./Phase1-med-std.jpg')],
				['medium retina', kivaContentBlockImageRequire('./Phase1-med-retina.jpg')],
				['large', kivaContentBlockImageRequire('./Phase1-lg-std.jpg')],
				['large retina', kivaContentBlockImageRequire('./Phase1-lg-retina.jpg')],
				['xga', kivaContentBlockImageRequire('./Phase1-xl-std.jpg')],
				['xga retina', kivaContentBlockImageRequire('./Phase1-xl-retina.jpg')],
				['wxga', kivaContentBlockImageRequire('./Phase1-xxl-std.jpg')],
				['wxga retina', kivaContentBlockImageRequire('./Phase1-xxl-retina.jpg')]
			],
		};
	}
}
</script>

<style lang="scss" scoped>
@import "settings";

$cta-color: #611b1f;

.headline {
	color: $cta-color;
	font-weight: bold;
}

.subheading {
	font-weight: $global-weight-highlight;
	max-width: 24rem;
}

.action-button {
	background-color: $cta-color;
	box-shadow: darken($cta-color, 10%);

	&:hover,
	&:focus {
		background-color: darken($cta-color, 10%);
	}
}
</style>
