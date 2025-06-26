// Render set cookies as document.cookie assignments in a <script> tag
export default function renderDocumentCookies(cookieStore) {
	const documentCookieLines = cookieStore.getSetCookies()
		.map(cookieString => `document.cookie='${cookieString}';`)
		.join('');
	if (!documentCookieLines) return '';
	return `<script>${documentCookieLines}</script>`;
}
