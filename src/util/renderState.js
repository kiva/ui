/* eslint-disable max-len */
import _map from 'lodash/map';
import serialize from 'serialize-javascript';

const isProd = process.env.NODE_ENV === 'production';
const autoRemove = '(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());';

/*
 * Based on the Vue Server Template Renderer context.renderState()
 * https://github.com/vuejs/vue/blob/master/src/server/template-renderer/index.js
 */
export default function renderState(states) {
	const stateStrings = _map(states, (value, key) => `window.${key} = ${serialize(value, { isJSON: true })};`);
	return `<script>${stateStrings.join('')}${isProd ? autoRemove : ''}</script>`;
}
