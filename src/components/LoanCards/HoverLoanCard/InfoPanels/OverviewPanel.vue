<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Overview
		</template>
		<p>
			A loan of $50,000 helps to provide 2,900 families in the Andes with sustainable sphagnum
			moss harvesting training and employment that will double their annual incomes.
		</p>
	</info-panel>
</template>

<script>
import InfoPanel from './InfoPanel';

export default {
	components: {
		InfoPanel,
	},
	props: {
		expandable: {
			type: Boolean,
			default: true,
		},
		loanId: {
			type: String,
			default: '',
		},
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: {
						country: {}
					},
					image: {}
				};
			},
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-overview-panel-ex-${this.expandable ? '1' : '0'}`;
		},
		loanId() {
			return this.loan.id;
		},
	}
};
</script>
