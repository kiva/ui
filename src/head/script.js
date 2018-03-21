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
};
