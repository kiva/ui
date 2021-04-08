<template>
	<component :is="pageFrame">
		<template v-if="!pageError">
			<component
				v-for="({ component, content }) in contentGroups"
				:key="content.key"
				:is="component"
				:content="content"
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
import gql from 'graphql-tag';
import { preFetchAll } from '@/util/apolloPreFetch';
import { processPageContent } from '@/util/contentfulUtils';

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
const HomepageHero = () => import('@/components/Homepage/HomepageHero');
const HomepageHowItWorks = () => import('@/components/Homepage/HomepageHowItWorks');
const HomepageLoanCategories = () => import('@/components/Homepage/HomepageLoanCategories');
const HomepageMidrollCTA = () => import('@/components/Homepage/HomepageMidrollCTA');
const HomepageStatistics = () => import('@/components/Homepage/HomepageStatistics');
const HomepageTestimonials = () => import('@/components/Homepage/HomepageTestimonials');

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
		case 'homepageHero':
			return HomepageHero;
		case 'homepageHowItWorks':
			return HomepageHowItWorks;
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
		case 'mlCampaignHero':
			return CampaignHero;
		case 'mlCampaignLogo':
			return CampaignLogoGroup;
		case 'mlCampaignPartnerCopy':
			return CampaignPartner;
		case 'mlCampaignThanks':
			return CampaignThanks;
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

export default {
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			contentGroups: [],
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
				key: route?.meta?.contentfulPage,
			};
		},
		variables() {
			return {
				key: this.$route?.meta?.contentfulPage,
			};
		},
		preFetch(config, client, args) {
			return client.query({
				query: pageQuery,
				variables: {
					key: args?.route?.meta?.contentfulPage,
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
				this.pageFrame = getPageFrameFromType(pageData?.page?.pageType);
				this.contentGroups = getContentGroups(pageData);
			}
		}
	}
};
</script>
