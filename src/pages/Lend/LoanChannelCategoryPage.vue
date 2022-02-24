<template>
	<www-page
		class="loan-channel-page category-page"
		:gray-background="pageLayout === 'control'"
	>
		<div v-if="pageLayout === 'control'">
			<loan-channel-category-control />
		</div>
		<div v-if="pageLayout === 'experiment'">
			<!-- TODO -->
		</div>

		<add-to-basket-interstitial v-show="addToBasketExpActive" />
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import AddToBasketInterstitial from '@/components/Lightboxes/AddToBasketInterstitial';
import LoanChannelCategoryControl from '@/pages/Lend/LoanChannelCategoryControl';

const pageQuery = gql`
	query LoanChannelCategoryPageAddToBasketExp {
		general {
			addToBasketPopup: uiExperimentSetting(key: "add_to_basket_v2") {
				key
				value
			}
		}
	}
`;

export default {
	components: {
		AddToBasketInterstitial,
		LoanChannelCategoryControl,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			addToBasketExpActive: false,
			pageLayout: 'control'
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
	},
	created() {
		/*
		 * Experiment Initializations
		*/

		// Add to Basket Interstitial
		this.initializeAddToBasketInterstitial();
	},
	methods: {
		initializeAddToBasketInterstitial() {
			// get assignment for add to basket interstitial
			const addToBasketPopupEXP = this.apollo.readFragment({
				id: 'Experiment:add_to_basket_v2',
				fragment: experimentVersionFragment,
			}) || {};
			this.addToBasketExpActive = addToBasketPopupEXP.version === 'shown';
			// Update @client state if interstitial exp is active
			if (this.addToBasketExpActive) {
				this.apollo.mutate({
					mutation: updateAddToBasketInterstitial,
					variables: {
						active: true,
					}
				});
			}
			// Fire Event for Exp CASH-612 Status
			if (addToBasketPopupEXP.version && addToBasketPopupEXP.version !== 'unassigned') {
				this.$kvTrackEvent(
					'Lending',
					'EXP-CASH-612-Apr2019',
					this.addToBasketExpActive ? 'b' : 'a'
				);
			}
		}
	},
};
</script>
