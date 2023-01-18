<template>
	<www-page
		class="loan-channel-page category-page"
		:gray-background="pageLayout === 'control'"
	>
		<component
			:is="pageLayoutComponent"
			:enable-helpme-choose="enableHelpmeChoose"
			:enable-loan-tags="enableLoanTags"
		/>

		<add-to-basket-interstitial />
	</www-page>
</template>

<script>
import { gql } from '@apollo/client';
import { preFetchAll } from '@/util/apolloPreFetch';
import {
	getExperimentSettingCached,
	trackExperimentVersion,
} from '@/util/experimentUtils';
import { fetchExperimentSettings } from '@/util/experimentPreFetch';

import updateExperimentVersion from '@/graphql/mutation/updateExperimentVersion.graphql';
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

import WwwPage from '@/components/WwwFrame/WwwPage';
import AddToBasketInterstitial from '@/components/Lightboxes/AddToBasketInterstitial';

const LoanChannelCategoryControl = () => import('@/pages/Lend/LoanChannelCategoryControl');
const LoanChannelCategoryClimateExperiment = () => import('@/pages/Lend/LoanChannelCategoryClimateExperiment');

const pageQuery = gql`
	query LoanChannelCategoryPageExperiments {
		general {
			lbcEcoLayout: uiExperimentSetting(key: "lend_by_category_carousel_layout") {
				key
				value
			}
			ecoChallenge: uiExperimentSetting(key: "eco_challenge") {
				key
				value
			}
			helpmeChoose: uiExperimentSetting(key: "helpme_choose") {
				key
				value
			}
			loanTags: uiExperimentSetting(key: "loan_tags") {
				key
				value
			}
		}
	}
`;

// categories to run ACK-247 experiment on
const testCategories = [
	'eco-friendly-loans',
	'eco-friendly'
];

export default {
	name: 'LoanChannelCategoryPage',
	components: {
		AddToBasketInterstitial,
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
			pageLayoutComponent: null,
			enableHelpmeChoose: false,
			enableLoanTags: false,
		};
	},
	apollo: {
		preFetch(config, client, args) {
			const { route } = args;
			const { params, query } = route;
			return client.query({
				query: pageQuery
			}).then(() => {
				let gameExperimentAssignments;
				// If query ?game=on is present, set both of the experiments to version b
				// These queries are performed here, with a different query param instead of setuiab
				// so that we can guarantee that version b of the experiments will load on first load.
				if (query?.game === 'on') {
					gameExperimentAssignments = [
						client.query(
							{
								query: experimentAssignmentQuery,
								variables: { id: 'lend_by_category_carousel_layout' }
							}
						).then(() => {
							return client.mutate({
								mutation: updateExperimentVersion,
								variables: {
									id: 'lend_by_category_carousel_layout',
									version: 'b'
								}
							});
						}).then(() => {
							return fetchExperimentSettings('lend_by_category_carousel_layout', client);
						}),
						client.query(
							{
								query: experimentAssignmentQuery,
								variables: { id: 'eco_challenge' }
							}
						).then(() => {
							return client.mutate({
								mutation: updateExperimentVersion,
								variables: {
									id: 'eco_challenge',
									version: 'b'
								}
							});
						}).then(() => {
							return fetchExperimentSettings('eco_challenge', client);
						}),
						client.query(
							{
								query: experimentAssignmentQuery,
								variables: { id: 'loan_channel_flss_query_v1' }
							}
						).then(() => {
							return client.mutate({
								mutation: updateExperimentVersion,
								variables: {
									id: 'loan_channel_flss_query_v1',
									version: 'b'
								}
							});
						}).then(() => {
							return fetchExperimentSettings('loan_channel_flss_query_v1', client);
						})
					];
				} else {
					gameExperimentAssignments = [client.query(
						{
							query: experimentAssignmentQuery,
							variables: { id: 'lend_by_category_carousel_layout' }
						}
					)];
				}
				return Promise.all([
					...gameExperimentAssignments,
					client.query({ query: experimentAssignmentQuery, variables: { id: 'helpme_choose' } }),
					client.query({ query: experimentAssignmentQuery, variables: { id: 'loan_tags' } }),
				]);
			}).then(results => {
				// manipulate experiment results format
				const newResults = results.map(promiseResponse => {
					if (promiseResponse?.data?.updateExperimentVersion) {
						return {
							data: {
								experiment: promiseResponse.data.updateExperimentVersion
							}
						};
					}
					return promiseResponse;
				});
				const experimentSettings = newResults.map(result => result.data.experiment);
				const ecoLayoutIsShown = experimentSettings
					.find(setting => setting.id === 'lend_by_category_carousel_layout')?.version === 'b';
				if (ecoLayoutIsShown && testCategories.includes(params.category)) {
					// prefetch experimental layout
					return LoanChannelCategoryClimateExperiment();
				}
				return LoanChannelCategoryControl();
			}).then(resolvedImport => {
				// Call preFetch for page layout component
				const component = resolvedImport.default;
				return preFetchAll([component], client, args);
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
		this.initializeExperimentalPageLayout();
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
	},
	computed: {
		targetedLoanChannel() {
			return this.$route?.params?.category ?? '';
		},
	},
	watch: {
		/** If route params change, execute this experiment init
		 * function again to update page layout if needed. This
		 * allows navigation from an experiment category to a non
		 * experiment category for users in the experiment.
		*/
		'$route.params.category': {
			handler() {
				// Experimental page layout
				this.initializeExperimentalPageLayout();
			},
			deep: true,
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
		initializeExperimentalPageLayout() {
			// Only certain categories are eligible for the experiment
			if (testCategories.includes(this.targetedLoanChannel)) {
				const carouselLayoutExp = getExperimentSettingCached(this.apollo, 'lend_by_category_carousel_layout');
				if (carouselLayoutExp?.enabled) {
					const { version } = trackExperimentVersion(
						this.apollo,
						this.$kvTrackEvent,
						'Lending',
						'lend_by_category_carousel_layout',
						'EXP-ACK-357-Aug2022',
					);
					this.pageLayout = version === 'b' ? 'experiment' : 'control';
				}
			} else {
				this.pageLayout = 'control';
			}
			this.pageLayoutComponent = this.pageLayout === 'experiment'
				? LoanChannelCategoryClimateExperiment : LoanChannelCategoryControl;
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
