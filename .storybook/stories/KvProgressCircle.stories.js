import KvProgressCircle from '@/components/Kv/KvProgressCircle';

export default {
	title: 'Kv/KvProgressCircle',
	component: KvProgressCircle,
	args: {
		value: 10,
		strokeWidth: 8,
		showNumber: false
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
			:show-number="showNumber"
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
			:show-number="showNumber"
			style="
				--kv-progress-circle-foreground-color: purple;
				--kv-progress-circle-background-color: orange;
				width: 4rem;
			"
		/>
	`,
});

export const CShape = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressCircle
	},
	template: `
		<div>
			<component is="style">
				.wrapper {
					position: relative;
				}
				.circle {
					position: absolute;
					top: 0;
					left: 0;
					width: 10rem;
					height: 10rem;
					transform: rotate(36deg);
				}
				.circle--1 {
					--kv-progress-circle-foreground-color: pink;
					--kv-progress-circle-background-color: transparent;
					z-index: 1;
				}
				.circle--2 {
					--kv-progress-circle-foreground-color: teal;
					--kv-progress-circle-background-color: transparent;
					z-index: 2;
				}
			</component>
			<div class="wrapper">
				<kv-progress-circle
					class="circle circle--1"
					:value="80"
					:stroke-width="strokeWidth"
					:show-number="false"
					aria-hidden="true"
				/>
				<kv-progress-circle
					class="circle circle--2"
					:value="value * .8"
					:stroke-width="strokeWidth"
					:show-number="showNumber"
				/>
			</div>
		</div>
	`,
});

