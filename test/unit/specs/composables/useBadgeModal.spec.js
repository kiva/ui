import useBadgeModal,
{
	BADGE_SHAPE_OBLONG,
	BADGE_SHAPE_RECTANGLE,
	BADGE_SHAPE_ARCH,
	BADGE_SHAPE_OVAL,
	BADGE_SHAPE_CIRCLE,
} from '#src/composables/useBadgeModal';
import {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
} from '#src/composables/useBadgeData';
import LineLarge from '#src/assets/images/my-kiva/journey-line-large.svg';
import LineMedium from '#src/assets/images/my-kiva/journey-line-medium.svg';
import LineSmall from '#src/assets/images/my-kiva/journey-line-small.svg';
import { badgeNoProgress } from '../../fixtures/tieredLendingAchievementDataMock';

jest.mock('vue', () => ({
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

	describe('getLineComponent', () => {
		it('should return small line component for all desktop variations', () => {
			window.innerWidth = 1000;

			const { getLineComponent } = useBadgeModal(badgeNoProgress);

			expect(getLineComponent(0, 1)).toBe(LineSmall);
			expect(getLineComponent(0, 2)).toBe(LineSmall);
			expect(getLineComponent(1, 0)).toBe(LineSmall);
			expect(getLineComponent(1, 2)).toBe(LineSmall);
			expect(getLineComponent(2, 0)).toBe(LineSmall);
			expect(getLineComponent(2, 1)).toBe(LineSmall);
		});

		it('should return expected line component for mobile variations', () => {
			window.innerWidth = 400;

			const { getLineComponent } = useBadgeModal(badgeNoProgress);

			expect(getLineComponent(0, 1)).toBe(LineMedium);
			expect(getLineComponent(0, 2)).toBe(LineLarge);
			expect(getLineComponent(1, 0)).toBe(LineSmall);
			expect(getLineComponent(1, 2)).toBe(LineSmall);
			expect(getLineComponent(2, 0)).toBe(LineLarge);
			expect(getLineComponent(2, 1)).toBe(LineMedium);
		});
	});

	describe('getLineStyle', () => {
		it('should return expected styles for desktop variations', () => {
			window.innerWidth = 1000;

			const { getLineStyle } = useBadgeModal(badgeNoProgress);

			expect(getLineStyle(0, 1)).toEqual({
				left: '-114%', top: '-15%', transform: 'rotate(180deg)', width: '134px'
			});
			expect(getLineStyle(0, 2)).toEqual({ left: '-56%', top: '-95%', width: '134px' });
			expect(getLineStyle(1, 0)).toEqual({
				left: '-116%', top: '42%', transform: 'rotate(-82deg)', width: '134px'
			});
			expect(getLineStyle(1, 2)).toEqual({
				left: '-114%', top: '-15%', transform: 'rotate(180deg)', width: '134px'
			});
			expect(getLineStyle(2, 0)).toEqual({
				left: '-106%', top: '56%', transform: 'rotate(-82deg)', width: '134px'
			});
			expect(getLineStyle(2, 1)).toEqual({
				left: '-116%', top: '42%', transform: 'rotate(-82deg)', width: '134px'
			});
		});

		it('should return expected styles for mobile variations', () => {
			window.innerWidth = 400;

			const { getLineStyle } = useBadgeModal(badgeNoProgress);

			expect(getLineStyle(0, 1)).toEqual({
				left: '-8%', top: '-166px', transform: 'rotate(-2deg)', width: '154px'
			});
			expect(getLineStyle(0, 2)).toEqual({
				left: '-94px', top: '-120%', transform: 'scaleX(-1) rotate(-69deg)', width: '215px'
			});
			expect(getLineStyle(1, 0)).toEqual({
				left: '11%', top: '-108%', transform: 'scaleX(-1)', width: '124px'
			});
			expect(getLineStyle(1, 2)).toEqual({
				left: '-8%', top: '-111%', transform: 'rotate(-2deg)', width: '124px'
			});
			expect(getLineStyle(2, 0)).toEqual({
				left: '12%', top: '-121%', transform: 'rotate(-72deg)', width: '215px'
			});
			expect(getLineStyle(2, 1)).toEqual({ top: '-162px', transform: 'scaleX(-1)', width: '146px' });
		});
	});

	describe('getBadgeShape', () => {
		it('should return expected shape for womens-equality', () => {
			const { getBadgeShape } = useBadgeModal({ id: ID_WOMENS_EQUALITY });
			expect(getBadgeShape()).toEqual(BADGE_SHAPE_OBLONG);
		});

		it('should return expected shape for us-economic-equality', () => {
			const { getBadgeShape } = useBadgeModal({ id: ID_US_ECONOMIC_EQUALITY });
			expect(getBadgeShape()).toEqual(BADGE_SHAPE_RECTANGLE);
		});

		it('should return expected shape for climate-action', () => {
			const { getBadgeShape } = useBadgeModal({ id: ID_CLIMATE_ACTION });
			expect(getBadgeShape()).toEqual(BADGE_SHAPE_ARCH);
		});

		it('should return expected shape for refugee-equality', () => {
			const { getBadgeShape } = useBadgeModal({ id: ID_REFUGEE_EQUALITY });
			expect(getBadgeShape()).toEqual(BADGE_SHAPE_OVAL);
		});

		it('should return expected shape for basic-needs', () => {
			const { getBadgeShape } = useBadgeModal({ id: ID_BASIC_NEEDS });
			expect(getBadgeShape()).toEqual(BADGE_SHAPE_CIRCLE);
		});
	});

	describe('getNumberCircleStyles', () => {
		it('should return expected styles for womens-equality', () => {
			const { getNumberCircleStyles } = useBadgeModal({ id: ID_WOMENS_EQUALITY });
			expect(getNumberCircleStyles()).toEqual({ right: '20px', bottom: '6px' });
		});

		it('should return expected styles for us-economic-equality', () => {
			const { getNumberCircleStyles } = useBadgeModal({ id: ID_US_ECONOMIC_EQUALITY });
			expect(getNumberCircleStyles()).toEqual({ right: '-2px', bottom: '-2px' });
		});

		it('should return expected styles for climate-action', () => {
			const { getNumberCircleStyles } = useBadgeModal({ id: ID_CLIMATE_ACTION });
			expect(getNumberCircleStyles()).toEqual({ right: '-2px', bottom: '-2px' });
		});

		it('should return expected styles for refugee-equality', () => {
			const { getNumberCircleStyles } = useBadgeModal({ id: ID_REFUGEE_EQUALITY });
			expect(getNumberCircleStyles()).toEqual({ right: '10px', bottom: '18px' });
		});

		it('should return expected styles for basic-needs', () => {
			const { getNumberCircleStyles } = useBadgeModal({ id: ID_BASIC_NEEDS });
			expect(getNumberCircleStyles()).toEqual({ right: '10px', bottom: '10px' });
		});
	});
});
