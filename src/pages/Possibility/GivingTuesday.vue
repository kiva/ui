<template>
	<div>
		<kv-hero headline-bg-color="#0b290c">
			<template #images>
				<kv-responsive-image :images="givingTuesdayImages" alt="A woman smiling" />
			</template>
			<template #headlineTitle>
				Making opportunity possible<br class="lu"> is a team effort
			</template>
			<template #action>
				<kv-button
					class="cta-button"
					href="/donate/supportus"
					v-kv-track-event="['possibility', 'click-hero-link', 'giving-tuesday']"
				>
					Donate now
				</kv-button>
			</template>
		</kv-hero>
		<div class="row intro">
			<div class="tw-text-center columns large-10 large-offset-1">
				<p>
					100% of money lent on Kiva goes to the field, so we rely on donations
					to continue this important work. More than two-thirds of our donations
					come from individual lenders like you.
				</p>
				<p>Join a community of donors who believe in the possibilities of Kiva.</p>
			</div>
		</div>
		<!-- Kiva Content Block -->
		<div class="row kiva-stories">
			<div class="columns small-12 large-10">
				<kiva-content-block />
			</div>
		</div>
		<div class="row donate-cta">
			<div class="tw-text-center columns small-12">
				<p>Join a community of donors who believe in the possibilities of Kiva.</p>
				<a
					href="/donate/supportus"
					class="cta-link"
					v-kv-track-event="['possibility', 'click-footer-cta', 'giving-tuesday']"
				>
					Donate Today
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import KivaContentBlock from '@/pages/Possibility/KivaContentBlock';

const possibilitiesImageRequire = require.context('@/assets/images/possibilities-banners/', true);

export default {
	name: 'GivingTuesday',
	components: {
		KvButton,
		KvHero,
		KvResponsiveImage,
		KivaContentBlock,
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
.donate-cta {
	margin-bottom: 4rem;
}

.kiva-stories {
	div {
		margin: 0 auto;
	}

	img {
		margin-bottom: 1rem;
	}
}

.cta-button {
	@include button-style($cta-color, auto, #fff);
	// Include in order to override the default box-shadow of this button
	box-shadow: 0 2px darken($cta-color, 10%);
}

.cta-link {
	color: $cta-color;
	font-weight: $global-weight-bold;
}
</style>
