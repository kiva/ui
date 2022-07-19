<template>
	<div class="tw-relative tw-mx-auto" style="max-width: 2000px;">
		<kv-responsive-image
			class="image-sizing image-sizing__height"
			:images="monthlyGoodImages"
			loading="lazy"
			alt="Monthly Good"
		/>
		<div
			class="md:tw-absolute tw-bg-transparent
			tw-top-1/4 tw-left-0 tw-right-0
			tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8"
			style="max-width: 1200px;"
		>
			<div class="md:tw-max-w-sm tw-bg-white tw-rounded md:tw-p-2">
				<div class="md:tw-ml-1">
					<h1 class="tw-text-black tw-text-h2 tw-pt-2 md:tw-pt-0">
						Join Monthly Good
					</h1>
					<p class="tw-mt-2 tw-mb-2 tw-text-subhead tw-text-black">
						Support a borrower every month from a selection handpicked
						for you for as little as $5.
					</p>
					<kv-button
						class="tw-w-full md:tw-w-auto tw-pb-2 md:tw-pb-0"
						to="/monthlygood"
						variant="primary"
						v-kv-track-event="['Categories', 'click-mg-cta', 'Get started']"
					>
						Get started
					</kv-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const monthlyGoodImagesRequire = require.context('@/assets/images/mg-hero-slideshow/', true);

export default {
	name: 'MonthlyGoodModule',
	components: {
		KvButton,
		KvResponsiveImage
	},
	data() {
		return {
			monthlyGoodImages: [
				['small', monthlyGoodImagesRequire('./mg-hppromo-1-sm-std.jpg')],
				['small retina', monthlyGoodImagesRequire('./mg-hppromo-1-sm-retina.jpg')],
				['medium', monthlyGoodImagesRequire('./mg-hppromo-1-med-std.jpg')],
				['medium retina', monthlyGoodImagesRequire('./mg-hppromo-1-med-retina.jpg')],
				['large', monthlyGoodImagesRequire('./mg-hppromo-1-lg-std.jpg')],
				['large retina', monthlyGoodImagesRequire('./mg-hppromo-1-lg-retina.jpg')],
				['xga', monthlyGoodImagesRequire('./mg-hppromo-1-xga-std.jpg')],
				['xga retina', monthlyGoodImagesRequire('./mg-hppromo-1-xga-retina.jpg')],
				['wxga', monthlyGoodImagesRequire('./mg-hppromo-1-wxga-std.jpg')],
				['wxga retina', monthlyGoodImagesRequire('./mg-hppromo-1-wxga-retina.jpg')]
			],
		};
	},
};

</script>

<style lang="postcss" scoped>

.image-sizing >>> img {
	@apply tw-w-full tw-object-cover tw-object-top;
}

</style>

<style lang="scss" scoped>

.image-sizing__height {
	::v-deep {
		img {
			max-height: 311px;
		}
	}
}

@media (min-width: 734px) {
	.image-sizing__height {
		::v-deep {
			img {
				max-height: 500px;
			}
		}
	}
}

</style>
