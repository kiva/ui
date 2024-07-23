import MultiAmountSelector from '#src/components/Forms/MultiAmountSelector';

export default {
	title: 'Forms/MultiAmountSelector',
	component: MultiAmountSelector,
	args: {
		minCustomAmount: 5,
		maxCustomAmount: 1000,
	},
};

export const Default = (args, { argTypes }) => ({
	components: {
		MultiAmountSelector
	},
	data() {
		return {
			amountOptions: [
				{
					title: '$5',
					key: '5',
				},
				{
					title: '$10',
					key: '10',
				},
				{
					title: '$25',
					key: '25',
				},
				{
					title: '$50',
					key: '50',
				},
				{
					title: 'Other',
					key: 'custom'
				}
			],
			amountSelected: '25',
		};
	},
	props: Object.keys(argTypes),
	template: `
		<multi-amount-selector
			id="amount-selector"
			:options="amountOptions"
			:selected="amountSelected"
			@pill-toggled="handlePillToggled"
			:min-custom-amount="minCustomAmount"
			:max-custom-amount="maxCustomAmount"
			@custom-amount-updated="handleCustomAmountUpdated"
			:split-pills="true"
			:custom-amount="25"
		/>
	`,
	methods: {
		// Implementation Required in Parent Component
		// Enables tracking of selected option/key
		handlePillToggled(value) {
			if (value === 'custom') {
				this.amountSelected = 'custom';
			} else {
				this.amountSelected = value;
			}
		},
		// Implementation Required in Parent Component
		// Enables tracking of selected option/key associated value
		handleCustomAmountUpdated(value) { }
	}
});

