import KvResponsiveImage2 from '@/components/Kv/KvResponsiveImage2';

const imagesRequire = require.context('@/assets/images/mg-hero-slideshow', true);
const sampleResponsiveImageSet = [
	['small', imagesRequire('./mg-hppromo-1-sm-std.jpg')],
	['small retina', imagesRequire('./mg-hppromo-1-sm-retina.jpg')],
	['medium', imagesRequire('./mg-hppromo-1-med-std.jpg')],
	['medium retina', imagesRequire('./mg-hppromo-1-med-retina.jpg')],
	['large', imagesRequire('./mg-hppromo-1-lg-std.jpg')],
	['large retina', imagesRequire('./mg-hppromo-1-lg-retina.jpg')],
	['xga', imagesRequire('./mg-hppromo-1-xga-std.jpg')],
	['xga retina', imagesRequire('./mg-hppromo-1-xga-retina.jpg')],
	['wxga', imagesRequire('./mg-hppromo-1-wxga-std.jpg')],
	['wxga retina', imagesRequire('./mg-hppromo-1-wxga-retina.jpg')],
];

export default {
	title: 'Kv/KvResponsiveImage2',
	component: KvResponsiveImage2,
};

export const Default = () => ({
	components: {
		KvResponsiveImage2,
	},
	data() {
		return {
			images: sampleResponsiveImageSet
		};
	},
	template: `
		<kv-responsive-image2 :images="images" alt="" />
	`,
});
