<template>
	<component :is="activeHomepage" />
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import gql from 'graphql-tag';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import { preFetchAll } from '@/util/apolloPreFetch';

const ContentfulPage = () => import('@/pages/ContentfulPage');

const homePageQuery = gql`query homepageFrame {
	hasEverLoggedIn @client
	general {
		newHomeLayoutExp: uiExperimentSetting(key: "new_home_layout") {
			key
			value
		}
	}
}`;

export default {
	name: 'Homepage',
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		/* eslint-disable global-require */
		return {
			title: 'Make a loan, change a life',
			meta: [
				{
					name: 'google-site-verification', // for Google Search Console
					content: 'vpxnq5XBGa1PgE4hhyEollJr4uEzN7mrC30iJxzuW_M'
				},
				{
					vmid: 'description',
					name: 'description',
					content: 'Kiva is the world\'s first online lending platform. '
						+ 'For as little as $25 you can lend to an entrepreneur around the world. Learn more here.'
				},
			],
			script: [
				// Organization schema. This is defined in here in the Homepage instead of App.vue or
				// somewhere else because the schema should be defined on only one page.
				{
					type: 'application/ld+json',
					json: {
						'@context': 'https://schema.org',
						'@type': 'NGO',
						name: 'Kiva',
						alternateName: 'Kiva Loans',
						legalName: 'Kiva Microfunds',
						url: 'https://www.kiva.org/',
						logo: require('@/assets/images/kiva_logo_filled.png'),
						address: {
							'@type': 'PostalAddress',
							streetAddress: '986 Mission Street, 4th Floor',
							addressLocality: 'San Francisco',
							addressRegion: 'CA',
							postalCode: '94103',
							addressCountry: 'USA',
						},
						nonprofitStatus: 'Nonprofit501c3',
						foundingDate: '2005-10-01',
						telephone: '828-479-5482',
						sameAs: [
							'https://www.facebook.com/kiva',
							'https://twitter.com/Kiva',
							'https://www.instagram.com/kiva.org/',
							'https://www.youtube.com/channel/UCr304RURWaQUnDha9hDvW3g',
							'https://www.linkedin.com/company/kiva-org/',
							'https://en.wikipedia.org/wiki/Kiva_(organization)',
							'https://www.pinterest.com/kivaorg/',
							'https://www.kiva.global/',
							'https://apps.apple.com/app/id1453093374',
							'https://play.google.com/store/apps/details?id=org.kiva.lending'
						]
					},
				},
			],
		};
	},
	data() {
		return {
			activeHomepage: ContentfulPage,
			hasEverLoggedIn: false
		};
	},
	apollo: {
		query: homePageQuery,
		preFetch(config, client, args) {
			return client.query({
				query: homePageQuery
			}).then(() => {
				return Promise.all([client.query({
					query: experimentAssignmentQuery,
					variables: { id: 'new_home_layout' }
				})]);
			}).then(async result => {
				// Call preFetch for the active homepage
				let homePageComponent;
				const experiment = result[0].data?.experiment;

				switch (experiment?.version) {
					case 'a':
						// Should fetch the regular home page
						homePageComponent = await ContentfulPage();
						break;
					case 'b':
						// Should prefetch the experimental home page
						homePageComponent = await ContentfulPage();
						break;
					default:
						// Should redirect to /cps/home
						homePageComponent = await ContentfulPage();
						break;
				}

				const component = homePageComponent.default;
				return preFetchAll([component], client, args);
			});
		},
	},
};
</script>
