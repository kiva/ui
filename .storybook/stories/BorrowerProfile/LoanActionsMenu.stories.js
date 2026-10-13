import LoanActionsMenu from '#src/components/BorrowerProfile/LoanActionsMenu';

export default {
	title: 'Components/BorrowerProfile/LoanActionsMenu',
	component: LoanActionsMenu,
};

export const Default = () => ({
	components: { LoanActionsMenu },
	data() {
		return { lastAction: '' };
	},
	template: `
		<div class="tw-p-4 tw-flex tw-justify-end tw-items-center tw-gap-4">
			<p class="tw-text-small">Last action: {{ lastAction || 'none' }}</p>
			<loan-actions-menu
				@share="lastAction = 'share'"
				@loan-details="lastAction = 'loan-details'"
			/>
		</div>
	`,
});
