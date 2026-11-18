export const FUNDRAISER_LANDING_PAGE = '/lp/event-fundraiser';

const CONTENTFUL_BASE = 'https://images.ctfassets.net/j0p9a6ql0rn7';

const occasionImage = (assetId, hash, slug) => (
	`${CONTENTFUL_BASE}/${assetId}/${hash}/fundraiser-occasion-${slug}.jpg`
);

/**
 * Cards for the MyKiva fundraisers carousel, in display order.
 *
 * Images and copy mirror the occasion cards on /lp/event-fundraiser, which live in Contentful,
 * so a change there has to be repeated here.
 */
export const fundraiserOccasionCards = [
	{
		id: 'holiday',
		title: 'Holiday',
		description: 'Tis the season to give back',
		to: '/gf/configure?occasion=holiday',
		image: occasionImage('1t3jL0ZqFxm58c8vTYwwVg', 'b631ba09a911119ceba6f3d80cea7051', 'holiday'),
		imageAlt: 'A red heart ornament hanging on a lit holiday tree',
	},
	{
		id: 'wedding',
		title: 'Wedding',
		description: 'Share and celebrate your values',
		to: '/gf/configure?occasion=wedding',
		image: occasionImage('3LqvCfJbBOO4XUWC3GkUqx', '2f48810097f5ba53baf6a49848680941', 'wedding'),
		imageAlt: 'A couple embracing outdoors on a sunny day',
	},
	{
		id: 'birthday',
		title: 'Birthday',
		description: 'Make your birthday about something bigger',
		to: '/gf/configure?occasion=birthday',
		image: occasionImage('wlWGPBrYAmCtpHVaJEF1n', '888ecc1ebc3406ee022b263fe5fa997c', 'birthday'),
		imageAlt: 'A group of friends laughing together outdoors',
	},
	{
		id: 'competition',
		title: 'Competition',
		description: 'Pledge your race, walk, or trot for good',
		to: '/gf/configure?occasion=competition',
		image: occasionImage('6vwB70OK3vI0bjDHJdD64f', '829cfa1599f5d8ed52ea86e59104c745', 'competition'),
		imageAlt: 'A runner crossing a city marathon course',
	},
	{
		id: 'memorial',
		title: 'Memorial',
		description: 'Celebrate a life of giving with your community',
		to: '/gf/configure?occasion=memorial',
		image: occasionImage('1pPOFGfeOSqEg7UNhykP0y', 'bab77f9507800abd23ff8d10a34989dc', 'memorial'),
		imageAlt: 'A lit candle surrounded by flower petals',
	},
	{
		id: 'other',
		title: 'Other',
		description: 'Share and celebrate your values',
		to: '/gf/configure?occasion=other',
		image: occasionImage('2QdSrCyG09494w2kuXqUzF', 'd61ea311f05c622e277c723ddebe74f8', 'other'),
		imageAlt: 'An outdoor community market table under trees',
	},
];

export default fundraiserOccasionCards;
