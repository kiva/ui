import logFormatter from '@/util/logFormatter';

// install method for plugin
export default Vue => {
	const inBrowser = typeof window !== 'undefined';
	let snowplowLoaded;
	let gaLoaded;
	let gaAltLoaded;
	let fbLoaded;

	const kvActions = {
		checkLibs: () => {
			gaLoaded = inBrowser && typeof window.ga === 'function';
			// eslint-disable-next-line no-underscore-dangle
			gaAltLoaded = inBrowser && typeof window._gaq === 'object';
			snowplowLoaded = inBrowser && typeof window.snowplow === 'function';
			fbLoaded = inBrowser && typeof window.fbq === 'function';
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

			// Google Analytics Pageview
			if (gaLoaded) {
				let gaPath = `${window.location.pathname}${window.location.search || ''}`;
				if (to && to.matched && to.matched.length) {
					gaPath = to.fullPath;
				}
				window.ga('set', 'page', gaPath);
				window.ga('send', 'pageview');
			}

			// Classic ga.js for utm tracking
			if (gaAltLoaded) {
				let gaAltId;
				/* eslint-disable no-underscore-dangle */
				if (window.__KV_CONFIG__ && window.__KV_CONFIG__.gaAlternateId) {
					gaAltId = window.__KV_CONFIG__.gaAlternateId;
				}
				window._gaq.push(['_setAccount', gaAltId]);
				window._gaq.push(['_trackPageview']);
				/* eslint-enable no-underscore-dangle */
			}

			// facebook pixel pageview
			if (fbLoaded) {
				// we used to pass a user_type but it's always empty across the site
				// { user_type: '???'}
				window.fbq('track', 'PageView');
			}
		},
		trackEvent: (category, action, label, property, value) => {
			const eventLabel = (label !== undefined && label !== null) ? String(label) : undefined;
			const eventValue = (value !== undefined && value !== null) ? parseInt(value, 10) : undefined;
			const eventProperty = (property !== undefined && property !== null) ? String(property) : undefined;

			// Attempt GA event
			if (gaLoaded) {
				// GA API
				// https://developers.google.com/analytics/devguides/collection/analyticsjs/events
				// ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
				window.ga('send', 'event', {
					eventCategory: String(category),
					eventAction: String(action),
					eventLabel,
					eventValue
				});
			}

			// Attempt Snowplow event
			if (snowplowLoaded) {
				// Snowplow API
				// eslint-disable-next-line max-len
				// https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#trackStructEvent
				// snowplow_name_here('trackStructEvent', 'category','action','label','property','value');
				window.snowplow('trackStructEvent', category, action, eventLabel, eventProperty, eventValue);
			}

			return true;
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
			}

			return true;
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
			// Nothing to track
			if (transactionData.transactionId === '') {
				return false;
			}

			if (fbLoaded) {
				kvActions.trackFBTransaction(transactionData);
			}
			if (gaLoaded) {
				kvActions.trackGATransaction(transactionData);
			}
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
			// Add each purchased item to the tracker
			const allItems = transactionData.loans.concat(transactionData.donations);
			allItems.forEach(item => {
				window.ga('ec:addProduct', {
					id: item.id,
					name: item.__typename, // eslint-disable-line
					price: item.price,
					quantity: 1
				});
			});

			// Add the transaction to the tracker
			window.ga('ec:setAction', 'purchase', {
				id: transactionData.transactionId,
				revenue: transactionData.itemTotal
			});

			// Save transaction information to GA
			window.ga('send', 'event', 'Ecommerce', 'Purchase', { nonInteraction: 1 });
		}

	};

	Vue.directive('kv-track-event', {
		bind: (el, binding) => {
			// TODO: add arg for once, submit + change events
			if (typeof el === 'object') {
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
		// establish loaded libs
		kvActions.checkLibs();

		// Setup Global Snowplow
		if (snowplowLoaded) {
			window.snowplow('setUserId', userId);
		}
		// Setup Global GA Data
		if (gaLoaded) {
			window.ga('set', { userId });
			window.ga('set', 'useBeacon', true);
			window.ga('require', 'ec');
			window.ga('set', 'dimension1', userId);
		}
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
	Vue.prototype.$kvTrackEvent = (category, action, label, property, value) => {
		kvActions.trackEvent(category, action, label, property, value);
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
};
