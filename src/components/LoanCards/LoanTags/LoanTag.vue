<template>
	<div
		:class="tagColor"
		class="tw-rounded-full"
	>
		<kv-material-icon
			:icon="iconName"
			class="tw-align-middle tw-ml-1"
			style="width: 15px;"
			:style="{
				width: '15px',
				color: useWhiteText ? '#ffffff' : '#000000'
			}"
		/>
		<span
			class="tw-font-medium tw-align-middle tw-mr-1"
			:style="{
				fontSize: '14px',
				color: useWhiteText ? '#ffffff' : '#000000'
			}"
		>
			{{ tagText }}
		</span>
	</div>
</template>

<script>
import { mdiTimerSandComplete, mdiFlag, mdiHeart } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LoanTag',
	components: {
		KvMaterialIcon
	},
	props: {
		variation: {
			type: String,
			default: 'endingSoon'
		}
	},
	mounted() {
		this.$kvTrackEvent(
			'loan-card',
			'view-tag',
			this.variation
		);
	},
	computed: {
		iconName() {
			switch (this.variation) {
				case 'almostFunded': return mdiFlag;
				case 'matchedLoan': return mdiHeart;
				default: return mdiTimerSandComplete;
			}
		},
		tagText() {
			switch (this.variation) {
				case 'almostFunded': return 'Almost Funded';
				case 'matchedLoan': return 'Matched Loan';
				default: return 'Ending Soon';
			}
		},
		tagColor() {
			switch (this.variation) {
				case 'almostFunded': return 'tw-bg-brand-200';
				case 'matchedLoan': return 'tw-bg-danger';
				default: return 'tw-bg-caution';
			}
		},
		useWhiteText() {
			return this.variation === 'matchedLoan';
		}
	},
	data() {
		return { mdiTimerSandComplete, mdiFlag, mdiHeart };
	}
};
</script>
