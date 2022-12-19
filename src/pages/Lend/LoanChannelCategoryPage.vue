<template>
	<www-page
		class="loan-channel-page category-page"
		:gray-background="pageLayout === 'control'"
	>
		<component
			:is="pageLayoutComponent"
			:enable-quick-filters="enableQuickFilters"
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
			quickFilters: uiExperimentSetting(key: "quick_filters") {
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

const imageRequire = require.context('@/assets/images/category-share-experiment/', true);

export default {
	name: 'LoanChannelCategoryPage',
	metaInfo() {
		this.getMetaInfo();
		let image = '';
		let title = null;
		if (this.$route.query.category_share_version
			&& ['women', 'education', 'agriculture'].includes(this.$route.params.category)) {
			image = imageRequire(`./${this.$route.params.category}_share_card.png`);
			title = `Can you help ${this.$route.query.lender} `;
			if (this.$route.params.category === 'women') {
				title += 'support women around the world?';
			} else if (this.$route.params.category === 'education') {
				title += 'expand access to education around the world?';
			} else if (this.$route.params.category === 'agriculture') {
				title += 'support smallholder farmers around the world?';
			}
		}

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
					content: title ?? `${this.meta.title} | Invest & Support`
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
					content: title ?? `${this.meta.title} | Invest & Support`
				},
				{
					name: 'twitter:description',
					vmid: 'twitter:description',
					content: this.meta.description
				}
			]).concat(image ? [
				{
					property: 'og:image',
					vmid: 'og:image',
					content: image
				},
				{
					name: 'twitter:image',
					vmid: 'twitter:image',
					content: image
				}
			] : [])
		};
	},
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
			enableQuickFilters: false,
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
					client.query({ query: experimentAssignmentQuery, variables: { id: 'quick_filters' } }),
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
		// Initialize Quick Filters Experiment
		if (this.targetedLoanChannel !== 'eco-friendly'
				&& this.targetedLoanChannel !== 'mission-driven-orgs'
				&& this.targetedLoanChannel !== 'short-term-loans'
		) {
			this.initializeQuickFilters();
		}
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
		initializeQuickFilters() {
			const quickFiltersExperiment = this.apollo.readFragment({
				id: 'Experiment:quick_filters',
				fragment: experimentVersionFragment,
			}) || {};
			this.enableQuickFilters = quickFiltersExperiment.version === 'b';
			if (quickFiltersExperiment.version) {
				this.$kvTrackEvent(
					'Lending',
					'EXP-CORE-729-Sept-2022',
					quickFiltersExperiment.version
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
		getMetaInfo() {
			switch (this.targetedLoanChannel) {
				case '1-billion-in-change':
					this.meta.title = '1 Billion In Change';
					break;
				case 'africa-loans':
					this.meta.title = 'Africa Loans';
					break;
				case 'agriculture':
					this.meta.title = 'Agriculture';
					this.meta.description = 'By supporting a loan in agriculture, you\'re helping a'
							+ 'farmer invest in their livelihood. Make a difference and lend today.';
					break;
				case 'agriculture-loans-for-women':
					this.meta.title = 'Agriculture Loans For Women';
					break;
				case 'arts':
					this.meta.title = 'Artisans';
					this.meta.description = 'Keep local traditions alive by lending to an artist on Kiva. '
						+ 'With your support, artisans across the globe can grow their businesses.'
						+ 'Browse loans to artists. ';
					break;
				case 'arts-loans':
					this.meta.title = 'Arts Loans';
					break;
				case 'asia-loans':
					this.meta.title = 'Asia Loans';
					break;
				case 'blackrock':
					this.meta.title = 'Blackrock';
					break;
				case 'choose-a-borrower':
					this.meta.title = 'Choose A Borrower';
					break;
				case 'choose-a-woman-borrower':
					this.meta.title = 'Choose A Woman Borrower';
					break;
				case 'choose-for-me':
					this.meta.title = 'Choose For Me';
					break;
				case 'conflict-zones':
					this.meta.title = 'Conflict Zones';
					this.meta.description = 'Help fund small business owners in regions affected by violence'
					+ 'or instability. With just $25, you can support entrepreneurs in areas'
					+ 'where credit is hard to access. ';
					break;
				case 'covid-19':
					this.meta.title = 'Covid 19';
					this.meta.description = 'Support entrepreneurs around the globe who are impacted by COVID-19.'
						+ 'Your loan goes a long way in assisting borrowers on the road to recovery.';
					break;
				case 'eco-friendly':
					this.meta.title = 'Eco Friendly';
					this.meta.description = 'Help provide access to economic growth while protecting the environment.'
					+ 'Make the world a more sustainable place by supporting an eco-friendly loan today.';
					break;
				case 'eco-friendly-loans':
					this.meta.title = 'Eco Friendly Loans';
					break;
				case 'ecofriendly-loans':
					this.meta.title = 'Ecofriendly Loans';
					this.meta.description = 'Help provide access to economic growth while protecting the environment.'
					+ 'Make the world a more sustainable place by supporting an eco-friendly loan today.';
					break;
				case 'education':
					this.meta.title = 'Education';
					this.meta.description = 'Help students reach their potential by lending to educational loans'
					+ 'on Kiva. Your loan provides a student with the means to improve their economic opportunity.';
					break;
				case 'ending-soon':
					this.meta.title = 'Ending Soon';
					this.meta.description = 'Be a last-minute hero and support loans that are ending soon. Get these'
					+ 'borrowers to the finish line and make a loan today. Check out who\'s fundraising now.';
					break;
				case 'flash-match':
					this.meta.title = 'Flash Match';
					break;
				case 'food':
					this.meta.title = 'Food';
					this.meta.description = 'Provide loan support to borrowers who are feeding their communities at '
					+ 'stores, markets, and restaurants. You can make a big difference in a borrower\'s life.';
					break;
				case 'food-loans':
					this.meta.title = 'Food Loans';
					break;
				case 'group-loans':
					this.meta.title = 'Group Loans';
					break;
				case 'groups':
					this.meta.title = 'Groups';
					this.meta.description = 'With group loans, borrowers learn from each other and grow together. '
					+ 'Help their communities develop economic opportunity by making a loan to a group.';
					break;
				case 'health':
					this.meta.title = 'Health';
					this.meta.description = 'Healthcare is a human right. Help people around the world access'
					+ ' the healthcare services they need by making a loan through Kiva. ';
					break;
				case 'hitachi-employees-helping-c-o-v-i-d-impacted-businesses':
					this.meta.title = 'Hitachi Employees Helping C O V I D Impacted Businesses';
					break;
				case 'hitachi-employees-helping-to-ignite-a-dream':
					this.meta.title = 'Hitachi Employees Helping To Ignite A Dream';
					break;
				case 'hitachis-c-o-v-i-d-19-response':
					this.meta.title = 'Hitachis C O V I D 19 Response';
					break;
				case 'human-flow-fund-support-refugees-and-i-d-ps':
					this.meta.title = 'Human Flow Fund Support Refugees And I D Ps';
					break;
				case 'i-t-cosmetics-confidence':
					this.meta.title = 'I T Cosmetics Confidence';
					break;
				case 'international-womens-day':
					this.meta.title = 'International Womens Day';
					break;
				case 'kiva-u-s':
					this.meta.title = 'Kiva U S';
					this.meta.description = '0% interest loans for small businesses in the U.S. and Puerto Rico.'
					+ ' Help entrepreneurs grow their businesses and create more jobs.';
					break;
				case 'latin-america-loans':
					this.meta.title = 'Latin America Loans';
					break;
				case 'lenders-like-you-supported-these-loans':
					this.meta.title = 'Lenders Like You Supported These Loans';
					break;
				case 'livestock':
					this.meta.title = 'Livestock';
					this.meta.description = 'Livestock like cows, pigs, and chickens provide huge economic '
					+ 'opportunity for farmers. Invest in farmers\' futures by making a livestock loan.';
					break;
				case 'loans-for-clean-energy':
					this.meta.title = 'Loans For Clean Energy';
					break;
				case 'loans-for-food-producers':
					this.meta.title = 'Loans For Food Producers';
					break;
				case 'loans-for-healthcare':
					this.meta.title = 'Loans For Healthcare';
					break;
				case 'loans-for-livestock':
					this.meta.title = 'Loans For Livestock';
					break;
				case 'loans-for-retail-businesses':
					this.meta.title = 'Loans For Retail Businesses';
					break;
				case 'loans-for-shelter':
					this.meta.title = 'Loans For Shelter';
					break;
				case 'loans-that-are-almost-funded':
					this.meta.title = 'Loans That Are Almost Funded';
					this.meta.description = 'These loans are approaching the finish line, with less than $100 left. '
					+ 'Be the difference and help a borrower reach their goal. Check out who\'s fundraising now.';
					break;
				case 'loans-that-are-ending-soon':
					this.meta.title = 'Loans That Are Ending Soon';
					break;
				case 'loans-to-artisans':
					this.meta.title = 'Loans To Artisans';
					break;
				case 'loans-to-farmers':
					this.meta.title = 'Loans To Farmers';
					break;
				case 'loans-to-single-parents':
					this.meta.title = 'Loans To Single Parents';
					this.meta.description = 'Help single parents navigate the challenges they face raising families '
					+ 'without partners. Support single parents by making a loan today.';
					break;
				case 'loans-to-u-s-small-businesses':
					this.meta.title = 'Loans To U S Small Businesses';
					break;
				case 'loans-to-women':
					this.meta.title = 'Loans To Women';
					break;
				case 'loans-with-research-backed-impact':
					this.meta.title = 'Loans With Research Backed Impact';
					break;
				case 'men':
					this.meta.title = 'Men';
					this.meta.description = 'Hardworking men around the world are dedicated to improving the quality '
					+ 'of life for themselves and their families. Invest in their futures by lending today.';
					break;
				case 'mission-driven-orgs':
					this.meta.title = 'Mission Driven Orgs';
					this.meta.description = 'Kiva\'s partners are committed to creating lasting social impact. Your '
					+ 'support provides the capital necessary to help driven entrepreneurs around the world.';
					break;
				case 'recommended-by-lend-by-categoryers':
					this.meta.title = 'Recommended By Lend By Categoryers';
					break;
				case 'recommended-by-lenders':
					this.meta.title = 'Recommended By Lenders';
					break;
				case 'refugees-and-i-d-ps':
					this.meta.title = 'Refugees and IDPs';
					this.meta.description = 'Millions of people around the world have been forced to flee their homes '
					+ 'due to disasters or instability. Support refugees and IDPs today.';
					break;
				case 'retail-businesses':
					this.meta.title = 'Retail Businesses';
					this.meta.description = 'Retail businesses provide essential products to communities. Show your '
					+ 'support by lending to these entrepreneurs. Check out who\'s fundraising now on Kiva.';
					break;
				case 'retail-loans':
					this.meta.title = 'Retail Loans';
					break;
				case 'shelter':
					this.meta.title = 'Shelter';
					this.meta.description = 'Shelter is the most basic of human needs. Help people around the world in '
					+ 'build much needed shelter for themselves and their families by making a loan today.';
					break;
				case 'shelter-loans-for-women':
					this.meta.title = 'Shelter Loans For Women';
					break;
				case 'short-term-loans':
					this.meta.title = 'Short Term Microloans';
					this.meta.description = 'These loans have repayment times of 16 months or less. If faster repayment'
					+ ' is important for you, consider making a loan to these borrowers today. ';
					break;
				case 'single-parents':
					this.meta.title = 'Single Parents';
					break;
				case 'super-power-a-woman-on-kiva':
					this.meta.title = 'Super Power A Woman On Kiva';
					break;
				case 'technology':
					this.meta.title = 'Technology';
					break;
				case 'transport':
					this.meta.title = 'Transport';
					break;
				case 'trending-now':
					this.meta.title = 'Trending now';
					break;
				case 'underbanked-areas':
					this.meta.title = 'Underbanked Areas';
					this.meta.description = 'In these areas, it\'s difficult for people to access credit. Assist '
					+ 'borrowers by funding loans in underbanked areas today. Check out who\'s fundraising on Kiva.';
					break;
				case 'vulnerable-populations':
					this.meta.title = 'Vulnerable Populations';
					this.meta.description = 'Vulnerable populations around the world work hard to build and rebuild'
					+ ' their lives, and your support makes all the difference. Make a loan today.';
					break;
				case 'water-and-sanitation':
					this.meta.title = 'Water And Sanitation';
					this.meta.description = 'One in three people in the world does not have clean drinking water. '
					+ 'Help provide this necessity to borrowers through Kiva by lending today.';
					break;
				case 'women':
					this.meta.title = 'Women-Led Initiatives';
					this.meta.description = 'Worldwide, women face economic and societal barriers to building capital. '
					+ 'Make an impact in women\'s lives today by funding a loan on Kiva.';
					break;
				case 'world-refugee-day':
					this.meta.title = 'World Refugee Day';
					break;
				default:
					this.meta.title = 'See loans by category';
					this.meta.description = 'Choose a category, lend to borrowers, and make an impact. Each Kiva loan'
					+ ' helps people build a better future for themselves and their families.';
					break;
			}
		}
	},
};
</script>
