import logFormatter from '@/util/logFormatter';
import SimpleQueue from '@/util/simpleQueue';

// install method for plugin
export default {
	install: Vue => {
		const inBrowser = typeof window !== 'undefined';
		let snowplowLoaded;
		let gtagLoaded;
		let fbLoaded;
		const queue = new SimpleQueue();

		const kvActions = {
			checkLibs: () => {
				gtagLoaded = inBrowser && typeof window.gtag === 'function';
				snowplowLoaded = inBrowser && typeof window.snowplow === 'function';
				fbLoaded = inBrowser && typeof window.fbq === 'function';

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

				// facebook pixel pageview
				if (fbLoaded) {
					// we used to pass a user_type but it's always empty across the site
					// { user_type: '???'}
					window.fbq('track', 'PageView');
				}
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
			// https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking#tracking-custom-events
			trackFBCustomEvent: (eventName, eventData = null) => {
				if (fbLoaded) {
					window.fbq('trackCustom', eventName, eventData);
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
				// Nothing to track
				if (transactionData.transactionId === '') {
					return false;
				}

				if (fbLoaded) {
					kvActions.trackFBTransaction(transactionData);
				}
				if (gtagLoaded) {
					kvActions.trackGATransaction(transactionData);
				}
				kvActions.trackQuantcast(transactionData);
			},
			trackFBTransaction: transactionData => {
				const itemTotal = transactionData.itemTotal || '';
				if (typeof window.fbq !== 'undefined' && typeof itemTotal !== 'undefined') {
					window.fbq('track', 'Purchase', {
						currency: 'USD',
						value: itemTotal,
						content_type: transactionData.isFTD ? 'FirstTimeDepositor' : 'ReturningLender'
					});
				}

				// send transaction data
				kvActions.trackFBCustomEvent(
					'TransactionInfo',
					{
						depositTotal: transactionData.depositTotal,
						donationTotal: transactionData.donationTotal,
						isFtd: transactionData.isFTD ? 'FirstTimeDepositor' : 'ReturningLender',
						isTip: transactionData.isTip,
						isUserEdited: transactionData.isUserEdited,
						itemTotal: transactionData.itemTotal,
						loanCount: transactionData.loanCount,
						loanTotal: transactionData.loanTotal,
						kivaCardCount: transactionData.kivaCardCount,
						kivaCardTotal: transactionData.kivaCardTotal,
						kivaCreditUsed: transactionData.kivaCreditAppliedTotal,
						paymentType: transactionData.paymentType,
						transactionId: transactionData.transactionId,
					}
				);

				// signify transaction has kiva cards
				if (transactionData.kivaCards && transactionData.kivaCards.length) {
					kvActions.trackFBCustomEvent(
						'transactionContainsKivaCards',
						{
							kivaCardTotal: transactionData.kivaCardTotal
						}
					);
				}
				// signifiy transaction ftd status
				if (transactionData.isFTD && typeof itemTotal !== 'undefined') {
					kvActions.trackFBCustomEvent(
						'firstTimeDepositorTransaction',
						{
							itemTotal
						}
					);
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
				const allItems = transactionData.loans.concat(transactionData.donations);

				// Setup purchased items
				const purchasedItems = allItems.map(item => {
					return {
						id: item.id,
						name: item.__typename, // eslint-disable-line
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
			trackQuantcast: transactionData => {
				// exit if script is not loaded due to blocking or user choice
				// eslint-disable-next-line no-underscore-dangle
				if (typeof window._qevents === 'undefined') return false;

				let qacct = null;
				/* eslint-disable no-underscore-dangle */
				if (window.__KV_CONFIG__ && window.__KV_CONFIG__.quantcastId) {
					qacct = window.__KV_CONFIG__.quantcastId;
				}

				const customerType = transactionData.isFTD ? 'FirstTimeDepositor' : 'ReturningLender';
				const donationAmountNormalized = transactionData.donationTotal ? transactionData.donationTotal.replace('.', '') : null;

				// format data for quantcast event
				// eslint-disable-next-line no-underscore-dangle
				window._qevents.push({
					qacct,
					uid: 'null',
					labels: `_fp.event.Checkout,_fp.customer.${customerType},_fp.donation.${donationAmountNormalized}`,
					orderid: String(transactionData.transactionId),
					revenue: String(transactionData.itemTotal),
					event: 'refresh'
				});
			},
		};

		Vue.directive('kv-track-event', {
			bind: (el, binding) => {
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
		Vue.prototype.$setKvAnalyticsData = (userId = null) => {
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
						if (gtagLoaded && window.__KV_CONFIG__ && window.__KV_CONFIG__.gaId) {
							window.gtag('config', window.__KV_CONFIG__.gaId, {
								user_id: userId,
								dimension1: userId
							});
						}
						// set id on dataLayer
						if (typeof window.dataLayer === 'object') {
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
		Vue.prototype.$fireAsyncPageView = (to, from) => {
			kvActions.pageview(to, from);
		};

		// eslint-disable-next-line no-param-reassign
		Vue.prototype.$fireServerPageView = () => {
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
		Vue.prototype.$fireQueuedEvents = () => {
			kvActions.fireQueuedEvents();
		};

		// eslint-disable-next-line no-param-reassign
		Vue.prototype.$kvSetCustomUrl = (url = window.location.href) => {
			kvActions.setCustomUrl(url);
		};

		// eslint-disable-next-line no-param-reassign
		Vue.prototype.$kvTrackEvent = (category, action, label, property, value, callback) => {
			kvActions.trackEvent(category, action, label, property, value, callback);
		};

		// eslint-disable-next-line no-param-reassign
		Vue.prototype.$kvTrackSelfDescribingEvent = data => {
			kvActions.trackSelfDescribingEvent(data);
		};

		// eslint-disable-next-line no-param-reassign
		Vue.prototype.$kvTrackTransaction = transactionData => {
			kvActions.trackTransaction(transactionData);
		};

		// eslint-disable-next-line no-param-reassign
		Vue.prototype.$kvTrackFBCustomEvent = (eventName, eventData = null) => {
			kvActions.trackFBCustomEvent(eventName, eventData);
		};
	}
};
