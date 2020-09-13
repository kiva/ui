import SwashieFace from '@/components/15Years/SwashieFace';

export default {
	title: 'components/SwashieFace',
	component: SwashieFace,
	args: {
		percentLoaded: 25
	},
	argTypes: {
		percentLoaded: {
			control: 'range',
			options: {
				min: 0,
				max: 100,
				step: 1,
			}
		}
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		SwashieFace
	},
	template: `
		<swashie-face :percent-loaded="percentLoaded" style="width: 10rem;" />
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
		SwashieFace
	},
	template: `
		<div style="display: flex; flex-wrap: wrap;">
			<swashie-face :percent-loaded="percentLoaded" style="width: 2rem;" />
			<swashie-face :percent-loaded="percentLoaded" style="width: 3rem;" />
			<swashie-face :percent-loaded="percentLoaded" style="width: 5rem;" />
			<swashie-face :percent-loaded="percentLoaded" style="width: 8rem;" />
			<swashie-face :percent-loaded="percentLoaded" style="width: 13rem;" />
			<swashie-face :percent-loaded="percentLoaded" style="width: 21rem;" />
		</div>
	`,
});
Scaled.args = {
	percentLoaded: 100
}
