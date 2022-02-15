<template>
	<component :is="activeHomepage" />
</template>

<script>
import gql from 'graphql-tag';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import { preFetchAll } from '@/util/apolloPreFetch';
import { parseExpCookie } from '@/util/experimentUtils';

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
			const assignments = parseExpCookie(args.cookieStore.get('uiab'));
			if (assignments?.home_mobile_causes?.version === 'shown') {
				// cancel the promise, returning a route for redirect
				return Promise.reject({
					path: '/lp/causes'
				});
			}
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
		result({ data }) {
			// Setup unbounce event trigger which is restricted to non-logged-in and unknown users
			this.hasEverLoggedIn = data?.hasEverLoggedIn ?? true;
			// Check for hasEverLoggedIn
			if (!this.hasEverLoggedIn) {
				// push data object if eligible + assigned
				if (typeof window !== 'undefined') {
					window.dataLayer.push({ event: 'activateUnbounceEvent' });
				}
			}
		}
	},
	created() {
		// Mobile Causes homepage experiment (GD-205)
		// Only mobile new users are eligible to be in experiment
		if (this.isMobile && this.isNewUser) {
			// Assign Experiment
			this.apollo.query({
				query: experimentAssignmentQuery,
				variables: { id: 'home_mobile_causes' }
			}).then(({ data }) => {
				// track exp
				// Fire Event for (GD-205)
				if (data?.experiment?.version) {
					this.$kvTrackEvent(
						'Causes',
						'EXP-GD-205-Jan2022',
						data?.experiment?.version === 'shown' ? 'b' : 'a'
					);
					if (data?.experiment?.version === 'shown') {
						// redirect user
						this.$router.push({
							path: '/lp/causes'
						});
					}
				}
			});
		}
	},
	computed: {
		isMobile() {
			if (!this.$isServer) {
				return document?.documentElement?.clientWidth < 735 ?? false;
			}
			return false;
		},
		isNewUser() {
			return !this.hasEverLoggedIn;
		}
	},
};
</script>
