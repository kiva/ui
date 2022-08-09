<template>
	<component :is="activeHomepage" />
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import gql from 'graphql-tag';
import { preFetchAll } from '@/util/apolloPreFetch';

const ContentfulPage = () => import('@/pages/ContentfulPage');

const homePageQuery = gql`query homepageFrame {
	hasEverLoggedIn @client
}`;

export default {
	name: 'Homepage',
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
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
				}
			]
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
				return ContentfulPage();
			}).then(resolvedImport => {
				// Call preFetch for the active homepage
				const component = resolvedImport.default;
				return preFetchAll([component], client, args);
			});
		},
	},
};
</script>
