/* eslint-disable no-underscore-dangle */
import logFormatter from '#src/util/logFormatter';
import {
	fireQueuedEvents,
	getUserTypeFromCookies,
	initAnalytics,
	trackDonationMetaEvent,
	trackEvent,
	trackFBCustomEvent,
	trackFBPageView,
	trackPageView,
	trackReEngagementEvent,
	trackSelfDescribingEvent,
	trackTransaction,
} from '@kiva/kv-analytics';

// install method for plugin
export default {
	install: (app, { cookieStore } = {}) => {
		const inBrowser = typeof window !== 'undefined';

		const kvActions = {
			pageview: (to, from) => {
				if (!inBrowser) return false;

				// Snowplow and Google Analytics pageview
				trackPageView(to, from);

				// Facebook pixel pageview
				const userType = getUserTypeFromCookies(name => cookieStore?.get(name));
				trackFBPageView(userType);
			},
			trackEvent: (category, action, label, property, value, callback) => {
				// The package holds events in a queue until the trackers load. On the server that queue
				// is shared by every request and never sent, so only track in the browser.
				if (!inBrowser) return;
				trackEvent(category, action, label, property, value, callback);
			},
			trackSelfDescribingEvent: eventData => {
				// the data passed into this should be a JSON object similar to the following
				// and should be defined by a schema in github.com/kiva/snowplow/tree/master/conf
				// {
				//     schema: 'https://raw.githubusercontent.com/kiva/...',
				//     data: {
				//         "loanId": 654321,
				//         "amount": 500,
				//			...
				//     }
				// });
				// Browser only, for the same reason as trackEvent
				if (!inBrowser) return;
				trackSelfDescribingEvent(eventData);
			},
			parseEventProperties: eventValue => {
				// Ensure we have a non-empty array to begin with
				if (Array.isArray(eventValue) && eventValue.length) {
					// Handle multiple events being pass as an array
					if (Array.isArray(eventValue[0])) {
						eventValue.forEach(params => kvActions.trackEvent(...params));
					} else {
						kvActions.trackEvent(...eventValue);
					}
				} else {
					throw new TypeError(`Expected non-empty array, but got ${eventValue}`);
				}
			},
			trackTransaction: transactionData => {
				if (!transactionData.transactionId) {
					return false;
				}

				// Meta purchase, Google Analytics and Optimizely
				trackTransaction(transactionData);
				// Fires only when the lender was idle or lapsed and the transaction contains loans
				trackReEngagementEvent(transactionData);

				const { loans, donationTotal, kivaCards } = transactionData;

				// A stand-alone gift to Kiva. A donation alongside loans or Kiva Cards is a tip on
				// that order, not a donation in its own right, so both must be absent.
				// trackDonationMetaEvent ignores a zero or unparseable total.
				if (!loans?.length && !kivaCards?.length) {
					trackDonationMetaEvent(donationTotal);
				}
			},
		};

		app.directive('kv-track-event', {
			beforeMount: (el, binding) => {
				// TODO: add arg for once, submit + change events
				if (typeof el === 'object' && binding.value) {
					el.addEventListener('click', () => {
						try {
							kvActions.parseEventProperties(binding.value);
						} catch (e) {
							logFormatter(e, 'error');
						}
					});
				}
			}
		});

		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$setKvAnalyticsData = (userId = null) => {
			// The first pageview is sent once this finishes. If a visitor declined advertising cookies or opted
			// out, Google Analytics never loads and initAnalytics waits its full 5s. Keep our existing 3s limit so
			// fewer short visits lose their pageview.
			const threeSecondWait = new Promise(resolve => {
				window.setTimeout(resolve, 3000);
			});
			// Log a tracker error instead of rejecting, so the first pageview still goes out
			const startTrackers = initAnalytics(userId, window.__KV_CONFIG__?.gaId).catch(error => {
				logFormatter('Failed to start analytics trackers', 'error', { error });
			});
			return Promise.race([startTrackers, threeSecondWait]);
		};

		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$fireAsyncPageView = (to, from) => {
			kvActions.pageview(to, from);
		};

		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$fireServerPageView = () => {
			const to = { path: window.location.pathname };
			const from = { path: document.referrer };
			// delay pageview call to ensure window.performance.timing is fully populated
			let pageviewFired = false;
			// fallback if readyState = complete is delayed
			const fallbackPageview = setTimeout(() => {
				pageviewFired = true;
				kvActions.pageview(to, from);
			}, 500);
			document.onreadystatechange = () => {
				// fire on complete if not already fired
				if (document.readyState === 'complete') {
					if (!pageviewFired) {
						clearTimeout(fallbackPageview);
						kvActions.pageview(to, from);
					}
				}
			};
		};

		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$fireQueuedEvents = () => {
			fireQueuedEvents();
		};

		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$kvTrackEvent = (category, action, label, property, value, callback) => {
			kvActions.trackEvent(category, action, label, property, value, callback);
		};

		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$kvTrackSelfDescribingEvent = data => {
			kvActions.trackSelfDescribingEvent(data);
		};

		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$kvTrackTransaction = transactionData => {
			kvActions.trackTransaction(transactionData);
		};

		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$kvTrackFBCustomEvent = (eventName, eventData = null) => {
			trackFBCustomEvent(eventName, eventData);
		};
	}
};
