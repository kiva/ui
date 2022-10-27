<template>
	<div class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-x-2 tw-w-full tw-items-start">
		<div class="tw-flex tw-flex-col tw-gap-1 lg:tw-gap-1.5 tw-w-full lg:tw-basis-1/4">
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
		<div class="tw-pt-2 lg:tw-pt-0 tw-w-full lg:tw-basis-3/4">
			<loan-card-controller
				style="margin-top:0 !important;"
				:items-in-basket="itemsInBasket"
				:is-visitor="isVisitor"
				:is-logged-in="!isVisitor"
				:user-id="userId !== null ? userId.toString() : null"
				:loan="loanData"
				loan-card-type="ListLoanCard"
				:rounded-corners="true"
			/>
		</div>
		<button @click="goBack" class="lg:tw-hidden tw-flex tw-items-center tw-justify-center tw-gap-1 tw-text-action tw-text-small tw-mt-1 tw-w-full">
			<kv-material-icon
				class="tw-w-2 tw-h-2"
				:icon="mdiRefresh"
			/> Start over
		</button>
	</div>
</template>

<script>
import { mdiRefresh } from '@mdi/js';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import HelpmeChooseBorrowerSelector from './HelpmeChooseBorrowerSelector';

export default {
	name: 'HelpmeChooseRecommendations',
	components: {
		HelpmeChooseBorrowerSelector,
		KvMaterialIcon,
		LoanCardController
	},
	props: {
		loans: {
			type: Array,
			default: () => []
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		isVisitor: {
			type: Boolean,
			default: false
		},
		userData: {
			type: Object,
			default: () => {}
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
		userId() {
			if (this.userData && this.userData.id) return this.userData.id;
			return null;
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
			return loan?.activity?.name.slice(0, 19) ?? '';
		},
		getImageUrl(loan) {
			return loan?.image?.default ?? '';
		}
	}
};
</script>
