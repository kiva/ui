import KvProgressCircle from '@/components/Kv/KvProgressCircle';

export default {
	title: 'Kv/KvProgressCircle',
	component: KvProgressCircle,
	args: {
		progress: 10,
		stroke: 10
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressCircle
	},
	template: `
		<kv-progress-circle :progress="progress" :stroke="stroke" style="width: 200px;" />
	`,
});

export const FiftyPercent = Default.bind({});
FiftyPercent.args = {
	progress: 50,
};

export const EightyPercent = Default.bind({});
EightyPercent.args = {
	progress: 80,
};

export const OneHundredPercent = Default.bind({});
OneHundredPercent.args = {
	progress: 100,
};
