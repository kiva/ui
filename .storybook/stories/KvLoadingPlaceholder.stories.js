import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';

export default {
	title: 'Kv/KvLoadingPlaceholder',
	component: KvLoadingPlaceholder,
	args: {
		borderRadius: 'none',
		height:  '2rem',
		width: '5rem'
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { KvLoadingPlaceholder },
	template: '<kv-loading-placeholder :style="{ borderRadius: borderRadius, height: height, width: width }" />'
});
