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
		// lg:tw-flex visibility is desktop-only; force display so the control shows in the story frame.
		template: `
			<div class="tw-flex tw-justify-end" style="min-width: 360px;">
				<loan-details-rail-toggle :checked="checked" :loan-id="loanId" class="!tw-flex" />
			</div>
		`,
	});
	return template;
};

export const Off = story({
	checked: false,
	loanId: 12345,
});

export const On = story({
	checked: true,
	loanId: 12345,
});
