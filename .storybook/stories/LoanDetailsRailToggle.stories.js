import LoanDetailsRailToggle from '#src/components/BorrowerProfile/LoanDetailsRailToggle';

export default {
	title: 'Components/BorrowerProfile/LoanDetailsRailToggle',
	component: LoanDetailsRailToggle,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanDetailsRailToggle },
		setup() { return args; },
		template: '<loan-details-rail-toggle :model-value="modelValue" />',
	});
	return template;
};

export const Off = story({
	modelValue: false,
});

export const On = story({
	modelValue: true,
});
