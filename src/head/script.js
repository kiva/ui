export default config => {
	// check for opt out of 3rd party scripts + cookies
	const cookies = typeof document !== 'undefined' ? document.cookie.split(';') : [];
	let optout = false;
	for (let i = 0; i < cookies.length; i++) { // eslint-disable-line
		if (cookies[i].indexOf('kvgdpr') !== -1 && cookies[i].indexOf('opted_out=true') !== -1) {
			optout = true;
		}
	}

	// Google Tag Manager snippet
	if (config.enableAnalytics) {
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
				n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,'script','//d1fc8wv8zag5ca.cloudfront.net/2.9.0/sp.js','snowplow'));
			window.snowplow('newTracker', 'cf', config.snowplowUri, { // Initialize a tracker
				appId: 'kiva' ,
				cookieDomain: '.kiva.org',
				contexts: {
					// global context that establishes additional session identification, enables better perf reporting
					webPage: true,
				},
				// encodeBase64: false, // uncomment this option to examine context information in your vm
			});
			/* eslint-enable */
		}

		if (config.enableGA && !optout) {
			/* eslint-disable */
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
			ga('create', config.gaId, 'auto');
			/* eslint-enable */
		}

		if (config.algoliaConfig.enableAA && !optout) {
			/* eslint-disable */
			(function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e.aa=e.aa||function(){
				(e.aa.queue=e.aa.queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)
				[0],i.async=1,i.src="https://cdn.jsdelivr.net/npm/search-insights@1.0.0",
				c.parentNode.insertBefore(i,c)})(window,document,"script",0,"aa");
			/* eslint-enable */
		}
	}

	// Facebook JSSDK
	if (config.enableFB && !optout) {
		/* eslint-disable */
		window.fbAsyncInit = function() {
			FB.init({
				appId: config.fbApplicationId,
				autoLogAppEvents: true,
				cookie: true, // sets a cookie for the session
				status: true, // set to true to check login status automatically on each page load
				xfbml: false, // set to true to have fb parse the dom looking for social plugins
				version: 'v2.2' // current 'v3.1'
			});
		};
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			// js.src = "https://connect.facebook.net/en_US/sdk/debug.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
		/* eslint-enable */
	}

	// PerimeterX snippet
	if (config.enablePerimeterx && !optout) {
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
};
