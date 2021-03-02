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
	},
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

