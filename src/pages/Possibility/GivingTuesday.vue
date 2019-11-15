<template>
	<div>
		<kv-hero headline-bg-color="#0b290c">
			<template v-slot:images>
				<kv-responsive-image :images="givingTuesdayImages" alt="A woman smiling" />
			</template>
			<template v-slot:headlineTitle>
				Making opportunity possible<br class="lu"> is a team effort
			</template>
			<template v-slot:action>
				<!-- TODO: What is the the URL and tracking info? -->
				<kv-button
					class="cta-button"
					to="/lend-by-category"
					v-kv-track-event="['Home', 'Lend now', 'click-Promo 1 Billion to Women 2019']"
				>
					Lend now
				</kv-button>
			</template>
		</kv-hero>
		<div class="row intro">
			<div class="text-center featured-text columns large-10 large-offset-1">
				<p>
					100% of money lent on Kiva goes to the field, so we rely on donations
					to continue this important work. More than two-thirds of our donations
					come from individual lenders like you.
				</p>
				<p>Join a community of donors who believe in the possibilities of Kiva.</p>
			</div>
		</div>
		<div class="row kiva-stories">
			<!-- TODO: Add Content block here -->
			<div class="columns small-12 text-center">
				<img src="http://placekitten.com/750/300">
			</div>
		</div>
		<div class="row donate-cta">
			<div class="text-center featured-text columns small-12">
				<p>Join a community of donors who believe in the possibilities of Kiva.</p>
				<router-link
					to="/lend-by-category"
					class="cta-link"
					v-kv-track-event="['homepage', 'click-Learn more', 'homepage-learn-more-link', 'true']"
				>
					Donate Today
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const possibilitiesImageRequire = require.context('@/assets/images/possibilities-banners/', true);

export default {
	components: {
		KvButton,
		KvHero,
		KvResponsiveImage,
	},
	metaInfo: {
		title: 'Giving Tuesday'
	},
	data() {
		return {
			givingTuesdayImages: [
				['small', possibilitiesImageRequire('./Phase1-sm-std.jpg')],
				['small retina', possibilitiesImageRequire('./Phase1-sm-retina.jpg')],
				['medium', possibilitiesImageRequire('./Phase1-med-std.jpg')],
				['medium retina', possibilitiesImageRequire('./Phase1-med-retina.jpg')],
				['large', possibilitiesImageRequire('./Phase1-lg-std.jpg')],
				['large retina', possibilitiesImageRequire('./Phase1-lg-retina.jpg')],
				['xga', possibilitiesImageRequire('./Phase1-xl-std.jpg')],
				['xga retina', possibilitiesImageRequire('./Phase1-xl-retina.jpg')],
				['wxga', possibilitiesImageRequire('./Phase1-xxl-std.jpg')],
				['wxga retina', possibilitiesImageRequire('./Phase1-xxl-retina.jpg')]
			],
		};
	}
};
</script>

<style lang="scss" scoped>
@import "settings";
@import 'foundation';

$cta-color: #02582e;

.intro,
.kiva-stories,
.donate-cta {
	margin-bottom: 4rem;
}

.kiva-stories {
	img {
		margin-bottom: 1rem;
	}
}

.cta-button {
	@include button-style($cta-color, auto, #fff);
}

.cta-link {
	color: $cta-color;
	font-weight: $global-weight-bold;
}
</style>
