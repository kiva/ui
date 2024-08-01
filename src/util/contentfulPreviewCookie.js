// Contentful Preview Functionality
// Create or delete cookie value if preview query parameter exists on route
// This cookie value is read by apollo in src/api/ContentfulPreviewLink.js

export function contentfulPreviewCookie({ route, cookieStore }) {
	const isPreview = route?.query?.preview;
	if (isPreview && isPreview === 'true') {
		cookieStore.set('contentfulPreview', 'true');
	} else {
		cookieStore.remove('contentfulPreview');
	}
}
