import useBadgeModal,
{
	BADGE_SHAPE_OBLONG,
	BADGE_SHAPE_RECTANGLE,
	BADGE_SHAPE_ARCH,
	BADGE_SHAPE_OVAL,
	BADGE_SHAPE_CIRCLE,
	BADGE_SHAPE_EQUITY,
	getBadgeShape,
} from '../../../../src/composables/useBadgeModal';
import {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_EQUITY,
} from '../../../../src/composables/useBadgeData';
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

		it('should wrap to MIN_POSITION when randomPosition increment exceeds MAX_POSITION', () => {
			// Test ID that produces a scenario where tier index 2 would generate position 2,
			// same as the previous tier's position, triggering increment to 3 which wraps to 0
			const { getTierPositions } = useBadgeModal({ ...badgeNoProgress, id: 'test-0' });

			const results = getTierPositions();

			expect(results).toEqual([1, 2, 0, 1, 0, 2, 1]);
		});

		it('should return empty array when badge has no tiers', () => {
			const badgeWithNoTiers = {
				...badgeNoProgress,
				achievementData: {}
			};
			const { getTierPositions } = useBadgeModal(badgeWithNoTiers);

			const results = getTierPositions();

			expect(results).toEqual([]);
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

		it('should return expected shape for equity', () => {
			expect(getBadgeShape(ID_EQUITY)).toEqual(BADGE_SHAPE_EQUITY);
		});

		it('should return circle shape for unknown badge', () => {
			expect(getBadgeShape('unknown-badge-id')).toEqual(BADGE_SHAPE_CIRCLE);
		});
	});
});
