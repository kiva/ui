<template>
	<div class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-3 tw-w-full">
		<div class="tw-flex tw-flex-col tw-gap-1 lg:tw-gap-1.5 lg:tw-w-1/3">
			<helpme-choose-borrower-selector
				v-for="(loan, index) in loans"
				:key="loan.id"
				:image-url="getImageUrl(loan)"
				:name="loan.name"
				:tag="getActivityName(loan)"
				:selected="selectedLoan"
				:index="index"
				@select="selectLoan"
			/>

			<!-- eslint-disable max-len -->
			<button @click="goBack" class="tw-hidden lg:tw-flex tw-items-center tw-justify-center tw-gap-1 tw-text-action tw-text-small tw-mt-1">
				<kv-material-icon
					class="tw-w-2 tw-h-2"
					:icon="mdiRefresh"
				/> Start over
			</button>
		</div>
		<div>
			<!-- Loan Card code -->
		</div>
		<button @click="goBack" class="lg:tw-hidden tw-flex tw-items-center tw-justify-center tw-gap-1 tw-text-action tw-text-small tw-mt-1">
			<kv-material-icon
				class="tw-w-2 tw-h-2"
				:icon="mdiRefresh"
			/> Start over
		</button>
	</div>
</template>

<script>
import { mdiRefresh } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import HelpmeChooseBorrowerSelector from './HelpmeChooseBorrowerSelector';

export default {
	name: 'HelpmeChooseRecommendations',
	components: {
		HelpmeChooseBorrowerSelector,
		KvMaterialIcon
	},
	props: {
		loans: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			mdiRefresh,
			selectedLoan: 0,
		};
	},
	computed: {
		loanData() {
			return this.loans[this.selectedLoan];
		},
		activityName() {
			return this.loans[this.selectedLoan]?.activity?.name ?? '';
		},
		imageUrl(evt) {
			console.log(evt);
			return this.loans[this.selectedLoan]?.activity?.name ?? '';
		}
	},
	methods: {
		selectLoan(evt) {
			this.selectedLoan = evt;
		},
		goBack() {
			this.selectedLoan = 0;
			this.$emit('show-triggers');
		},
		getActivityName(loan) {
			return loan?.activity?.name ?? '';
		},
		getImageUrl(loan) {
			return loan?.image?.default ?? '';
		}
	}
};
</script>
