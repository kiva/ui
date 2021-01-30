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
				n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,'script','//cdn.jsdelivr.net/gh/snowplow/sp-js-assets@2.17.0/sp.js','snowplow'));
			window.snowplow('newTracker', 'cf', config.snowplowUri, { // Initialize a tracker
				appId: 'kiva' ,
				cookieDomain: '.kiva.org',
				// uncomment this option to examine context information in your vm
				// encodeBase64: false,
			});
			/* eslint-enable */
		}

		if (config.enableGA && !optout) {
			/* eslint-disable */
			if (config.gaAlternateId) {
				(function() {
					var gaALt = document.createElement('script'); gaALt.type = 'text/javascript'; gaALt.async = true;
					gaALt.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
					var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gaALt, s);
				})();
			}

			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
			ga('create', config.gaId, 'auto');
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
};
