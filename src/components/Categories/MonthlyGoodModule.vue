<template>
	<div class="tw-relative">
		<kv-responsive-image
			class="image-sizing"
			:images="monthlyGoodImages"
			loading="lazy"
			:alt="'Monthly Good'"
		/>
		<div
			class="md:tw-absolute tw-bg-transparent text-box-position
			tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8"
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
	@apply tw-w-full tw-max-h-[311px] md:tw-max-h-[428px] md:tw-h-[428px] tw-object-cover tw-object-top;
}

.text-box-position {
	@apply md:tw-top-[91px] lg:tw-top-[80px] tw-left-[0px] tw-right-[0px] tw-max-w-[1200px];
}

</style>
