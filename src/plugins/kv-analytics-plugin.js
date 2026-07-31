/* eslint-disable no-underscore-dangle */
import logFormatter from '#src/util/logFormatter';
import SimpleQueue from '#src/util/simpleQueue';
import {
	getUserTypeFromCookies,
	trackFBCustomEvent,
	trackFBPageView,
	trackFBTransaction,
} from '@kiva/kv-analytics';

// install method for plugin
export default {
	install: (app, { cookieStore } = {}) => {
		const inBrowser = typeof window !== 'undefined';
		let snowplowLoaded;
		let gtagLoaded;
		let optimizelyLoaded;
		const queue = new SimpleQueue();

		const kvActions = {
			checkLibs: () => {
				gtagLoaded = inBrowser && typeof window.gtag === 'function';
				snowplowLoaded = inBrowser && typeof window.snowplow === 'function';
				optimizelyLoaded = inBrowser && typeof window.optimizely?.push === 'function';

				if (typeof window.gtag === 'function' && typeof window.snowplow === 'function') {
					return true;
				}
				return false;
			},
			pageview: (to, from) => {
				if (!inBrowser) return false;
				kvActions.checkLibs();

				let toUrl = typeof to === 'string' ? to : window.location.href;
				let fromUrl = typeof from === 'string' ? from : document.referrer;

				// update urls for async page changes
				if (to && to.matched && to.matched.length) {
					toUrl = window.location.origin + to.fullPath;
				}
				if (from && from.matched && from.matched.length) {
					fromUrl = window.location.origin + from.fullPath;
				}

				// Snowplow pageview
				if (snowplowLoaded) {
					// - snowplow seems to know better than the path rewriting performed by vue-router
					window.snowplow('setCustomUrl', toUrl);
					// set referrer for async page transitions
					if (from && from.matched && from.path !== '') {
						window.snowplow('setReferrerUrl', fromUrl); // asyncFromUrl
					}
					window.snowplow('trackPageView');
				}

				// Google Analytics gtag.js pageview
				if (gtagLoaded) {
					let gaPath = `${window.location.pathname}${window.location.search || ''}`;
					if (to && to.matched && to.matched.length) {
						gaPath = to.fullPath;
					}
					window.gtag('event', 'page_view', {
						page_path: gaPath
					});
				}

				// Facebook pixel pageview
				const userType = getUserTypeFromCookies(name => cookieStore?.get(name));
				trackFBPageView(userType);
			},
			setCustomUrl: url => {
				if (snowplowLoaded) {
					window.snowplow('setCustomUrl', url);
				}
			},
			trackEvent: (category, action, label, property, value, callback = () => {}) => {
				const eventLabel = (label !== undefined && label !== null) ? String(label) : undefined;
				const eventValue = (value !== undefined && value !== null) ? parseInt(value, 10) : undefined;
				const eventProperty = (property !== undefined && property !== null) ? String(property) : undefined;

				// Attempt gtag event
				if (gtagLoaded) {
					window.gtag('event', String(action), {
						event_category: String(category),
						event_label: eventLabel,
						value: eventValue
					});
				}

				// Attempt Snowplow event
				if (snowplowLoaded) {
					kvActions.trackSnowplowEvent({
						category,
						action,
						eventLabel,
						eventProperty,
						eventValue,
						callback
					});
				} else {
					callback({ error: 'not loaded' });
					// add missed snowplow event to queue
					queue.add({
						eventType: 'trackSnowplowEvent',
						eventLib: 'snowplow',
						eventData: {
							category,
							action,
							eventLabel,
							eventProperty,
							eventValue,
							callback
						}
					});
				}

				return true;
			},
			trackSnowplowEvent: eventData => {
				kvActions.checkLibs();
				if (!snowplowLoaded) return false;

				// In case there is a problem with the tracking event ensure that the callback gets called after 500ms
				let callbackCalled = false;
				const callbackTimeout = setTimeout(() => {
					if (!callbackCalled) {
						callbackCalled = true;
						eventData.callback({ error: 'timeout' });
					}
				}, 500);

				// Snowplow API
				/* eslint-disable max-len */
				// https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/tracking-specific-events/#tracking-custom-structured-events
				// https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/tracking-specific-events/#callback-after-track-2-15-0
				/* eslint-eable max-len */
				// snowplow('trackStructEvent', 'category', 'action', 'label', 'property', 'value', context, timestamp, afterTrack);
				window.snowplow(
					'trackStructEvent',
					eventData.category,
					eventData.action,
					eventData.eventLabel,
					eventData.eventProperty,
					eventData.eventValue,
					undefined,
					undefined,
					payload => {
						if (!callbackCalled) {
							callbackCalled = true;
							clearTimeout(callbackTimeout);
							eventData.callback({ payload });
						}
					}
				);
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
				if (snowplowLoaded) {
					window.snowplow('trackSelfDescribingEvent', eventData);
				} else {
					// add missed snowplow event to queue
					queue.add({
						eventType: 'trackSelfDescribingEvent',
						eventLib: 'snowplow',
						eventData,
					});
				}

				return true;
			},
			fireQueuedEvents() {
				kvActions.checkLibs();

				while (!queue.isEmpty()) {
					const item = queue.remove();
					const method = item.eventType;
					const { eventData } = item;
					if (inBrowser && typeof kvActions[method] === 'function') {
						// Wrapping the event call in a setTimeout ensures that this while loop
						// completes before the event functions are called. This is needed because
						// the event functions can add more events to this queue, and we only want
						// to process this queue once.
						window.setTimeout(() => {
							kvActions[method](eventData, true);
						});
					}
				}
			},
			parseEventProperties: eventValue => {
				// Ensure we have a non-empty array to begin with
				if (Array.isArray(eventValue) && eventValue.length) {
					// Handle multiple events being pass as an array
					if (Array.isArray(eventValue[0])) {
						eventValue.forEach(params => kvActions.trackEvent.apply(this, params));
					} else {
						kvActions.trackEvent.apply(this, eventValue);
					}
				} else {
					throw new TypeError(`Expected non-empty array, but got ${eventValue}`);
				}
			},
			trackTransaction: transactionData => {
				kvActions.checkLibs();
				if (!transactionData.transactionId) {
					return false;
				}

				trackFBTransaction(transactionData);
				const {
					reEngagementEvent,
					lifecycleStage,
					daysSinceLastLoan,
					loanTotal,
					itemTotal,
					loans,
				} = transactionData;
				if (reEngagementEvent && loans?.length) {
					trackFBCustomEvent(
						reEngagementEvent,
						{
							loanTotal,
							itemTotal,
							lifecycleStage,
							daysSinceLastLoan,
						}
					);
				}
				if (gtagLoaded) {
					kvActions.trackGATransaction(transactionData);
				}
				if (optimizelyLoaded) {
					kvActions.trackOPTransaction(transactionData);
				}
			},
			trackGATransaction: transactionData => {
				// push to dataLayer
				if (typeof window.dataLayer === 'object') {
					window.dataLayer.push({
						event: 'setTransactionData',
						...transactionData
					});
				}

				// Add each purchased item to the tracker
				const allItems = transactionData.loans
					.concat(transactionData.donations)
					.concat(transactionData.kivaCards);

				// Setup purchased items
				const purchasedItems = allItems.map(item => {
					return {
						id: item.id,
						name: item.__typename,
						price: item.price,
						quantity: 1
					};
				});

				// Post transaction information to GA
				window.gtag('event', 'purchase', {
					transaction_id: transactionData.transactionId,
					value: transactionData.itemTotal,
					currency: 'USD',
					items: purchasedItems,
					non_interaction: true
				});
			},
			trackOPTransaction: transactionData => {
				if (transactionData.depositTotal > 0) {
					window.optimizely.push({
						type: 'event',
						eventName: 'deposit',
						tags: {
							revenue: transactionData.depositTotal * 100,
							deposit_amount: transactionData.depositTotal
						}
					});
				}

				if (transactionData.loanTotal > 0) {
					window.optimizely.push({
						type: 'event',
						eventName: 'loan_share_purchase',
						tags: {
							revenue: transactionData.loanTotal * 100,
							loan_share_purchase_amount: transactionData.loanTotal
						}
					});
				}

				if (transactionData.donationTotal > 0) {
					window.optimizely.push({
						type: 'event',
						eventName: 'donation',
						tags: {
							revenue: transactionData.donationTotal * 100,
							donation_amount: transactionData.donationTotal
						}
					});
				}
			}
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
			return new Promise(resolve => {
				let readyStateTimeout;
				const readyStateInterval = window.setInterval(() => {
					if (kvActions.checkLibs()) {
						clearInterval(readyStateInterval);
						clearTimeout(readyStateTimeout);
						// Setup Global Snowplow
						if (snowplowLoaded) {
							window.snowplow('setUserId', userId);
						}
						// Setup Global GA Data
						if (userId && gtagLoaded && window.__KV_CONFIG__ && window.__KV_CONFIG__.gaId) {
							window.gtag('config', window.__KV_CONFIG__.gaId, {
								user_id: userId,
								dimension1: userId,
								send_page_view: false
							});
						}
						// set id on dataLayer
						if (userId && typeof window.dataLayer === 'object') {
							window.dataLayer.push({
								kvuid: userId
							});
						}
						// resovle for next steps
						resolve();
					}
				}, 100);

				readyStateTimeout = window.setTimeout(() => {
					// clean up interval and timeout
					clearInterval(readyStateInterval);
					clearTimeout(readyStateTimeout);
					// resolve the promise
					resolve();
				}, 3000);
			});
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
			kvActions.fireQueuedEvents();
		};

		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$kvSetCustomUrl = (url = window.location.href) => {
			kvActions.setCustomUrl(url);
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
