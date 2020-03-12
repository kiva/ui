<template>
	<div data-test="recommended-loans-row" class="loan-category-row">
		<component
			:is="categoryRowType"
			:loan-channel="loanChannel"
			:items-in-basket="itemsInBasket"
			:row-number="-2"
			:set-id="setId"
			:is-logged-in="isLoggedIn"
			:show-category-description="showCategoryDescription"
			:show-expandable-loan-cards="showExpandableLoanCards"
			@scrolling-row="$emit('scrolling-row')"
		/>
	</div>
</template>

<script>
import CategoryRowHover from '@/components/LoansByCategory/CategoryRowHover';

export default {
	components: {
		CategoryRowHover,
	},
	props: {
		categoryRowType: {
			type: Object,
			default: CategoryRowHover,
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		loanChannel: {
			type: Object,
			default: () => {},
		},
		setId: {
			type: String,
			default: '',
		},
		showCategoryDescription: {
			type: Boolean,
			default: true,
		},
		showExpandableLoanCards: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
