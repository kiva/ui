import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';

export default {
	title: 'MyKiva/GoalSettingModal',
	component: GoalSettingModal,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { GoalSettingModal },
		setup() { return { args }; },
		template: `
			<div>
				<GoalSettingModal
          v-bind="args"
					show
				/>
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story();
