import KvSwashie from '@/components/Kv/KvSwashie';

export default {
	title: 'Kv/KvSwashie',
	component: KvSwashie,
	args: {
		percentLoaded: 10
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvSwashie
	},
	template: `
		<kv-swashie :percent-loaded="percentLoaded" style="width: 10rem;" />
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
