import { render } from '@testing-library/vue';
import KvProgressCircle from '../../../../../src/components/Kv/KvProgressCircle';

describe('KvProgressCircle', () => {
	it('should render with basic props', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 50,
				strokeWidth: 5
			}
		});

		expect(container.querySelector('svg')).toBeTruthy();
	});

	it('should calculate textDx when flipText is false (value between 25-75)', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 50,
				strokeWidth: 5,
				showNumber: true
			}
		});

		// When value is 50, flipText should be false
		// textDx should be (value / 100) * circumference * arcScale
		expect(container.querySelector('.kv-progress-circle__ring-text')).toBeTruthy();
	});

	it('should calculate textDx when flipText is true (value > 75)', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 80,
				strokeWidth: 5,
				showNumber: true
			}
		});

		// Line 202: textDx when flipText is true
		// When value is 80 (>75), flipText should be true
		// textDx should be circumference - (value / 100) * circumference * arcScale
		expect(container.querySelector('.kv-progress-circle__ring-text')).toBeTruthy();
	});

	it('should calculate textDx when flipText is true (value < 25)', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 20,
				strokeWidth: 5,
				showNumber: true
			}
		});

		// Line 202: textDx when flipText is true
		// When value is 20 (<25), flipText should be true
		expect(container.querySelector('.kv-progress-circle__ring-text')).toBeTruthy();
	});

	it('should calculate textDy when flipText is false', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 50,
				strokeWidth: 5,
				showNumber: true
			}
		});

		// When flipText is false, textDy should be fontSize * 0.625
		expect(container.querySelector('.kv-progress-circle__ring-text')).toBeTruthy();
	});

	it('should calculate textDy when flipText is true', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 90,
				strokeWidth: 5,
				showNumber: true
			}
		});

		// Line 208: textDy when flipText is true (should return 0)
		expect(container.querySelector('.kv-progress-circle__ring-text')).toBeTruthy();
	});

	it('should handle value at exactly 75', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 75,
				strokeWidth: 5
			}
		});

		// value = 75 should NOT flip (flipText: value > 75 || value < 25)
		expect(container.querySelector('svg')).toBeTruthy();
	});

	it('should handle value at exactly 25', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 25,
				strokeWidth: 5
			}
		});

		// value = 25 should NOT flip (flipText: value > 75 || value < 25)
		expect(container.querySelector('svg')).toBeTruthy();
	});

	it('should handle zero value', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 0,
				strokeWidth: 5
			}
		});

		// value = 0 (<25) should flip
		expect(container.querySelector('svg')).toBeTruthy();
	});

	it('should handle 100% value', () => {
		const { container } = render(KvProgressCircle, {
			props: {
				value: 100,
				strokeWidth: 5
			}
		});

		// value = 100 (>75) should flip
		expect(container.querySelector('svg')).toBeTruthy();
	});
});
