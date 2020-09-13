import KvProgressCircle from '@/components/Kv/KvProgressCircle';

export default {
	title: 'Kv/KvProgressCircle',
	component: KvProgressCircle,
	args: {
		value: 10,
		strokeWidth: 5
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
		KvProgressCircle
	},
	template: `
		<kv-progress-circle
			:value="value"
			:stroke-width="strokeWidth"
			style="width: 200px;"
		/>
	`,
});

export const Styled = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressCircle
	},
	template: `
		<kv-progress-circle
			:value="value"
			:stroke-width="strokeWidth"
			style="
				--kv-progress-circle-foreground-color: purple;
				--kv-progress-circle-background-color: orange;
				width: 4rem;
			"
		/>
	`,
});
