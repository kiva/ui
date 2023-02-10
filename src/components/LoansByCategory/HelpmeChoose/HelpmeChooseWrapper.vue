<template>
	<div>
		<div class="tw-w-full tw-py-2 tw-px-2">
			<h2 class="tw-text-h2 tw-text-primary">
				{{ welcomeTitle }}
			</h2>
			<p class="tw-text-base tw-text-secondary">
				{{ subTitle }}
			</p>
		</div>

		<div class="tw-w-full tw-pb-4 tw-px-2">
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
				:items-in-basket="itemsInBasket"
				:is-visitor="isVisitor"
				:user-data="userData"
				:is-loading="isLoading"
			/>
		</div>

		<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-mb-2" :class="{'tw-gap-3 tw-px-2' : enableLoanCardExp}">
			<template v-for="loan in remainingLoans">
				<kiva-classic-basic-loan-card-exp
					v-if="enableLoanCardExp"
					:key="`classic-${loan.id}`"
					:loan-id="loan.id"
					:show-action-button="true"
					:show-tags="enableLoanTags"
					:in-grid="false"
					:category-page-name="loanChannelName"
				/>
				<loan-card-controller
					v-else
					:items-in-basket="itemsInBasket"
					:is-visitor="isVisitor"
					:key="`controller-${loan.id}`"
					:loan="loan"
					loan-card-type="GridLoanCard"
					:show-tags="enableLoanTags"
				/>
			</template>
		</div>
	</div>
</template>

<script>
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KivaClassicBasicLoanCardExp from '@/components/LoanCards/KivaClassicBasicLoanCardExp';
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
		isLoading: {
			type: Boolean,
			default: true
		},
		enableLoanTags: {
			type: Boolean,
			default: false
		},
		enableLoanCardExp: {
			type: Boolean,
			default: false
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
		HelpmeChooseRecommendations,
		KivaClassicBasicLoanCardExp,
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
			let eventProperty = '';
			switch (evt) {
				case 'amountLeft':
					this.subCategoryTitle = 'Almost funded';
					eventProperty = 'almost-funded';
					break;
				case 'personalized':
					this.subCategoryTitle = 'Recommended for you';
					eventProperty = 'recommended';
					break;
				case 'researchScore':
					this.subCategoryTitle = 'Research backed impact';
					eventProperty = 'research-backed';
					break;
				case 'popularityScore':
					this.subCategoryTitle = 'Popular loans';
					eventProperty = 'popular-loans';
					break;
				default:
					this.subCategoryTitle = '';
			}

			this.$kvTrackEvent(
				'event-tracking',
				'click',
				'help-choosing-category',
				eventProperty
			);
		}
	}
};
</script>
