// This function renders a <link> tag for a given file
export function renderPreloadLink(file) {
	if (file.endsWith('.js')) {
		return `<link rel="modulepreload" crossorigin href="${file}">`;
	}
	if (file.endsWith('.css')) {
		return `<link rel="stylesheet" href="${file}">`;
	}
	// TODO: handle other file types if needed
	return '';
}

// This function renders <link> tags for all files in the manifest for the given modules
export function renderPreloadLinks(modules, manifest = {}) {
	let links = '';
	const seen = new Set();
	modules.forEach(id => {
		const files = manifest[id];
		if (files) {
			files.forEach(file => {
				if (!seen.has(file)) {
					seen.add(file);
					links += renderPreloadLink(file);
				}
			});
		}
	});
	return links;
}
