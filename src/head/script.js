export default config => {
	// Google Tag Manager snippet
	if (config.enableAnalytics) {
		/* eslint-disable */
		(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer',config.googleTagmanagerId);
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
			s.src = `//client.perimeterx.net/${config.perimeterxAppId}/main.min.js`;
			p.parentNode.insertBefore(s,p);
		}());
		/* eslint-enable */
	}

	if (config.enableSnowplow) {
		/* eslint-disable */
		(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
			p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
			};p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
			n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,'script','//d1fc8wv8zag5ca.cloudfront.net/2.5.3/sp.js','snowplow'));
		window.snowplow('newTracker', 'cf', config.snowplowUri, { // Initialize a tracker
			appId: 'kiva' ,
			cookieDomain: '.kiva.org'
		});
		/* eslint-enable */
	}

	if (config.enableGA) {
		/* eslint-disable */
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		ga('create', config.gaId, 'auto');
		/* eslint-enable */
	}
};
