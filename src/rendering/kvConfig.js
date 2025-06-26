import renderGlobals from '#src/rendering/globals';

let renderedConfig = '';
export default function renderConfigGlobal(config) {
	// render config if it hasn't been rendered yet
	if (!renderedConfig) {
		renderedConfig = renderGlobals({ __KV_CONFIG__: config });
	}
	return renderedConfig;
}
