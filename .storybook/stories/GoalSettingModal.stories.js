import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';
import { ID_BASIC_NEEDS, ID_CLIMATE_ACTION, ID_REFUGEE_EQUALITY, ID_US_ECONOMIC_EQUALITY, ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';

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

export const Default = story({
	totalLoans: 42,
	categoriesLoanCount: {
		[ID_WOMENS_EQUALITY]: 1,
		[ID_REFUGEE_EQUALITY]: 5,
		[ID_CLIMATE_ACTION]: 8,
		[ID_US_ECONOMIC_EQUALITY]: 1,
		[ID_BASIC_NEEDS]: 7,
	},
});
