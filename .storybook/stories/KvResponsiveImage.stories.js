import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

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
	title: 'Kv/KvResponsiveImage',
	component: KvResponsiveImage,
};

export const Default = () => ({
	components: {
		KvResponsiveImage,
	},
	data() {
		return {
			images: sampleResponsiveImageSet
		};
	},
	template: `
		<kv-responsive-image :images="images" alt="Testing Alt" />
	`,
});

export const partialSet = () => ({
	components: {
		KvResponsiveImage,
	},
	data() {
		return {
			images: [
				['small', imagesRequire('./mg-hppromo-1-sm-std.jpg')],
				['small retina', imagesRequire('./mg-hppromo-1-sm-retina.jpg')],
				['large', imagesRequire('./mg-hppromo-1-lg-std.jpg')],
				['large retina', imagesRequire('./mg-hppromo-1-lg-retina.jpg')],
			]
		};
	},
	template: `
		<kv-responsive-image :images="images" alt="Testing Alt" />
	`,
});
