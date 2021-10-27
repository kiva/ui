import KvContentfulImg from '@/components/Kv/KvContentfulImg';

export default {
	title: 'Kv/KvContentfulImg',
	component: KvContentfulImg,
	args: {
		contentfulSrc: 'https://images.ctfassets.net/j0p9a6ql0rn7/2TWV32iioxapwjn26ZpigZ/84ac39a1396d6be9eea472cf8791faa7/Cynthia.png',
		fallbackFormat: 'jpg',
		width: 200,
		height: null,
		alt: null,
		loading: 'lazy',
		crop: null,
		sourceSizes: null
	},
};

export const ImageSet = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvContentfulImg
	},
	template: `
		<kv-contentful-img
			:contentful-src="contentfulSrc"
			:fallback-format="fallbackFormat"
			:width="width"
			:height="height"
			:alt="alt"
			:loading="loading"
			:source-sizes="sourceSizes"
			:crop="crop"
		/>
	`,
});
ImageSet.args = {
	crop: '&fit=fill&f=face',
	sourceSizes: [
		{
			width: 1920,
			height: 650,
			media: 'min-width: 1441px',
		},
		{
			width: 1440,
			height: 620,
			media: 'min-width: 1025px',
		},
		{
			width: 1024,
			height: 441,
			media: 'min-width: 1024px',
		},
		{
			width: 680,
			height: 372,
			media: 'min-width: 734px',
		},
		{
			width: 480,
			height: 540,
			media: 'min-width: 0px',
		},
	],
	contentfulSrc: 'https://images.ctfassets.net/j0p9a6ql0rn7/7mY5ZujL9UfbluRkVkHgkX/5ec83a74e7c1dc387f3fa35af34f5243/mg-hppromo-1-wxga-retina.jpg'
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvContentfulImg
	},
	template: `
		<kv-contentful-img
			:contentful-src="contentfulSrc"
			:fallback-format="fallbackFormat"
			:width="width"
			:height="height"
			:alt="alt"
			:loading="loading"
		/>
	`,
});

