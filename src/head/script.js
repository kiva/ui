export default config => {
	// Google Analytics snippet
	const insertGoogleAnalytics = () => {
		/* eslint-disable */
		if (config.gaAlternateId) {
			(function () {
				const gaALt = document.createElement('script'); gaALt.type = 'text/javascript'; gaALt.async = true;
				gaALt.src = `${document.location.protocol == 'https:' ? 'https://ssl' : 'http://www'}.google-analytics.com/ga.js`;
				const s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gaALt, s);
			}());
		}

		(function (i, s, o, g, r, a, m) {
			i.GoogleAnalyticsObject = r; i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments);
			}, i[r].l = 1 * new Date(); a = s.createElement(o),
			m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);
		}(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'));
		ga('create', config.gaId, 'auto');
		/* eslint-enable */
	};

	// One Trust Cookie Management
	if (config.oneTrust && config.oneTrust.enable) {
		/* eslint-disable */
		(function () {
			// Main OneTrust script to display cookie notice and set user preferences
			const p = document.getElementsByTagName('script')[0];
			const s = document.createElement('script');
			s.setAttribute('type', 'text/javascript');
			s.setAttribute('data-domain-script', `${config.oneTrust.key}${config.oneTrust.domainSuffix}`)
			s.src = `https://cdn.cookielaw.org/consent/${config.oneTrust.key}${config.oneTrust.domainSuffix}/otSDKStub.js`;
			p.parentNode.insertBefore(s, p);
		}());

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
			if (config.enableAnalytics && config.enableGA) {
				OneTrust.InsertHtml('', 'head', insertGoogleAnalytics, null, 'C0002');
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

			/** Category 'C0005'
			* Social Media Cookies
			* These cookies are set by a range of social media services that we have added to the site to enable
			* you to share our content with your friends and networks. They are capable of tracking your browser
			* across other sites and building up a profile of your interests. This may impact the content and messages
			* you see on other websites you visit. If you do not allow these cookies you may not be able to use or see
			* these sharing tools.
			* */
		};
		/* eslint-enable */
	}

	// Legacy behavior without oneTrust
	if (!config.oneTrust || !config.oneTrust.enable) {
		// check for opt out of 3rd party scripts + cookies
		const cookies = typeof document !== 'undefined' ? document.cookie.split(';') : [];
		let optout = false;
		for (let i = 0; i < cookies.length; i++) { // eslint-disable-line
			if (cookies[i].indexOf('kvgdpr') !== -1 && cookies[i].indexOf('opted_out=true') !== -1) {
				optout = true;
			}
		}

		if (config.enableAnalytics) {
			if (config.enableGA && !optout) {
				insertGoogleAnalytics();
			}
		}

		// TODO move these to their own function like GA above and insert into OneTrust
		if (config.enableAnalytics) {
			// Google Tag Manager snippet
			if (config.enableGTM && !optout) {
				/* eslint-disable */
				(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
				new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
				})(window,document,'script','dataLayer',config.googleTagmanagerId);
				/* eslint-enable */
			}

			if (config.enableSnowplow) {
				/* eslint-disable */
				(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
					p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
					};p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
					n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,'script','//cdn.jsdelivr.net/gh/snowplow/sp-js-assets@2.17.0/sp.js','snowplow'));
					window.snowplow('newTracker', 'cf', config.snowplowUri, { // Initialize a tracker
						appId: 'kiva' ,
						cookieDomain: '.kiva.org',
						// uncomment this option to examine context information in your vm
						// encodeBase64: false,
					});
				/* eslint-enable */
			}

			if (config.algoliaConfig.enableAA && !optout) {
				/* eslint-disable */
				if (typeof String.prototype.startsWith === 'function') {
					(function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e.aa=e.aa||function(){
						(e.aa.queue=e.aa.queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)
						[0],i.async=1,i.src="https://cdn.jsdelivr.net/npm/search-insights@1.2.0",
						c.parentNode.insertBefore(i,c)})(window,document,"script",0,"aa");
				}
				/* eslint-enable */
			}
		}

		// Facebook Pixel Code
		if (config.enableFB && !optout) {
			/* eslint-disable */
			!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
				n.callMethod.apply(n,arguments):n.queue.push(arguments)};
				if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
				n.queue=[];t=b.createElement(e);t.async=!0;
				t.src=v;s=b.getElementsByTagName(e)[0];
				s.parentNode.insertBefore(t,s)}(window, document,'script',
				'https://connect.facebook.net/en_US/fbevents.js');
			fbq('init', config.fbPixelId);
			/* eslint-enable */
		}

		// PerimeterX snippet
		if (config.enablePerimeterx) {
			/* eslint-disable */
			(function(){
				window._pxAppId = config.perimeterxAppId;
				var p = document.getElementsByTagName('script')[0],
					s = document.createElement('script');
				s.async = 1;
				s.src = `/${config.perimeterxAppId.substring(2)}/init.js`;
				p.parentNode.insertBefore(s,p);
			}());
			/* eslint-enable */
		}
	}
};
