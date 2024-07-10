<template>
	<div v-if="!!variation" class="tw-mt-1 tw-ml-1 tw-absolute tw-z-1">
		<div
			:class="tagColor"
			class="tw-rounded-full"
		>
			<kv-material-icon
				:icon="iconName"
				class="tw-align-middle tw-ml-1"
				:style="{
					width: '15px',
					color: textColor
				}"
			/>
			<span
				class="tw-font-medium tw-align-middle tw-mr-1"
				:style="{
					fontSize: '14px',
					color: textColor
				}"
			>
				{{ tagText }}
			</span>
		</div>
	</div>
</template>

<script>
import { mdiTimerSandComplete, mdiFlag, mdiHeart } from '@mdi/js';
import { differenceInDays, parseISO } from 'date-fns';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LoanTag',
	components: {
		KvMaterialIcon
	},
	props: {
		loan: {
			type: Object,
			required: true,
		},
		amountLeft: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			mdiTimerSandComplete,
			mdiFlag,
			mdiHeart,
		};
	},
	mounted() {
		if (this.variation) {
			this.$kvTrackEvent(
				'loan-card',
				'show',
				`tag-${this.variation}`,
			);
		}
	},
	computed: {
		variation() {
			if (differenceInDays(parseISO(this.loan?.plannedExpirationDate), Date.now()) <= 3) {
				return 'ending-soon';
			} if (this.amountLeft < 100 && this.amountLeft > 0) {
				return 'almost-funded';
			} if (this.loan?.matchingText) {
				return 'matched-loan';
			}
			return null;
		},
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
		textColor() {
			return this.variation === 'matched-loan' ? '#ffffff' : '#000000';
		}
	},
};
</script>
