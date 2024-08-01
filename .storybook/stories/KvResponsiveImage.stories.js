import KvResponsiveImage from '#src/components/Kv/KvResponsiveImage';

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
			images: [
				['small', 'https://via.placeholder.com/480x600'],
				['small retina', 'https://via.placeholder.com/960x1200'],
				['medium', 'https://via.placeholder.com/675x675'],
				['medium retina', 'https://via.placeholder.com/1350x1350'],
				['large', 'https://via.placeholder.com/1024x554'],
				['large retina', 'https://via.placeholder.com/2048x1108'],
				['xga', 'https://via.placeholder.com/1440x768'],
				['xga retina', 'https://via.placeholder.com/2880x1535'],
				['wxga', 'https://via.placeholder.com/1920x820'],
				['wxga retina', 'https://via.placeholder.com/3840x1640'],
			]
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
				['small', 'https://via.placeholder.com/480x600'],
				['small retina', 'https://via.placeholder.com/960x1200'],
				['large', 'https://via.placeholder.com/1024x554'],
				['large retina', 'https://via.placeholder.com/2048x1108'],
			]
		};
	},
	template: `
		<kv-responsive-image :images="images" alt="Testing Alt" />
	`,
});
