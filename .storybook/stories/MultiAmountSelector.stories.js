import MultiAmountSelector from '@/components/Forms/MultiAmountSelector';

export default {
	title: 'Forms/MultiAmountSelector',
	component: MultiAmountSelector,
	args: {
		minCustomAmount: 5,
		maxCustomAmount: 1000,
	},
};

export const multiAmountSelector = (args, { argTypes }) => ({
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
			customAmount: 5,
		};
	},
	props: Object.keys(argTypes),
	template: `
		<multi-amount-selector
			id="amount-selector"
			:options="amountOptions"
			:selected="amountSelected"
			@pill-toggled="pillToggled"
			:min-custom-amount="minCustomAmount"
			:max-custom-amount="maxCustomAmount"
			@custom-amount-updated="customAmountUpdated"
			:split-pills="true"
		/>
	`,
	methods: {
		// Implementation Required in Parent Component
		// Enables tracking of selected option/key
		pillToggled(value) {
			console.log('select-amount');
			console.log(value);
			if (value === 'custom') {
				this.amountSelected = 'custom';
			} else {
				this.amountSelected = value;
			}
		},
		// Implementation Required in Parent Component
		// Enables tracking of selected option/key associated value
		customAmountUpdated(value) {
			console.log('custom-amount-updated');
			console.log(value);
		}
	}
});

