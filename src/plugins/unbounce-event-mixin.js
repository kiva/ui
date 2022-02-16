import logReadQueryError from '@/util/logReadQueryError';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';

export default {
	inject: ['apollo', 'cookieStore'],
	created() {
		const unbounceRoute = this.$route?.meta?.unbounce ?? false;
		const utmEmailMedium = this.$route?.query?.utm_medium === 'email';

		// Set cookie to disabled unbounce for future visits
		if (utmEmailMedium) {
			this.cookieStore.set('kvutm_medium_email', true);
		}

		const utmEmailMediumCookie = this.cookieStore.get('kvutm_medium_email');

		/** Only attempt to fire unbounce event for users who do
		* not currently have utm_medium=email in query params,
		* do not have utm cookie signifying a previous visit with
		* utm_medium=email in query params, and are on a route
		* with unbounce: true
		*/
		const unbounceEnabled = unbounceRoute && !utmEmailMedium && !utmEmailMediumCookie;
		if (unbounceEnabled) {
			try {
				const data = this.apollo.readQuery({
					query: hasEverLoggedInQuery
				});
				// Setup unbounce event trigger which is restricted to non-logged-in and unknown users
				const hasEverLoggedIn = data?.hasEverLoggedIn ?? true;
				// Check for hasEverLoggedIn
				if (!hasEverLoggedIn) {
					// push data object if eligible + assigned
					if (typeof window !== 'undefined') {
						window.dataLayer.push({ event: 'activateUnbounceEvent' });
					}
				}
			} catch (err) {
				logReadQueryError(err, 'unbounce-event-mixin');
			}
		}
	}
};
