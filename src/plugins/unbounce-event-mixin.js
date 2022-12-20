import logReadQueryError from '@/util/logReadQueryError';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';

export default {
	inject: ['apollo', 'cookieStore'],
	mounted() {
		const unbounceEmailCaptureRoute = this.$route?.meta?.unbounceEmailCapture ?? false;
		const unbouncePopUpRoute = this.$route?.meta?.unbouncePopUp ?? false;

		const utmEmailMedium = this.$route?.query?.utm_medium === 'email';

		// activateUnbounceEvent is a GTM trigger that fires the unbounce email capture script.
		// activateunbouncePopUp is a GTM trigger that fires the unbounce pop up script.

		// Set cookie to disabled unbounce for future visits
		if (utmEmailMedium) {
			this.cookieStore.set(
				'kvutm_medium_email',
				true,
				{ expires: new Date(new Date().setFullYear(new Date().getFullYear() + 2)) }
			);
		}

		const utmEmailMediumCookie = this.cookieStore.get('kvutm_medium_email');
		// default to true so that we don't fire the unbounce event if we can't read the query
		let hasEverLoggedIn;

		/** get has ever logged in query */
		try {
			const data = this.apollo.readQuery({
				query: hasEverLoggedInQuery
			});
			// Setup unbounce event trigger which is restricted to non-logged-in and unknown users
			hasEverLoggedIn = data?.hasEverLoggedIn ?? true;
		} catch (err) {
			logReadQueryError(err, 'unbounce-event-mixin');
		}

		/** GTM activateUnbounceEvent
		 * Only attempt to fire unbounce event for users who do
		* not currently have utm_medium=email in query params,
		* do not have utm cookie signifying a previous visit with
		* utm_medium=email in query params, and are on a route
		* with unbounce: true
		*/
		const emailCookieOrUtm = !utmEmailMedium && !utmEmailMediumCookie;

		if (unbounceEmailCaptureRoute && emailCookieOrUtm) {
			// Check for hasEverLoggedIn
			if (!hasEverLoggedIn) {
				// push data object if eligible + assigned
				window.dataLayer.push({ event: 'activateUnbounceEvent' });
			}
		}

		/** GTM activateUnbouncePopUp
		 * Fire the unbounce pop up event trigger if user is logged in.
		*/
		if (unbouncePopUpRoute) {
			// Check for hasEverLoggedIn
			if (hasEverLoggedIn) {
				// push data object if eligible + assigned
				window.dataLayer.push({ event: 'activateUnbouncePopUp' });
			}
		}
	}
};
