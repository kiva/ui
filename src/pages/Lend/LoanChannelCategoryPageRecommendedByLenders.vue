<template>
	<www-page
		class="loan-channel-page category-page"
		:gray-background="true"
	>
		<loan-channel-category-recommended-by-lenders
			:enable-huge-amount="enableHugeLendAmount"
		/>

		<add-to-basket-interstitial />
	</www-page>
</template>

<script>
import updateAddToBasketInterstitial from '#src/graphql/mutation/updateAddToBasketInterstitial.graphql';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import AddToBasketInterstitial from '#src/components/Lightboxes/AddToBasketInterstitial';
import LoanChannelCategoryRecommendedByLenders from '#src/pages/Lend/LoanChannelCategoryRecommendedByLenders';
import hugeLendAmount from '#src/plugins/huge-lend-amount-mixin';

export default {
	name: 'LoanChannelCategoryPageRecommendedByLenders',
	head() {
		return {
			title: this.meta.title,
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: this.meta.description
				}
			].concat([
				{
					vmid: 'og:title',
					property: 'og:title',
					content: this.meta.title
				},
				{
					vmid: 'og:description',
					property: 'og:description',
					content: this.meta.description
				},
			]).concat([
				{
					vmid: 'twitter:title',
					name: 'twitter:title',
					content: this.meta.title
				},
				{
					name: 'twitter:description',
					vmid: 'twitter:description',
					content: this.meta.description
				}
			])
		};
	},
	components: {
		AddToBasketInterstitial,
		LoanChannelCategoryRecommendedByLenders,
		WwwPage,
	},
	mixins: [hugeLendAmount],
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			meta: {
				title: 'Loans recommended by lenders',
				// eslint-disable-next-line max-len
				description: 'Although nothing is guaranteed, loans such as these are favored by experienced lenders because they are the most likely to yield a repayment in one month and to be entirely repaid within a year.'
			}
		};
	},
	created() {
		/*
		 * Experiment Initializations
		*/

		// Add to Basket Interstitial
		this.initializeAddToBasketInterstitial();

		// Enable huge lend amount
		this.initializeHugeLendAmount();
	},
	methods: {
		initializeAddToBasketInterstitial() {
			this.apollo.mutate({
				mutation: updateAddToBasketInterstitial,
				variables: {
					active: true,
				}
			});
		},
	},
};
</script>
