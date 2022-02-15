import logReadQueryError from '@/util/logReadQueryError';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';

export default {
	inject: ['apollo', 'cookieStore'],
	created() {
		const unbounceEnabled = this.$route?.meta?.unbounce;

		// Route meta contains unbounce: true
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
