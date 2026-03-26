import DescriptionListItem from '#src/components/BorrowerProfile/DescriptionListItem';

export default {
	title: 'Components/BorrowerProfile/DescriptionListItem',
	component: DescriptionListItem,
};

export const Default = () => ({
	components: { DescriptionListItem },
	template: `
		<dl>
			<description-list-item
				term="Loan length"
				details="14 months"
			/>
		</dl>
	`,
});

export const NumericDetails = () => ({
	components: { DescriptionListItem },
	template: `
		<dl>
			<description-list-item
				term="Repayment schedule"
				:details="12"
			/>
		</dl>
	`,
});

export const MultipleItems = () => ({
	components: { DescriptionListItem },
	template: `
		<dl>
			<description-list-item
				term="Loan length"
				details="14 months"
			/>
			<description-list-item
				term="Repayment schedule"
				details="Monthly"
			/>
			<description-list-item
				term="Disbursed date"
				details="March 15, 2026"
			/>
		</dl>
	`,
});
