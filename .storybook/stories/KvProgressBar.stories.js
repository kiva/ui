import KvProgressBar from '@/components/Kv/KvProgressBar';

export default {
	title: 'Kv/KvProgressBar',
	component: KvProgressBar,
	args: {
		value: '20',
		max: '100',
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressBar
	},
	template: `
		<kv-progress-bar :value="value" :max="max" />
	`,
});
