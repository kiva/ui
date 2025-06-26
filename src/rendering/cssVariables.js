// Render CSS variables as a <style> tag in the document head
export default function renderCssVariables(cssVariables, prefix = '') {
	const beginning = prefix ? `--${prefix}-` : '--';
	const properties = Object.entries(cssVariables ?? {})
		.map(([key, value]) => `${beginning}${key}:${value};`)
		.join('');
	if (!properties) return '';
	return `<style>:root{${properties}}</style>`;
}
