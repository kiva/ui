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

const activePageQuery = gql`query homepageFrame {
	general {
		legacyHomeExp: uiExperimentSetting(key: "home_legacy") {
			key
			value
		}
	}
}`;

// Return an import function for the active homepage component
const selectActiveHomepage = (legacyHomeExp = {}) => {
	// Being in the 'a' variant of the legacy home experiment forces using the legacy homepage
	if (legacyHomeExp.version === 'a') {
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
		query: activePageQuery,
		preFetch(config, client, args) {
			return client.query({
				query: activePageQuery
			}).then(() => client.query({
				query: experimentQuery,
				variables: { id: 'home_legacy' },
			})).then(expResult => {
				// Select which homepage to load
				const componentImporter = selectActiveHomepage(expResult?.data?.experiment);
				return componentImporter();
			}).then(resolvedImport => {
				// Call preFetch for the active homepage
				const component = resolvedImport.default;
				return preFetchAll([component], client, args);
			});
		},
		result() {
			// Fetch legacy homepage experiment data (GROW-442)
			const legacyHomeExp = this.apollo.readFragment({
				id: 'Experiment:home_legacy',
				fragment: experimentVersionFragment,
			}) || {};
			// Fire Event for EXP-GROW-442
			if (legacyHomeExp.version && legacyHomeExp.version !== 'unassigned') {
				this.$kvTrackEvent(
					'homepage',
					'EXP-GROW-442',
					legacyHomeExp.version,
				);
			}

			// Set active homepage
			this.activeHomepage = selectActiveHomepage(legacyHomeExp);
		}
	}
};
</script>
