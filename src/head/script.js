export default (config, globalOneTrustEvent) => {
	// check for opt out of 3rd party scripts + cookies
	const cookies = typeof document !== 'undefined' ? document.cookie.split(';') : [];
	let optout = false;
	for (let i = 0; i < cookies.length; i++) { // eslint-disable-line
		if (cookies[i].indexOf('kvgdpr') > -1 && cookies[i].indexOf('opted_out=true') > -1) {
			optout = true;
		}
	}
	// scaffold global dataLayer
	// - ensures data can be pushed hereafter
	// - if active, gtm is primary consumer
	window.dataLayer = window.dataLayer || [];

	// Google Analytics snippet
	const insertGoogleAnalytics = () => {
		// Insert + Configure Gtag.js
		const p = document.getElementsByTagName('script')[0];
		const s = document.createElement('script');
		s.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`;
		p.parentNode.insertBefore(s, p);
		// Data layer is established globally
		window.gtag = function gtag() {
			// eslint-disable-next-line prefer-rest-params
			window.dataLayer.push(arguments);
		};
		window.gtag('js', new Date());
		// add "debug_mode: true" to the options object for debugging
		window.gtag('config', config.gaId, { send_page_view: false });
	};

	// Snowplow snippet
	const insertSnowplow = () => {
		/* eslint-disable */
		(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
			p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
			};p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
			n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,'script','//cdn.jsdelivr.net/gh/snowplow/sp-js-assets@2.18.2/sp.js','snowplow'));
			window.snowplow('newTracker', 'cf', config.snowplowUri, { // Initialize a tracker
				appId: 'kiva' ,
				cookieDomain: '.kiva.org',
				contexts: {
					optimizelyXSummary: true,
					performanceTiming: true
				},
				// uncomment this option to examine context information in your vm
				// encodeBase64: false,
			});
		/* eslint-enable */
	};

	const activateOptimizely = () => {
		// eslint-disable-next-line dot-notation
		window['optimizely'].push({ type: 'sendEvents' });
	};

	// Google Tag Manager snippet
	const insertGTM = () => {
		/* eslint-disable */
		(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer',config.googleTagmanagerId);
		/* eslint-enable */
	};

	// Hotjar Snippet
	const insertHotjar = () => {
		/* eslint-disable */
		(function(h,o,t,j,a,r){
			h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
			h._hjSettings={hjid:config.hotjarId,hjsv:6};
			a=o.getElementsByTagName('head')[0];
			r=o.createElement('script');r.async=1;
			r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
			a.appendChild(r);
		})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
	};
	// Always load
	// PerimeterX snippet
	if (config.enablePerimeterx) {
		/* eslint-disable */
		(function(){
			window._pxAppId = config.perimeterxAppId;
			var p = document.getElementsByTagName('script')[0],
				s = document.createElement('script');
			s.async = 1;
			s.src = `${window.location.origin}/${config.perimeterxAppId.substring(2)}/init.js`;
			p.parentNode.insertBefore(s,p);
		}());
		/* eslint-enable */
	}

	// One Trust Cookie Management
	if (config.oneTrust && config.oneTrust.enable) {
		/* eslint-disable */
		// Follow up OneTrust function.
		// This function is called when cookie preferences are changed on the OneTrust widget
		window.OptanonWrapper = () => {
			/**
			 * Insert scripts if user has enabled OneTrust Category
			 * These categories must match the categories for the specific cookies in the OneTrust admin interface
			 * */

			/** Category 'C0001'
			* Strictly Necessary Cookies
			* These cookies are necessary for the website to function and cannot be switched off in our systems.
			* They are usually only set in response to actions made by you which amount to a request for services,
			* such as setting your privacy preferences, logging in or filling in forms. You can set your browser
			* to block or alert you about these cookies, but some parts of the site will not then work.
			* These cookies do not store any personally identifiable information.
			* */

			/** Category 'C0002'
			* Performance Cookies
			* These cookies allow us to count visits and traffic sources so we can measure and improve the performance
			* of our site. They help us to know which pages are the most and least popular and see how visitors move
			* around the site. All information these cookies collect is aggregated and therefore anonymous. If you
			* do not allow these cookies we will not know when you have visited our site, and will not be able to
			* monitor its performance.
			* */
			if (config.enableAnalytics) {
				if (config.enableOptimizely && !optout) {
					// reactivate optimizely events
					OneTrust.InsertHtml('', 'head', activateOptimizely, null, 'C0002');
				}
				if (config.enableGA && !optout) {
					OneTrust.InsertHtml('', 'head', insertGoogleAnalytics, null, 'C0002');
				}
				if (config.enableSnowplow) {
					OneTrust.InsertHtml('', 'head', insertSnowplow, null, 'C0002');
				}
				if (config.enableHotjar && !optout) {
					OneTrust.InsertHtml('', 'head', insertHotjar, null, 'C0002');
				}
			}

			/** Category 'C0003'
			* Functional Cookies
			* These cookies enable the website to provide enhanced functionality and personalization. They may be
			* set by us or by third party providers whose services we have added to our pages. If you do not allow
			* these cookies then some or all of these services may not function properly.
			* */

			/** Category 'C0004'
			* Targeting Cookies
			* These cookies may be set through our site by our advertising partners. They may be used by
			* those companies to build a profile of your interests and show you relevant adverts on other sites.
			* They do not store directly personal information, but are based on uniquely identifying your browser
			* and internet device. If you do not allow these cookies, you will experience less targeted advertising.
			* */

			if (config.enableAnalytics) {
				if (config.enableGTM && !optout) {
					OneTrust.InsertHtml('', 'head', insertGTM, null, 'C0004');
				}
			}

			/** Category 'C0005'
			* Social Media Cookies
			* These cookies are set by a range of social media services that we have added to the site to enable
			* you to share our content with your friends and networks. They are capable of tracking your browser
			* across other sites and building up a profile of your interests. This may impact the content and messages
			* you see on other websites you visit. If you do not allow these cookies you may not be able to use or see
			* these sharing tools.
			* */
			// Currently any social media scripts are loaded via GTM

			/* fire global event with oneTrust settings */
			globalOneTrustEvent();
		};
		/* eslint-enable */
	}

	// Legacy behavior without oneTrust
	if (!config.oneTrust || !config.oneTrust.enable) {
		if (config.enableAnalytics) {
			if (config.enableOptimizely && !optout) {
				// reactivate optimizely events
				// eslint-disable-next-line dot-notation
				window['optimizely'].push({ type: 'sendEvents' });
			}
			if (config.enableGA && !optout) {
				insertGoogleAnalytics();
			}
			if (config.enableSnowplow) {
				insertSnowplow();
			}
			if (config.enableGTM && !optout) {
				insertGTM();
			}
			if (config.enableHotjar && !optout) {
				insertHotjar();
			}
		}
	}
};
