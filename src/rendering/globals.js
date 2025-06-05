/* eslint-disable max-len */
import serialize from 'serialize-javascript';

const isProd = process.env.NODE_ENV === 'production';
const autoRemove = '(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());';

/*
 * Based on the Vue Server Template Renderer context.renderState()
 * https://github.com/vuejs/vue/blob/2.6/src/server/template-renderer/index.js
 */
export default function renderGlobals(states) {
	const stateStrings = Object.keys(states).map(key => `window.${key} = ${serialize(states[key], { isJSON: true })};`);
	return `<script>${stateStrings.join('')}${isProd ? autoRemove : ''}</script>`;
}
