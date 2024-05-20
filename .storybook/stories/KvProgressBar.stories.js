import KvProgressBar from '#src/components/Kv/KvProgressBar';

export default {
	title: 'Kv/KvProgressBar',
	component: KvProgressBar,
	args: {
		value: '20',
		max: '100',
	},
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

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressBar
	},
	template: `
		<kv-progress-bar
			:value="value"
			:max="max"
		 />
	`,
});

export const Styled = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressBar
	},
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
