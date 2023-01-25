<template>
	<www-page
		class="loan-channel-page category-page"
		:gray-background="pageLayout === 'control'"
	>
		<loan-channel-category-control
			:enable-helpme-choose="enableHelpmeChoose"
			:enable-loan-tags="enableLoanTags"
			:enable-loan-card-rounded="enableLoanCardRounded"
		/>

		<add-to-basket-interstitial />
	</www-page>
</template>

<script>
import { gql } from '@apollo/client';
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

import WwwPage from '@/components/WwwFrame/WwwPage';
import AddToBasketInterstitial from '@/components/Lightboxes/AddToBasketInterstitial';

import LoanChannelCategoryControl from '@/pages/Lend/LoanChannelCategoryControl';

const pageQuery = gql`
	query LoanChannelCategoryPageExperiments {
		general {
			helpmeChoose: uiExperimentSetting(key: "helpme_choose") {
				key
				value
			}
			loanTags: uiExperimentSetting(key: "loan_tags") {
				key
				value
			}
			newLoanCard: uiExperimentSetting(key: "new_loan_card") {
				key
				value
			}
		}
	}
`;

export default {
	name: 'LoanChannelCategoryPage',
	components: {
		AddToBasketInterstitial,
		LoanChannelCategoryControl,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			meta: {
				title: undefined,
				description: undefined
			},
			pageLayout: 'control',
			enableHelpmeChoose: false,
			enableLoanTags: false,
			enableLoanCardRounded: false,
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			}).then(() => {
				return Promise.all([
					client.query({ query: experimentAssignmentQuery, variables: { id: 'helpme_choose' } }),
					client.query({ query: experimentAssignmentQuery, variables: { id: 'loan_tags' } }),
					client.query({ query: experimentAssignmentQuery, variables: { id: 'new_loan_card' } }),
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
		// Initialize Help Me Choose Experiment
		if (this.targetedLoanChannel === 'women'
				|| this.targetedLoanChannel === 'kiva-u-s'
				|| this.targetedLoanChannel === 'mission-driven-orgs'
				|| this.targetedLoanChannel === 'short-term-loans'
		) {
			this.initializeHelpmeChoose();
		} else {
			this.initializeLoanTags();
		}

		// Initialize New Loan Card Experiment
		this.initializeNewLoanCardTest();
	},
	computed: {
		targetedLoanChannel() {
			return this.$route?.params?.category ?? '';
		},
	},
	methods: {
		initializeNewLoanCardTest() {
			const loanCardExperiment = this.apollo.readFragment({
				id: 'Experiment:new_loan_card',
				fragment: experimentVersionFragment,
			}) || {};
			this.enableLoanCardRounded = loanCardExperiment.version === 'b';
			if (loanCardExperiment.version) {
				this.$kvTrackEvent(
					'Lending',
					'EXP-CORE-941-Feb2023',
					loanCardExperiment.version
				);
			}
		},
		initializeLoanTags() {
			const loanTagsExperiment = this.apollo.readFragment({
				id: 'Experiment:loan_tags',
				fragment: experimentVersionFragment,
			}) || {};
			this.enableLoanTags = loanTagsExperiment.version === 'b';
			if (loanTagsExperiment.version) {
				this.$kvTrackEvent(
					'Lending',
					'EXP-CORE-792-Oct2022',
					loanTagsExperiment.version
				);
			}
		},
		initializeHelpmeChoose() {
			const helpmeChooseExperiment = this.apollo.readFragment({
				id: 'Experiment:helpme_choose',
				fragment: experimentVersionFragment,
			}) || {};
			this.enableHelpmeChoose = helpmeChooseExperiment.version === 'b';
			if (helpmeChooseExperiment.version) {
				this.$kvTrackEvent(
					'Lending',
					'EXP-CORE-771-Oct2022',
					helpmeChooseExperiment.version
				);
			}
		},
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
