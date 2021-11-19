<template>
	<component :is="activeHomepage" />
</template>

<script>
import gql from 'graphql-tag';
import { preFetchAll } from '@/util/apolloPreFetch';

const ContentfulPage = () => import('@/pages/ContentfulPage');

const homePageLoginStatus = gql`query homepageFrame {
	hasEverLoggedIn @client
}`;

export default {
	inject: ['apollo', 'cookieStore'],
	metaInfo: {
		meta: [
			{
				name: 'google-site-verification', // for Google Search Console
				content: 'vpxnq5XBGa1PgE4hhyEollJr4uEzN7mrC30iJxzuW_M'
			},
		],
	},
	data() {
		return {
			activeHomepage: ContentfulPage,
		};
	},
	apollo: {
		query: homePageLoginStatus,
		preFetch(config, client, args) {
			return client.query({
				query: homePageLoginStatus
			}).then(() => {
				return ContentfulPage();
			}).then(resolvedImport => {
				// Call preFetch for the active homepage
				const component = resolvedImport.default;
				return preFetchAll([component], client, args);
			});
		},
		result({ data }) {
			// Setup unbounce event trigger which is restricted to non-logged-in and unknown users
			const hasEverLoggedIn = data?.hasEverLoggedIn ?? true;
			// Check for hasEverLoggedIn
			if (!hasEverLoggedIn) {
				// push data object if eligible + assigned
				if (typeof window !== 'undefined') {
					window.dataLayer.push({ event: 'activateUnbounceEvent' });
				}
			}
		}
	}
};
</script>
