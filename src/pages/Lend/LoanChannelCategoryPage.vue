<template>
	<www-page
		class="loan-channel-page category-page"
		:gray-background="pageLayout === 'control'"
	>
		<loan-channel-category-control
			:enable-loan-tags="enableLoanTags"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
		/>

		<add-to-basket-interstitial />
	</www-page>
</template>

<script>
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import AddToBasketInterstitial from '@/components/Lightboxes/AddToBasketInterstitial';
import LoanChannelCategoryControl from '@/pages/Lend/LoanChannelCategoryControl';
import retryAfterExpiredBasket from '@/plugins/retry-after-expired-basket-mixin';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '@/plugins/five-dollars-test-mixin';
import { trackExperimentVersion } from '@/util/experiment/experimentUtils';

const CATEGORY_REDIRECT_EXP_KEY = 'category_filter_redirect';

const getHasEverLoggedIn = client => !!(client.readQuery({ query: hasEverLoggedInQuery })?.hasEverLoggedIn);

export default {
	name: 'LoanChannelCategoryPage',
	components: {
		AddToBasketInterstitial,
		LoanChannelCategoryControl,
		WwwPage,
	},
	mixins: [retryAfterExpiredBasket, fiveDollarsTest],
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			meta: {
				title: undefined,
				description: undefined
			},
			pageLayout: 'control',
			enableLoanTags: false,
		};
	},
	apollo: {
		preFetch(config, client, args) {
			return client.query({ query: experimentAssignmentQuery, variables: { id: CATEGORY_REDIRECT_EXP_KEY } })
				.then(() => {
					const query = args?.route?.query ?? {};

					// Redirect to /lend-category-beta/** if user has previously signed in and experiment is assigned
					const { version } = client.readFragment({
						id: `Experiment:${CATEGORY_REDIRECT_EXP_KEY}`,
						fragment: experimentVersionFragment,
					}) ?? {};

					const category = args?.route?.params?.category ?? '';

					if (version === 'b' && getHasEverLoggedIn(client)) {
						return Promise.reject({ path: `/lend-category-beta/${category}`, query });
					}

					return Promise.all([
						client.query({ query: experimentAssignmentQuery, variables: { id: 'loan_tags' } }),
						client.query({ query: experimentAssignmentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } }),
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

		// Initialize Loan Tags Experiment
		this.initializeLoanTags();

		this.initializeFiveDollarsNotes();
	},
	mounted() {
		if (getHasEverLoggedIn(this.apollo)) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				CATEGORY_REDIRECT_EXP_KEY,
				'EXP-CORE-1205-May2023'
			);
		}
	},
	methods: {
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
