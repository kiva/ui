<template>
	<www-page
		class="loan-channel-page category-page"
		:gray-background="pageLayout === 'control'"
	>
		<loan-channel-category-control v-if="pageLayout === 'control'" />
		<loan-channel-category-experiment v-if="pageLayout === 'experiment'" />

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
import LoanChannelCategoryExperiment from '@/pages/Lend/LoanChannelCategoryExperiment';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';

const pageQuery = gql`
	query LoanChannelCategoryPageExperiments {
		general {
			addToBasketPopup: uiExperimentSetting(key: "add_to_basket_v2") {
				key
				value
			}
			lbcLayout: uiExperimentSetting(key: "lend_by_category_v2") {
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
		LoanChannelCategoryExperiment,
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
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			}).then(() => {
				return Promise.all([
					client.query({ query: experimentAssignmentQuery, variables: { id: 'lend_by_category_v2' } }),
					client.query({ query: experimentAssignmentQuery, variables: { id: 'add_to_basket_v2' } }),
				]);
			});
		}
	},
	created() {
		/*
		 * Experiment Initializations
		*/

		// Add to Basket Interstitial
		this.initializeAddToBasketInterstitial();
		// Experimental page layout
		this.initializeExperimentalLayout();
	},
	computed: {
		targetedLoanChannel() {
			return this.$route?.params?.category ?? '';
		},
		// categories to run ACK-247 experiment on
		testCategories() {
			return [
				'loans-to-women',
				'women',
				'kiva-u-s',
				'agriculture',
				'eco-friendly',
				'refugees-and-i-d-ps',
				'shelter',
				'single-parents',
				'conflict-zones',
				'ending-soon'
			];
		}
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
		},
		initializeExperimentalLayout() {
			const layoutEXP = this.apollo.readFragment({
				id: 'Experiment:lend_by_category_v2',
				fragment: experimentVersionFragment,
			}) || {};

			// Only certain categories are eligible for the experiment
			if (this.testCategories.includes(this.targetedLoanChannel)) {
				this.pageLayout = layoutEXP.version === 'shown' ? 'experiment' : 'control';

				// Fire Event for Exp ACK-247 Status
				if (layoutEXP.version && layoutEXP.version !== 'unassigned') {
					this.$kvTrackEvent(
						'lend-by-category',
						'EXP-ACK-247-Mar2022',
						layoutEXP.version === 'shown' ? 'b' : 'a'
					);
				}
			}
		}
	},
};
</script>
