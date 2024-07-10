<template>
	<component
		:is="pageFrame"
		:main-class="pageBackgroundColor"
	>
		<component
			v-for="({ component, content }) in contentGroups"
			:key="content.key"
			:id="content.key"
			:is="component"
			:content="content"
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
import contentfulEntries from '@/graphql/query/contentfulEntries.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

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

const CardRow = () => import('@/components/Contentful/CardRow');
const CenteredRichText = () => import('@/components/Contentful/CenteredRichText');
const DynamicHeroClassic = () => import('@/components/Contentful/DynamicHeroClassic');
const HeroWithCarousel = () => import('@/components/Contentful/HeroWithCarousel');
const LoansByCategoryCarousel = () => import('@/components/Contentful/LoansByCategoryCarousel');
const LoansByCategoryGrid = () => import('@/components/Contentful/HomePage/NewHomeLoansByCategoryGrid');
const NewHomeLoansCardsCarousel = () => import('@/components/Contentful/HomePage/NewHomeLoansCardCarousel');
const MonthlyGoodSelectorWrapper = () => import('@/components/MonthlyGood/MonthlyGoodSelectorWrapper');
const FrequentlyAskedQuestions = () => import('@/components/Contentful/FrequentlyAskedQuestions');
const TestimonialCards = () => import('@/components/Contentful/TestimonialCards');
const RichTextItemsCentered = () => import('@/components/Contentful/RichTextItemsCentered');
const MediaItemsCentered = () => import('@/components/Contentful/MediaItemsCentered');
const StoryCardCarousel = () => import('@/components/Contentful/StoryCardCarousel');

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
		case 'loansByCategoryGrid':
			return LoansByCategoryGrid;
		case 'newHomeLoansCardCarousel':
			return NewHomeLoansCardsCarousel;
		case 'richTextItemsCentered':
			return RichTextItemsCentered;
		case 'mediaItemsCentered':
			return MediaItemsCentered;
		case 'storyCardCarousel':
			return StoryCardCarousel;
		default:
			logFormatter(`ContentfulPage: Unknown content group type "${type}"`, 'error');
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

export default {
	name: 'ContentfulPage',
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			pageBackgroundColor: '',
			contentGroups: [],
			pageError: false,
			pageFrame: WwwPage,
			title: undefined,
			description: undefined,
			canonicalUrl: undefined,
		};
	},
	metaInfo() {
		return {
			title: this.title ? this.title?.replace('| Kiva', '') : 'Make a loan, change a life',
			meta: [].concat(this.title ? [
				{
					property: 'og:title',
					vmid: 'og:title',
					content: this.title?.replace('| Kiva', ''),
				},
				{
					name: 'twitter:title',
					vmid: 'twitter:title',
					content: this.title?.replace('| Kiva', ''),
				},
			] : []).concat(this.description ? [
				{
					vmid: 'description',
					name: 'description',
					content: this.description,
				},
				{
					property: 'og:description',
					vmid: 'og:description',
					content: this.description
				},
				{
					name: 'twitter:description',
					vmid: 'twitter:description',
					content: this.description
				},
			] : []),
			link: [].concat(this.canonicalUrl ? [
				{
					vmid: 'canonical',
					rel: 'canonical',
					href: this.canonicalUrl,
				}
			] : [])
		};
	},
	apollo: {
		query: contentfulEntries,
		preFetchVariables({ route, client }) {
			return {
				contentType: 'page',
				contentKey: route?.meta?.contentfulPage(route, client, experimentVersionFragment)?.trim(),
			};
		},
		variables() {
			return {
				contentType: 'page',
				contentKey: this.$route?.meta?.contentfulPage(
					this.$route, this.apollo, experimentVersionFragment
				)?.trim(),
			};
		},
		async preFetch(config, client, args) {
			const { data } = await client.query({
				query: contentfulEntries,
				variables: {
					contentType: 'page',
					contentKey: args?.route?.meta?.contentfulPage(
						args?.route, client, experimentVersionFragment
					)?.trim(),
				}
			});
			// Get Contentful page data
			const pageData = getPageData(data);
			if (pageData.error) {
				// Only prefetch the error page if there is a contentful error
				return preFetchAll([ErrorPage], client, args);
			}
			// Get page frame component
			const pageFrame = getPageFrameFromType(pageData?.page?.pageType);
			// Get components for content groups
			const contentGroups = getContentGroups(pageData);
			// Call preFetch for page frame and content group components
			return Promise.all([
				preFetchAll([pageFrame], client, args),
				...contentGroups.map(group => preFetchAll(
					[group.component],
					client,
					{
						...args,
						content: group.content,
					}
				))
			]);
		},
		result({ data }) {
			const pageData = getPageData(data);
			if (pageData.error) {
				this.pageError = true;
				this.pageFrame = ErrorPage;
			} else {
				const page = pageData?.page ?? {};
				const pageLayout = page.pageLayout ?? {};
				this.title = (pageLayout.pageTitle || page.pageTitle) ?? undefined;
				this.description = (pageLayout.pageDescription || page.pageDescription) ?? undefined;
				this.canonicalUrl = page.canonicalUrl ?? undefined;
				this.pageBackgroundColor = pageLayout.pageBackgroundColor ?? '';
				this.pageFrame = getPageFrameFromType(page.pageType);
				this.contentGroups = getContentGroups(pageData);
			}
		}
	},
};
</script>
