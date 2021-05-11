<template>
	<component :is="pageFrame"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<template v-if="!pageError">
			<component
				v-for="({ component, content }) in contentGroups"
				:key="content.key"
				:is="component"
				:content="content"
				v-bind="getComponentOptions(content.key)"
			/>
		</template>
		<template v-else>
			<div class="row">
				<div class="small-12 columns">
					<h1>
						We're sorry, something went wrong
					</h1>
					<p>
						There was an unknown problem with trying to load the content for this page.
					</p>
				</div>
			</div>
		</template>
	</component>
</template>

<script>
/*
This is a page component that dynamically pre-fetches and displays a page based on a Contentful Page Layout, using
the contentGroup types to decide which components to display.

This handles the page title, the page frame, and has some default content in case there is an error when getting
the Page Layout from Contentful.

The possible components are pre-determined, but in the future it could setup to use any component in a given directory.

To use, simply create a route that defines contentfulPage in the meta data, e.g.:
{
	path: '/',
	name: 'homepage',
	component: () => import('@/pages/ContentfulPage'),
	meta: {
		contentfulPage: () => 'home',
	},
},
*/

import gql from 'graphql-tag';
import { preFetchAll } from '@/util/apolloPreFetch';
import { processPageContent } from '@/util/contentfulUtils';
import * as siteThemes from '@/util/siteThemes';

// Page frames
const WwwPage = () => import('@/components/WwwFrame/WwwPage');
const WwwPageCorporate = () => import('@/components/WwwFrame/WwwPageCorporate');

// Content Group components
// TODO: update the campaign components to accept "content" prop
const CampaignHero = () => import('@/components/CorporateCampaign/CampaignHero');
const CampaignLogoGroup = () => import('@/components/CorporateCampaign/CampaignLogoGroup');
const CampaignPartner = () => import('@/components/CorporateCampaign/CampaignPartner');
const CampaignThanks = () => import('@/components/CorporateCampaign/CampaignThanks');

const HomepageBottomCTA = () => import('@/components/Homepage/HomepageBottomCTA');
const HomepageCorporateSponsors = () => import('@/components/Homepage/HomepageCorporateSponsors');
// const HomepageGeneralStats = () => import('@/components/Homepage/HomepageGeneralStats');
const DynamicHero = () => import('@/components/Contentful/DynamicHero');

const HomepageHowItWorks = () => import('@/components/Homepage/HomepageHowItWorks');
const HomepageLenderQuotes = () => import('@/components/Homepage/HomepageLenderQuotes');
const HomepageLoanCategories = () => import('@/components/Homepage/HomepageLoanCategories');
const HomepageMidrollCTA = () => import('@/components/Homepage/HomepageMidrollCTA');
const HomepageStatistics = () => import('@/components/Homepage/HomepageStatistics');
const HomepageTestimonials = () => import('@/components/Homepage/HomepageTestimonials');
const HomepageVerticalCTA = () => import('@/components/Homepage/HomepageVerticalCTA');
const HomepageMonthlyGoodInfo = () => import('@/components/Homepage/HomepageMonthlyGoodInfo');

const MonthlyGoodSelectorWrapper = () => import('@/components/MonthlyGood/MonthlyGoodSelectorWrapper');
const MonthlyGoodFrequentlyAskedQuestions = () => import('@/components/MonthlyGood/FrequentlyAskedQuestions');

// Query for getting contentful page data
const pageQuery = gql`query contentfulPage($key: String) {
	contentful {
		entries(contentType: "page", contentKey: $key)
	}
}`;

// Get the Contentful Page data from the data of an Apollo query result
const getPageData = data => {
	const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
	return pageEntry ? processPageContent(pageEntry) : { error: 'Contentful entry not found' };
};

// Return a component importer function based on page type from Contentful
const getPageFrameFromType = type => {
	switch (type) {
		case 'corporate-campaign':
			return WwwPageCorporate;
		case 'landing':
			return WwwPage;
		case 'lender-campaign':
			return WwwPage;
		default:
			console.error(`Unknown page type "${type}"`);
			return WwwPage;
	}
};

// Return a component importer function based on content group type from Contentful
const getComponentFromType = type => {
	switch (type) {
		case 'homepageBottomCTA':
			return HomepageBottomCTA;
		case 'dynamicHero':
			return DynamicHero;
		case 'homepageHowItWorks':
			return HomepageHowItWorks;
		case 'homepageLenderQuotes':
			return HomepageLenderQuotes;
		case 'homepageLoanCategories':
			return HomepageLoanCategories;
		case 'homepageMidrollCta':
			return HomepageMidrollCTA;
		case 'homepageStatistics':
			// return HomepageGeneralStats;
			return HomepageStatistics;
		case 'homepageStrategicPartners':
			return HomepageCorporateSponsors;
		case 'homepageTestimonials':
			return HomepageTestimonials;
		case 'homepageVerticalCTA':
			return HomepageVerticalCTA;
		case 'homepageMonthlyGoodInfo':
			return HomepageMonthlyGoodInfo;
		case 'mlCampaignHero':
			return CampaignHero;
		case 'mlCampaignLogo':
			return CampaignLogoGroup;
		case 'mlCampaignPartnerCopy':
			return CampaignPartner;
		case 'mlCampaignThanks':
			return CampaignThanks;
		case 'frequentlyAskedQuestions':
			// TODO change this to generic FAQ Component
			return MonthlyGoodFrequentlyAskedQuestions;
		case 'monthlyGoodSelector':
			return MonthlyGoodSelectorWrapper;

		default:
			console.error(`Unknown content group type "${type}"`);
			return null;
	}
};

// Return array of Content Group objects with component importer functions and content
const getContentGroups = pageData => {
	// Using contentGroups from page.pageLayout
	const groups = pageData?.page?.pageLayout?.contentGroups ?? [];

	return groups.map(group => ({
		component: getComponentFromType(group.type),
		content: group,
	})).filter(group => typeof group.component === 'function');
};

const componentOptions = {
	'homepage-hero-monthly-good': {
		/**
		 * Open monthly good interactive selector
		 * in MonthlyGoodSelector.vue
		 */
		customCtaFunction(event) {
			// prevents event from bubbling up to v-click-outside listener in MonthlyGoodSelector
			event.stopPropagation();
			this.$root.$emit('openMonthlyGoodSelector');
		},
		customCtaButtonClass: 'classic hollow'
	},
	'homepage-bottom-cta-monthly-good': {
		/**
		 * Open monthly good interactive selector
		 * in MonthlyGoodSelector.vue
		 */
		customCtaFunction(event) {
			// prevents event from bubbling up to v-click-outside listener in MonthlyGoodSelector
			event.stopPropagation();
			this.$root.$emit('openMonthlyGoodSelector');
		},
		customCtaButtonClass: 'classic hollow'
	},
};

export default {
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			contentGroups: [],
			footerTheme: {},
			headerTheme: {},
			pageError: false,
			pageFrame: WwwPage,
			title: undefined,
		};
	},
	metaInfo() {
		return {
			title: this.title,
		};
	},
	apollo: {
		query: pageQuery,
		preFetchVariables({ route }) {
			return {
				key: route?.meta?.contentfulPage(route),
			};
		},
		variables() {
			return {
				key: this.$route?.meta?.contentfulPage(this.$route),
			};
		},
		preFetch(config, client, args) {
			return client.query({
				query: pageQuery,
				variables: {
					key: args?.route?.meta?.contentfulPage(args?.route),
				},
			}).then(({ data }) => {
				// Get Contentful page data
				const pageData = getPageData(data);
				if (pageData.error) {
					// Only import the default page frame if there is a contentful error
					return Promise.all([WwwPage()]);
				}
				// Get page frame component
				const pageFrame = getPageFrameFromType(pageData?.page?.pageType);
				// Get components for content groups
				const contentGroups = getContentGroups(pageData);
				// Start importing all components
				return Promise.all([
					pageFrame(),
					...contentGroups.map(g => g.component()),
				]);
			}).then(resolvedImports => {
				// Call preFetch for page frame and content group components
				const components = resolvedImports.map(resolvedImport => resolvedImport.default);
				return preFetchAll(components, client, args);
			});
		},
		result({ data }) {
			const pageData = getPageData(data);
			if (pageData.error) {
				this.pageError = true;
			} else {
				this.title = (pageData?.page?.pageLayout?.pageTitle || pageData?.page?.pageTitle) ?? undefined;
				this.headerTheme = siteThemes[pageData?.page?.pageLayout?.headerTheme] || {};
				this.footerTheme = siteThemes[pageData?.page?.pageLayout?.footerTheme] || {};
				this.pageFrame = getPageFrameFromType(pageData?.page?.pageType);
				this.contentGroups = getContentGroups(pageData);
			}
		}
	},
	methods: {
		getComponentOptions(key) {
			return componentOptions[key] || {};
		}
	},
};
</script>
