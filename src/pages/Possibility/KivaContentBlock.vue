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
				<kv-responsive-image
					:images="kivaContentBlockImages"
					href="/blog/one-woman-brewing-change-in-africa-and-beyond"
				/>
				<!-- <img src="http://placekitten.com/500/500"> -->
			</template>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const kivaContentBlockImageRequire = require.context('@/assets/images/kiva-content-block/', true);

export default {
	components: {
		KvButton,
		KvResponsiveImage,
	},
	data() {
		return {
			kivaContentBlockImages: [
				// slide 1
				['small', kivaContentBlockImageRequire('./1x/Asset1.jpg')],
				['small retina', kivaContentBlockImageRequire('./2x/Asset1@2x.jpg')],
				// slide 2
				['small', kivaContentBlockImageRequire('./1x/Asset2.jpg')],
				['small retina', kivaContentBlockImageRequire('./2x/Asset2@2x.jpg')],
				// slide 3
				['small', kivaContentBlockImageRequire('./1x/Asset3.jpg')],
				['small retina', kivaContentBlockImageRequire('./2x/Asset3@2x.jpg')],
				//slide 4
				['small', kivaContentBlockImageRequire('./1x/Asset4.jpg')],
				['small retina', kivaContentBlockImageRequire('./2x/Asset4@2x.jpg')],
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
