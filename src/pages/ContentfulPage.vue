<template>
	<component :is="pageFrame"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
		:main-class="pageBackgroundColor"
	>
		<component
			v-for="({ component, content }) in contentGroups"
			:key="content.key"
			:id="content.key"
			:is="component"
			:content="content"
			v-bind="getComponentOptions(content.key)"
			data-section-type="contentful-section"
		/>
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

import { preFetchAll } from '@/util/apolloPreFetch';
import { processPageContent } from '@/util/contentfulUtils';
import logFormatter from '@/util/logFormatter';
import * as siteThemes from '@/util/siteThemes';
import contentfulEntries from '@/graphql/query/contentfulEntries.graphql';

// Page frames
const WwwPage = () => import('@/components/WwwFrame/WwwPage');
const WwwPageCorporate = () => import('@/components/WwwFrame/WwwPageCorporate');
const WwwPageDesign = () => import('@/components/WwwFrame/WwwPageDesign');

// Error page
const ErrorPage = () => import('@/pages/Error');

// Content Group Types
// TODO: update the campaign components to accept "content" prop
const CampaignHero = () => import('@/components/CorporateCampaign/CampaignHero');
const CampaignLogoGroup = () => import('@/components/CorporateCampaign/CampaignLogoGroup');
const CampaignPartner = () => import('@/components/CorporateCampaign/CampaignPartner');
const CampaignThanks = () => import('@/components/CorporateCampaign/CampaignThanks');

const HomepageBottomCTA = () => import('@/components/Homepage/HomepageBottomCTA');
const HomepageCorporateSponsors = () => import('@/components/Homepage/HomepageCorporateSponsors');
// const HomepageGeneralStats = () => import('@/components/Homepage/HomepageGeneralStats');
const HomepageHowItWorks = () => import('@/components/Homepage/HomepageHowItWorks');
const HomepageLenderQuotes = () => import('@/components/Homepage/HomepageLenderQuotes');
const HomepageLoanCategories = () => import('@/components/Homepage/HomepageLoanCategories');
const HomepageMidrollCTA = () => import('@/components/Homepage/HomepageMidrollCTA');
const HomepageStatistics = () => import('@/components/Homepage/HomepageStatistics');
const HomepageTestimonials = () => import('@/components/Homepage/HomepageTestimonials');
const HomepageVerticalCTA = () => import('@/components/Homepage/HomepageVerticalCTA');
const HomepageMonthlyGoodInfo = () => import('@/components/Homepage/HomepageMonthlyGoodInfo');

const CardRow = () => import('@/components/Contentful/CardRow');
const CenteredRichText = () => import('@/components/Contentful/CenteredRichText');
const DynamicHeroClassic = () => import('@/components/Contentful/DynamicHeroClassic');
const HeroWithCarousel = () => import('@/components/Contentful/HeroWithCarousel');
const LoansByCategoryCarousel = () => import('@/components/Contentful/LoansByCategoryCarousel');

const MonthlyGoodSelectorWrapper = () => import('@/components/MonthlyGood/MonthlyGoodSelectorWrapper');

const FrequentlyAskedQuestions = () => import('@/components/Contentful/FrequentlyAskedQuestions');

const TestimonialCards = () => import('@/components/Contentful/TestimonialCards');

const RichTextItemsCentered = () => import('@/components/Contentful/RichTextItemsCentered');

const MediaItemsCentered = () => import('@/components/Contentful/MediaItemsCentered');

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
		case 'design':
			return WwwPageDesign;
		default:
			logFormatter(`ContentfulPage: Unknown page type "${type}"`, 'error');
			return WwwPage;
	}
};

// Return a component importer function based on content group type from Contentful
const getComponentFromType = type => {
	switch (type) {
		case 'homepageBottomCTA':
			return HomepageBottomCTA;
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
		case 'monthlyGoodSelector':
			return MonthlyGoodSelectorWrapper;
		case 'frequentlyAskedQuestions':
			return FrequentlyAskedQuestions;
		case 'testimonialCards':
			return TestimonialCards;
		case 'cardRow':
			return CardRow;
		case 'centeredRichText':
			return CenteredRichText;
		case 'dynamicHeroClassic':
			return DynamicHeroClassic;
		case 'heroWithCarousel':
			return HeroWithCarousel;
		case 'loansByCategoryCarousel':
			return LoansByCategoryCarousel;
		case 'richTextItemsCentered':
			return RichTextItemsCentered;
		case 'mediaItemsCentered':
			return MediaItemsCentered;
		default:
			logFormatter(`ContenfulPage: Unknown content group type "${type}"`, 'error');
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

// Modifications for Monthly Good Landing pages
const customMGEventsAndConfig = {
	// Custom attribute for MG page landing specific button class
	// TODO deprecate this when HomepageBottomCTA.vue is no longer in use
	customCtaButtonClass: 'classic hollow',
	// Custom attribute for event name emitted with MG landing page button clicks
	customEventName: 'openMonthlyGoodSelector'
};

// TODO deprecate this when HomepageBottomCTA.vue is no longer in use
const componentOptions = {
	// Selected MG Landing page component keys to receive custom attributes
	'homepage-bottom-cta-monthly-good': customMGEventsAndConfig,
	'homepage-bottom-cta-mg-refugees': customMGEventsAndConfig,
};

export default {
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			pageBackgroundColor: '',
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
		query: contentfulEntries,
		preFetchVariables({ route }) {
			return {
				contentType: 'page',
				contentKey: route?.meta?.contentfulPage(route)?.trim(),
			};
		},
		variables() {
			return {
				contentType: 'page',
				contentKey: this.$route?.meta?.contentfulPage(this.$route)?.trim(),
			};
		},
		preFetch(config, client, args) {
			return client.query({
				query: contentfulEntries,
				variables: {
					contentType: 'page',
					contentKey: args?.route?.meta?.contentfulPage(args?.route)?.trim(),
				}
			}).then(({ data }) => {
				// Get Contentful page data
				const pageData = getPageData(data);
				if (pageData.error) {
					// Only import the error page if there is a contentful error
					return Promise.all([ErrorPage()]);
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
				this.pageFrame = ErrorPage;
			} else {
				this.title = (pageData?.page?.pageLayout?.pageTitle || pageData?.page?.pageTitle) ?? undefined;
				this.pageBackgroundColor = pageData?.page?.pageLayout?.pageBackgroundColor ?? '';
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
