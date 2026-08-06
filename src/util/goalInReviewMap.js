/** Centre used when no country has usable coordinates. */
export const DEFAULT_MAP_CENTER = { lat: 20, long: 10 };

const toRadians = degrees => (degrees * Math.PI) / 180;
const toDegrees = radians => (radians * 180) / Math.PI;

// 0 is a real latitude and longitude, so coordinates need a finite check rather
// than a truthiness one.
const getPoints = countries => (countries ?? [])
	.map(country => ({ lat: country?.geocode?.latitude, long: country?.geocode?.longitude }))
	.filter(point => Number.isFinite(point.lat) && Number.isFinite(point.long));

// Longitudes wrap at the antimeridian, so averaging Tonga (-175) with Fiji (177)
// arithmetically lands in Africa. Averaging them as unit vectors does not.
const getMeanLongitude = points => {
	const x = points.reduce((total, point) => total + Math.cos(toRadians(point.long)), 0);
	const y = points.reduce((total, point) => total + Math.sin(toRadians(point.long)), 0);
	return toDegrees(Math.atan2(y / points.length, x / points.length));
};

/**
 * Centres the slide 3 map on the countries the goal reached — the country itself
 * when there is only one, otherwise the average position of all of them.
 *
 * @param {Array} countries Countries with `geocode.latitude` / `geocode.longitude`.
 * @returns {{lat: number, long: number}} Map centre.
 */
export function getCountriesMapCenter(countries = []) {
	const points = getPoints(countries);
	if (!points.length) {
		return DEFAULT_MAP_CENTER;
	}

	return {
		lat: points.reduce((total, point) => total + point.lat, 0) / points.length,
		long: getMeanLongitude(points),
	};
}
