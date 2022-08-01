export default (config, globalOneTrustEvent) => {
	// check for opt out of 3rd party scripts + cookies
	const cookies = typeof document !== 'undefined' ? document.cookie.split(';') : [];
	let optout = false;
	for (let i = 0; i < cookies.length; i++) { // eslint-disable-line
		if (cookies[i].indexOf('kvgdpr') !== -1 && cookies[i].indexOf('opted_out=true') !== -1) {
			optout = true;
		}
	}
	// scaffold global dataLayer
	// - ensures data can be pushed hereafter
	// - if active, gtm is primary consumer
	window.dataLayer = window.dataLayer || [];

	// Google Analytics snippet
	const insertGoogleAnalytics = () => {
		/* eslint-disable */
		// Insert + Configure Gtag.js
		const p = document.getElementsByTagName('script')[0];
		const s = document.createElement('script');
		s.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`;
		p.parentNode.insertBefore(s, p);
		// Data layer is established globally
		window.gtag = function(){window.dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', config.gaId, { 'send_page_view': false });
		/* eslint-enable */
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

	// FullStory snippet
	const insertFullStory = () => {
		/* eslint-disable */
		window['_fs_debug'] = false;
		window['_fs_host'] = 'fullstory.com';
		window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
		window['_fs_org'] = '10F8DP';
		window['_fs_namespace'] = 'FS';
		try {
			(function(m,n,e,t,l,o,g,y){
				if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
				g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
				o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
				y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
				g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
				g.anonymize=function(){g.identify(!!0)};
				g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
				g.log = function(a,b){g("log",[a,b])};
				g.consent=function(a){g("consent",!arguments.length||a)};
				g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
				g.clearUserCookie=function(){};
				g.setVars=function(n, p){g('setVars',[n,p]);};
				g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
				if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
				g._v="1.3.0";
			})(window,document,window['_fs_namespace'],'script','user');
		} catch (e) {
			// noop
		}
		/* eslint-enable */
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

	// Facebook Pixel Code
	const insertFB = () => {
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
	};

	// Algolia Analytics
	const insertAlgoliaAnalytics = () => {
		/* eslint-disable */
		if (typeof String.prototype.startsWith === 'function') {
			(function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e.aa=e.aa||function(){
				(e.aa.queue=e.aa.queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)
				[0],i.async=1,i.src="https://cdn.jsdelivr.net/npm/search-insights@1.2.0",
				c.parentNode.insertBefore(i,c)})(window,document,"script",0,"aa");
		}
		/* eslint-enable */
	};

	// Optimizely experiment loader
	const insertOptimizely = () => {
		const p = document.getElementsByTagName('script')[0];
		const s = document.createElement('script');
		s.src = `https://cdn.optimizely.com/js/${config.optimizelyProjectId}.js`;
		p.parentNode.insertBefore(s, p);
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
			if (config.enableAnalytics) {
				if (config.enableOptimizely && !optout) {
					OneTrust.InsertHtml('', 'head', insertOptimizely, null, 'C0002');
				}
				if (config.enableGA && !optout) {
					OneTrust.InsertHtml('', 'head', insertGoogleAnalytics, null, 'C0002');
				}
				if (config.enableSnowplow) {
					OneTrust.InsertHtml('', 'head', insertSnowplow, null, 'C0002');
				}
				if (config.algoliaConfig.enableAA && !optout) {
					OneTrust.InsertHtml('', 'head', insertAlgoliaAnalytics, null, 'C0002');
				}
				if (config.enableFullStory && !optout) {
					OneTrust.InsertHtml('', 'head', insertFullStory, null, 'C0002');
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
				if (config.enableFB && !optout) {
					OneTrust.InsertHtml('', 'head', insertFB, null, 'C0004');
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
				insertOptimizely();
			}
			if (config.enableGA && !optout) {
				insertGoogleAnalytics();
			}
			if (config.enableSnowplow) {
				insertSnowplow();
			}
			if (config.enableFullStory && !optout) {
				insertFullStory();
			}
			if (config.enableGTM && !optout) {
				insertGTM();
			}
			if (config.algoliaConfig.enableAA && !optout) {
				insertAlgoliaAnalytics();
			}
		}

		if (config.enableFB && !optout) {
			insertFB();
		}
	}
};
