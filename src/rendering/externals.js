import serialize from 'serialize-javascript';
import headScript from '#src/head/script';
import oneTrustEvent from '#src/head/oneTrustEvent';

let renderedExternals = '';
export function renderExternals(config) {
	// render externals if they haven't been rendered yet
	if (!renderedExternals) {
		// add OneTrust loader
		if (config.oneTrust && config.oneTrust.enable) {
			const key = `${config.oneTrust.key}${config.oneTrust.domainSuffix}`;
			const src = `https://cdn.cookielaw.org/consent/${key}/otSDKStub.js`;
			renderedExternals += `<script type="text/javascript" data-domain-script="${key}" src="${src}"></script>`;
		}
		// add primary head script
		const renderedHeadScript = serialize(headScript);
		const renderedOneTrustEvent = serialize(oneTrustEvent);
		// eslint-disable-next-line max-len
		renderedExternals += `<script>(${renderedHeadScript})(window.__KV_CONFIG__, ${renderedOneTrustEvent});</script>`;
	}
	return renderedExternals;
}

let renderedOptInExternals = '';
export function renderOptInExternals(config, cookieStore) {
	// Check if the user has opted out of 3rd party cookies
	const cookie = cookieStore.get('kvgdpr')?.trim();
	if (cookie && /(\b|&)opted_out=true(\b|&)/.test(cookie)) {
		return '';
	}

	// render externals for users that are not opted out of 3rd party cookies
	if (!renderedOptInExternals) {
		// setup Optimizely loader
		if (config?.enableOptimizely && config?.optimizelyProjectId) {
			// eslint-disable-next-line max-len
			renderedOptInExternals += '<script type="text/javascript">window["optimizely"]=window["optimizely"]||[];window["optimizely"].push({"type":"holdEvents"});</script>';
			const optimizelySrc = `https://cdn.optimizely.com/js/${config?.optimizelyProjectId}.js`;
			renderedOptInExternals += `<script type="text/javascript" src="${optimizelySrc}"></script>`;
		}
	}

	return renderedOptInExternals;
}
