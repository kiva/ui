// Replace all template variables in the given HTML template with the corresponding values from the data object.
export default function fillTemplate(template, data) {
	let html = template;
	Object.keys(data).forEach(key => {
		html = html.replace(`\${${key}}`, data[key]);
	});
	// TODO: minify html
	return html;
}
