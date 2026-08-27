import { render } from '@testing-library/vue';
import GoalInReviewGlobalReach from '#src/components/MyKiva/GoalInReview/GoalInReviewGlobalReach';
import { globalOptions } from '../../../../specUtils';

// KvSimpleMap (SVG world map) and KvPieChartV2 (SVG draw) are heavy and irrelevant to
// the copy under test; KvMaterialIcon is a trivial glyph. Stub all three.
vi.mock('@kiva/kv-components', () => ({
	KvSimpleMap: { name: 'KvSimpleMap', template: '<div data-testid="kv-map"></div>' },
	KvPieChartV2: { name: 'KvPieChartV2', template: '<div data-testid="kv-pie-chart"></div>' },
	KvMaterialIcon: { name: 'KvMaterialIcon', props: ['icon'], template: '<span></span>' },
}));

const country = (name, lat, long) => ({
	name,
	isoCode: name.slice(0, 2).toUpperCase(),
	geocode: { latitude: lat, longitude: long },
});
const sector = (name, loanCount) => ({ sector: { id: name, name }, loanCount });

const renderSlide = (props = {}) => render(GoalInReviewGlobalReach, {
	global: globalOptions,
	props: {
		countries: [country('Kenya', 0, 38)],
		sectors: [sector('Agriculture', 5)],
		...props,
	},
});

describe('GoalInReviewGlobalReach', () => {
	describe('map header pluralization', () => {
		it('uses the singular "border" for a single country', () => {
			const { getByText } = renderSlide({ countries: [country('Kenya', 0, 38)] });
			getByText('1 border.');
		});

		it('uses the plural "borders" for several countries', () => {
			const { getByText } = renderSlide({
				countries: [country('Kenya', 0, 38), country('Peru', -9, -75)],
			});
			getByText('2 borders.');
		});
	});

	describe('sectors header pluralization', () => {
		it('uses the singular "sector" for a single sector', () => {
			const { getByText } = renderSlide({ sectors: [sector('Agriculture', 5)] });
			getByText('1 sector');
		});

		it('uses the plural "sectors" for several sectors', () => {
			const { getByText } = renderSlide({
				sectors: [sector('Agriculture', 5), sector('Retail', 3)],
			});
			getByText('2 sectors');
		});
	});
});
