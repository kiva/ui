/**
 * Parse/serialize cookie values that use query-string format (e.g. key=value&foo=bar).
 * Useful for any cookie that stores multiple flags or params in a single string.
 */

export function parseQueryStringCookie(str) {
	if (!str || typeof str !== 'string') return {};
	return Object.fromEntries(new URLSearchParams(str).entries());
}

export function buildQueryStringCookie(obj) {
	return new URLSearchParams(
		Object.entries(obj).filter(([, v]) => v != null && v !== '')
	).toString();
}
