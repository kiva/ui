import KvProgressCircle from '#src/components/Kv/KvProgressCircle';

const args = {
	value: 10,
	strokeWidth: 8,
	showNumber: false,
	arcScale: 1,
	rotate: 0,
};

export default {
	title: 'Kv/KvProgressCircle',
	component: KvProgressCircle,
	args,
	argTypes: {
		value: {
			control: 'range',
			options: {
				min: 0,
				max: 100,
				step: 1,
			}
		}
	}
};

export const Default = (otherArgs, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressCircle
	},
	setup() { return { ...args, ...otherArgs }; },
	template: `
		<kv-progress-circle
			:value="value"
			:stroke-width="strokeWidth"
			:show-number="showNumber"
			:arc-scale="arcScale"
			:rotate="rotate"
			style="width: 200px;"
		/>
	`,
});

export const Styled = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressCircle
	},
	setup() { return args; },
	template: `
		<kv-progress-circle
			:value="value"
			:stroke-width="strokeWidth"
			:show-number="showNumber"
			:arc-scale="arcScale"
			:rotate="rotate"
			style="
				--kv-progress-circle-foreground-color: purple;
				--kv-progress-circle-background-color: orange;
				width: 4rem;
			"
		/>
	`,
});


export const CShape = Default.bind({});
CShape.otherArgs = {
	arcScale: .8,
	rotate: 36,
}
