import useBadgeModal from '#src/composables/useBadgeModal';
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
			const { getTierPositions } = useBadgeModal(badgeNoProgress);

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
				left: '-120%', top: '-15%', transform: 'rotate(180deg)', width: '134px'
			});
			expect(getLineStyle(0, 2)).toEqual({ left: '-90%', top: '-89%', width: '134px' });
			expect(getLineStyle(1, 0)).toEqual({
				left: '-128%', top: '42%', transform: 'rotate(-82deg)', width: '134px'
			});
			expect(getLineStyle(1, 2)).toEqual({
				left: '-120%', top: '-15%', transform: 'rotate(180deg)', width: '134px'
			});
			expect(getLineStyle(2, 0)).toEqual({
				left: '-128%', top: '56%', transform: 'rotate(-82deg)', width: '134px'
			});
			expect(getLineStyle(2, 1)).toEqual({
				left: '-128%', top: '42%', transform: 'rotate(-82deg)', width: '134px'
			});
		});

		it('should return expected styles for mobile variations', () => {
			window.innerWidth = 400;

			const { getLineStyle } = useBadgeModal(badgeNoProgress);

			expect(getLineStyle(0, 1)).toEqual({
				left: '-90%', top: '-125px', transform: 'rotate(-2deg)', width: '154px'
			});
			expect(getLineStyle(0, 2)).toEqual({
				left: '-164px', top: '-106%', transform: 'scaleX(-1) rotate(-69deg)', width: '215px'
			});
			expect(getLineStyle(1, 0)).toEqual({
				left: '11%', top: '-106%', transform: 'scaleX(-1)', width: '110px'
			});
			expect(getLineStyle(1, 2)).toEqual({
				left: '-90%', top: '-105%', transform: 'rotate(-2deg)', width: '112px'
			});
			expect(getLineStyle(2, 0)).toEqual({
				left: '16%', top: '-112%', transform: 'rotate(-72deg)', width: '215px'
			});
			expect(getLineStyle(2, 1)).toEqual({ top: '-125px', transform: 'scaleX(-1)', width: '146px' });
		});
	});
});
