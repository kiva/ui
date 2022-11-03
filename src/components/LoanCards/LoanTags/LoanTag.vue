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
			default: 'ending-soon'
		}
	},
	mounted() {
		this.$kvTrackEvent(
			'loan-card',
			'show',
			'view-loan-tag',
			this.variation
		);
	},
	computed: {
		iconName() {
			switch (this.variation) {
				case 'almost-funded': return mdiFlag;
				case 'matched-loan': return mdiHeart;
				default: return mdiTimerSandComplete;
			}
		},
		tagText() {
			switch (this.variation) {
				case 'almost-funded': return 'Almost Funded';
				case 'matched-loan': return 'Matched Loan';
				default: return 'Ending Soon';
			}
		},
		tagColor() {
			switch (this.variation) {
				case 'almost-funded': return 'tw-bg-brand-200';
				case 'matched-loan': return 'tw-bg-danger';
				default: return 'tw-bg-caution';
			}
		},
		useWhiteText() {
			return this.variation === 'matched-loan';
		}
	},
	data() {
		return { mdiTimerSandComplete, mdiFlag, mdiHeart };
	}
};
</script>
