<template>
	<div class="tw-px-1 lg:tw-px-2">
		<div class="tw-w-full tw-pb-2">
			<h2 class="tw-text-h2 tw-text-primary">
				{{ welcomeTitle }}
			</h2>
			<p class="tw-text-base tw-text-secondary">
				{{ subTitle }}
			</p>
		</div>

		<div class="tw-w-full tw-pb-2">
			<div v-show="triggersVisible" class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-2 lg:tw-gap-4">
				<helpme-choose-trigger
					variant="amountLeft"
					@click="showLoans"
				/>
				<helpme-choose-trigger
					:variant="secondOption"
					@click="showLoans"
				/>
				<helpme-choose-trigger
					variant="researchScore"
					@click="showLoans"
				/>
			</div>

			<helpme-choose-recommendations
				v-show="!triggersVisible"
				@show-triggers="triggersVisible = true"
				:loans="loans"
			/>
		</div>

		<div class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
			<loan-card-controller
				v-for="loan in remainingLoans"
				:items-in-basket="itemsInBasket"
				:is-visitor="isVisitor"
				:key="loan.id"
				:loan="loan"
				loan-card-type="GridLoanCard"
			/>
		</div>
	</div>
</template>

<script>
import LoanCardController from '@/components/LoanCards/LoanCardController';
import HelpmeChooseTrigger from './HelpmeChooseTrigger';
import HelpmeChooseRecommendations from './HelpmeChooseRecommendations';

export default {
	name: 'HelpmeChooseWrapper',
	props: {
		remainingLoans: {
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
		loanChannelName: {
			type: String,
			default: ''
		},
		loans: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			triggersVisible: true,
			subCategoryTitle: '',
		};
	},
	components: {
		LoanCardController,
		HelpmeChooseTrigger,
		HelpmeChooseRecommendations
	},
	computed: {
		welcomeTitle() {
			if (!this.triggersVisible) {
				return 'Borrowers we think you’ll like';
			}
			return this.isVisitor ? 'Need help choosing?' : `Need help choosing, ${this.userData.firstName}?`;
		},
		subTitle() {
			if (!this.triggersVisible) {
				return `${this.loanChannelName} + ${this.subCategoryTitle}`;
			}
			return 'Choose a subcategory and we\'ll do the rest.';
		},
		secondOption() {
			return this.isVisitor ? 'popularityScore' : 'personalized';
		},
	},
	methods: {
		showLoans(evt) {
			this.triggersVisible = false;
			this.$emit('update', evt);
			switch (evt) {
				case 'amountLeft':
					this.subCategoryTitle = 'Almost funded';
					break;
				case 'personalized':
					this.subCategoryTitle = 'Recommended for you';
					break;
				case 'researchScore':
					this.subCategoryTitle = 'Research backed impact';
					break;
				case 'popularityScore':
					this.subCategoryTitle = 'Popular loans';
					break;
				default:
					this.subCategoryTitle = '';
			}
		}
	}
};
</script>
