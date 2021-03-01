import KvContentfulImg from '@/components/Kv/KvContentfulImg';

export default {
	title: 'Kv/KvContentfulImg',
	component: KvContentfulImg,
	args: {
		contentfulSrc: 'https://images.ctfassets.net/j0p9a6ql0rn7/5fMPZOXnBVwvzwpXrVhZmD/ce1dd3e642c9d4707c2bb6c2a67f0e0d/IWD2021Step2.png',
		fallbackFormat: 'jpg',
		width2x: null,
		height2x: null,
		alt: null,
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
			:width2x="width2x"
			:height2x="height2x"
			:alt="alt"
		/>
	`,
});

