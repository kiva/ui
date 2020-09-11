import KvProgressCircle from '@/components/Kv/KvProgressCircle';

export default {
	title: 'Kv/KvProgressCircle',
	component: KvProgressCircle,
	args: {
		percentLoaded: 10
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressCircle
	},
	template: `
		<kv-progress-circle :percent-loaded="percentLoaded" />
	`,
});

export const FiftyPercent = Default.bind({});
FiftyPercent.args = {
	percentLoaded: 50,
};

export const EightyPercent = Default.bind({});
EightyPercent.args = {
	percentLoaded: 80,
};

export const OneHundredPercent = Default.bind({});
OneHundredPercent.args = {
	percentLoaded: 100,
};
