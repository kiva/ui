import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';
import CategoryForm from '#src/components/MyKiva/GoalSetting/CategoryForm';
export default {
	title: 'MyKiva/GoalSettingModal',
	component: GoalSettingModal,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { GoalSettingModal, CategoryForm },
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
