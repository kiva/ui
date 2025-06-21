/* eslint-disable no-throw-literal */
export default async function renderESI({
	cookieStore,
	context,
	fetch,
	kvAuth0,
}) {
	const { tagName } = context.esi;
	const tag = await import(`#src/esiTags/${tagName}.js`);
	const { default: renderTag } = tag ?? {};

	if (!renderTag) {
		throw { code: 404 };
	}

	return renderTag({
		cookieStore,
		context,
		fetch,
		kvAuth0,
	});
}
