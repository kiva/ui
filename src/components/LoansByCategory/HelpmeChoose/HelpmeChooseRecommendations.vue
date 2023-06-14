<template>
	<div class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-x-2 tw-w-full tw-items-start">
		<div v-if="isLoading" class="tw-flex tw-flex-col tw-gap-1 lg:tw-gap-1.5 tw-w-full lg:tw-basis-1/4">
			<kv-loading-placeholder
				class="tw-mb-1 tw-rounded tw-w-full lg:tw-h-10"
				style="min-height: 50px;"
			/>
			<kv-loading-placeholder
				class="tw-mb-1 tw-rounded tw-w-full lg:tw-h-10"
				style="min-height: 50px;"
			/>
			<kv-loading-placeholder
				class="tw-mb-1 tw-rounded tw-w-full lg:tw-h-10"
				style="min-height: 50px;"
			/>
		</div>
		<div v-else class="tw-flex tw-flex-col tw-gap-1 lg:tw-gap-1.5 tw-w-full lg:tw-basis-1/4">
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
			<button
				@click="goBack"
				class="tw-hidden lg:tw-flex tw-items-center tw-justify-center tw-gap-1 tw-text-action tw-text-small tw-mt-1"
				v-kv-track-event="['event-tracking', 'click', 'help-choosing-go-back']"
			>
				<kv-material-icon
					class="tw-w-2 tw-h-2"
					:icon="mdiRefresh"
				/> Start over
			</button>
		</div>
		<div class="tw-pt-2 lg:tw-pt-0 tw-w-full lg:tw-basis-3/4">
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-1 tw-rounded tw-w-full" :style="{height: '283px'}"
			/>
			<loan-card-controller
				v-else
				style="margin-top: 0 !important; min-height: 283px;"
				:items-in-basket="itemsInBasket"
				:is-visitor="isVisitor"
				:is-logged-in="!isVisitor"
				:user-id="userId !== null ? userId.toString() : null"
				:loan="loanData"
				loan-card-type="ListLoanCard"
				:rounded-corners="true"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				@add-to-basket="handleAddToBasket"
			/>
		</div>
		<button
			@click="goBack"
			class="lg:tw-hidden tw-flex tw-items-center tw-justify-center tw-gap-1 tw-text-action tw-text-small tw-mt-1 tw-w-full"
			v-kv-track-event="['event-tracking', 'click', 'help-choosing-go-back']"
		>
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
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import HelpmeChooseBorrowerSelector from './HelpmeChooseBorrowerSelector';

export default {
	name: 'HelpmeChooseRecommendations',
	components: {
		HelpmeChooseBorrowerSelector,
		KvMaterialIcon,
		LoanCardController,
		KvLoadingPlaceholder
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
		isLoading: {
			type: Boolean,
			default: true
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		}
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
			let eventProperty = '';
			switch (evt) {
				case 0:
					eventProperty = 'help-me-choose-loan-1';
					break;
				case 1:
					eventProperty = 'help-me-choose-loan-2';
					break;
				case 2:
					eventProperty = 'help-me-choose-loan-3';
					break;
				default:
					eventProperty = '';
			}
			this.$kvTrackEvent(
				'loan-card',
				'show',
				eventProperty
			);
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
		},
		handleAddToBasket() {
			this.$kvTrackEvent(
				'loan-card',
				'add-to-basket',
				'help-choosing'
			);
		}
	}
};
</script>
