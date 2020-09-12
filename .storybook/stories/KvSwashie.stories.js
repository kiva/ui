import KvSwashie from '@/components/Kv/KvSwashie';

export default {
	title: 'Kv/KvSwashie',
	component: KvSwashie,
	args: {
		percentLoaded: 25
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

export const Scaled = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvSwashie
	},
	template: `
		<div style="display: flex; flex-wrap: wrap;">
			<kv-swashie :percent-loaded="percentLoaded" style="width: 2rem;" />
			<kv-swashie :percent-loaded="percentLoaded" style="width: 3rem;" />
			<kv-swashie :percent-loaded="percentLoaded" style="width: 5rem;" />
			<kv-swashie :percent-loaded="percentLoaded" style="width: 8rem;" />
			<kv-swashie :percent-loaded="percentLoaded" style="width: 13rem;" />
			<kv-swashie :percent-loaded="percentLoaded" style="width: 21rem;" />
		</div>
	`,
});
Scaled.args = {
	percentLoaded: 100
}
