import KvAlert from '#src/components/Kv/KvAlert';

export default {
	title: 'Kv/KvAlert',
	component: KvAlert,
	args: {
		variant: 'success',
		canClose: false
	},
	argTypes: {
		variant: {
			control: {
				type: 'select',
			},
			options: ['success', 'caution', 'danger'],
		},
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvAlert
	},
	setup() { return args; },
	template: `
		<kv-alert
			:variant="variant"
			:canClose="canClose"
		>
			Message
		</kv-alert>
	`,
});

export const Caution = Default.bind({});
Caution.args = {
	variant: 'caution',
};

export const Danger = Default.bind({});
Danger.args = {
	variant: 'danger',
};

export const canClose = Default.bind({});
canClose.args = {
	canClose: true,
};

export const LongText = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvAlert
	},
	template: `
		<kv-alert
			:variant="variant"
			:canClose="canClose"
		>
			<p>Lorem Ipsum Cupidatat est sunt esse occaecat mollit consequat fugiat veniam. Incididunt aliquip nostrud veniam aliquip deserunt consectetur culpa culpa mollit esse pariatur voluptate. Enim ut ex ea ea mollit cillum velit ipsum qui.</p>
			<ul>
				<li>One</li>
				<li>Two</li>
			</ul>
			<a href="#">Go there</a>
		</kv-alert>
	`,
});




