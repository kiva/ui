import useBadgeModal,
{
	BADGE_SHAPE_OBLONG,
	BADGE_SHAPE_RECTANGLE,
	BADGE_SHAPE_ARCH,
	BADGE_SHAPE_OVAL,
	BADGE_SHAPE_CIRCLE,
	getBadgeShape,
} from '#src/composables/useBadgeModal';
import {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
} from '#src/composables/useBadgeData';
import { badgeNoProgress } from '../../fixtures/tieredLendingAchievementDataMock';

vi.mock('vue', () => ({
	createElementVNode: () => {},
	onBeforeMount: callback => { callback(); },
	onBeforeUnmount: () => { },
	ref: value => ({ value })
}));

describe('useBadgeModal.js', () => {
	describe('getTierPositions', () => {
		it('should return expected positions', () => {
			const { getTierPositions } = useBadgeModal({ ...badgeNoProgress, id: 'womens-equality' });

			const results = getTierPositions();

			expect(results).toEqual([1, 2, 0, 2, 0, 1, 2]);
		});

		it('should return expected positions including last to middle position', () => {
			const { getTierPositions } = useBadgeModal({ ...badgeNoProgress, id: 'test-badge' });

			const results = getTierPositions();

			expect(results).toEqual([2, 0, 1, 2, 1, 2, 0]);
		});

		it('should return expected positions including middle to first position', () => {
			const { getTierPositions } = useBadgeModal({ ...badgeNoProgress, id: 'zxc-zxc' });

			const results = getTierPositions();

			expect(results).toEqual([2, 0, 1, 0, 1, 0, 1]);
		});
	});

	describe('getBadgeShape', () => {
		it('should return expected shape for womens-equality', () => {
			expect(getBadgeShape(ID_WOMENS_EQUALITY)).toEqual(BADGE_SHAPE_OBLONG);
		});

		it('should return expected shape for us-economic-equality', () => {
			expect(getBadgeShape(ID_US_ECONOMIC_EQUALITY)).toEqual(BADGE_SHAPE_RECTANGLE);
		});

		it('should return expected shape for climate-action', () => {
			expect(getBadgeShape(ID_CLIMATE_ACTION)).toEqual(BADGE_SHAPE_ARCH);
		});

		it('should return expected shape for refugee-equality', () => {
			expect(getBadgeShape(ID_REFUGEE_EQUALITY)).toEqual(BADGE_SHAPE_OVAL);
		});

		it('should return expected shape for basic-needs', () => {
			expect(getBadgeShape(ID_BASIC_NEEDS)).toEqual(BADGE_SHAPE_CIRCLE);
		});
	});
});
