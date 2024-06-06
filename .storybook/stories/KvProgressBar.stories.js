import KvProgressBar from '#src/components/Kv/KvProgressBar';

const args = {
	value: '20',
	max: '100',
};

export default {
	title: 'Kv/KvProgressBar',
	component: KvProgressBar,
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

export const Default = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressBar
	},
	setup() { return args; },
	template: `
		<kv-progress-bar
			:value="value"
			:max="max"
		 />
	`,
});

export const Styled = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressBar
	},
	setup() { return args; },
	template: `
		<kv-progress-bar
			:value="value"
			:max="max"
			style="
				--kv-progress-bar-foreground-color: purple;
				--kv-progress-bar-background-color: orange;
				width: 50%;
			"
		/>
	`,
});
