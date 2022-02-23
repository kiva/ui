<template>
	<component :is="activeHomepage" />
</template>

<script>
import gql from 'graphql-tag';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import { preFetchAll } from '@/util/apolloPreFetch';

const ContentfulPage = () => import('@/pages/ContentfulPage');

const homePageQuery = gql`query homepageFrame {
	hasEverLoggedIn @client
	general {
		causesHomeExp: uiExperimentSetting(key: "home_mobile_causes") {
			key
			value
		}
	}
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
			hasEverLoggedIn: false
		};
	},
	apollo: {
		query: homePageQuery,
		preFetch(config, client, args) {
			return client.query({
				query: homePageQuery
			}).then(pageQueryResult => {
				if (!pageQueryResult?.data?.hasEverLoggedIn) {
					return client.query({
						query: experimentAssignmentQuery,
						variables: { id: 'home_mobile_causes' },
					}).then(expResult => {
						// Redirect to path: '/lp/causes' if experiment is active
						if (expResult?.data?.experiment?.version === 'shown') {
							// cancel the promise, returning a route for redirect
							return Promise.reject({
								path: '/lp/causes'
							});
						}
						return ContentfulPage();
					});
				}
				return ContentfulPage();
			}).then(resolvedImport => {
				// Call preFetch for the active homepage
				const component = resolvedImport.default;
				return preFetchAll([component], client, args);
			});
		},
		result() {
			// Mobile Causes homepage experiment (GD-205)
			const causesHomeExp = this.apollo.readFragment({
				id: 'Experiment:home_mobile_causes',
				fragment: experimentVersionFragment,
			}) || {};
			// Fire Event for EXP-GD-205
			if (causesHomeExp.version && causesHomeExp.version !== 'unassigned') {
				this.$kvTrackEvent(
					'Causes',
					'EXP-GD-205-Jan2022',
					causesHomeExp.version === 'shown' ? 'b' : 'a',
				);
			}
		}
	},
};
</script>
