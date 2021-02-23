import _fromPairs from 'lodash/fromPairs';

// regex to match numbers at the start of the ga cookie (e.g. 1231231.15135135135.1.1)
const startingNumbersRegex = /^[\d.]+/;
// regex to match parenthesis around a string (e.g. (value))
const trimParensRegex = /^\(+|\)+$/g;
// regex to match any comma, colon, or semicolon
const punctuationRegex = /[,:;]/g;

export default function parseGACookie(cookieStore) {
	const cookie = cookieStore.get('__utmz');
	// return an empty object if the cookie isn't present
	if (!cookie) {
		return {};
	}

	// parse the raw data from the GA cookie
	const pairs = cookie
		// remove numbers from beginning
		.replace(startingNumbersRegex, '')
		// split data pairs
		.split('|')
		// split key from value in each pair
		.map(pairString => pairString.split('='))
		// remove the parenthesis around each of the values
		.map(([key, value]) => [key, value && value.replace(trimParensRegex, '')]);

	// create an object from the array of pairs
	const data = _fromPairs(pairs);

	// return cleaned data
	return {
		campaign: data.utmccn && data.utmccn.replace(punctuationRegex, ''),
		campaignContent: data.utmcct && data.utmcct.replace(punctuationRegex, ''),
		gclid: data.utmgclid,
		medium: data.utmcmd,
		source: data.utmcsr,
	};
}
