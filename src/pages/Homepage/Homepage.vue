<template>
	<component :is="activeHomepage" />
</template>

<script>
import gql from 'graphql-tag';

import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import { preFetchAll } from '@/util/apolloPreFetch';

const DefaultHomePage = () => import('@/pages/Homepage/DefaultHomepage');
const ContentfulPage = () => import('@/pages/ContentfulPage');

const homePageExperimentQuery = gql`query homepageFrame {
	hasEverLoggedIn @client
	general {
		classicHomeExp: uiExperimentSetting(key: "home_classic") {
			key
			value
		}
	}
}`;

// Return an import function for the active homepage component
const selectActiveHomepage = (legacyHomeExp = {}) => {
	// Being in the 'x' variant of the classic home experiment forces using the legacy homepage
	if (legacyHomeExp.version === 'x') {
		return DefaultHomePage;
	}
	return ContentfulPage;
};

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
			activeHomepage: null,
		};
	},
	apollo: {
		query: homePageExperimentQuery,
		preFetch(config, client, args) {
			return client.query({
				query: homePageExperimentQuery
			}).then(() => client.query({
				query: experimentQuery,
				variables: { id: 'home_classic' },
			})).then(expResult => {
				// Redirect to /homepage-classic if experiment is active or route matches
				if (expResult?.data?.experiment?.version === 'b' && args?.route?.path !== '/homepage-classic') {
					// cancel the promise, returning a route for redirect
					return Promise.reject({
						path: '/homepage-classic'
					});
				}
				// Select which homepage to load
				const componentImporter = selectActiveHomepage(expResult?.data?.experiment);
				return componentImporter();
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

			// Fetch legacy homepage experiment data (GROW-442)
			const classicHomeExp = this.apollo.readFragment({
				id: 'Experiment:home_classic',
				fragment: experimentVersionFragment,
			}) || {};
			// Fire Event for EXP-GROW-442
			if (classicHomeExp.version && classicHomeExp.version !== 'unassigned') {
				this.$kvTrackEvent(
					'homepage',
					'EXP-CORE-76',
					classicHomeExp.version,
				);
			}

			// Set active homepage
			this.activeHomepage = selectActiveHomepage(classicHomeExp);
		}
	}
};
</script>
