import confetti from 'canvas-confetti';
import { showConfetti } from '#src/util/animation/confettiUtils';

vi.mock('canvas-confetti', () => ({
	default: vi.fn(),
}));

describe('confettiUtils', () => {
	it('calls canvas-confetti with expected configuration', () => {
		showConfetti();

		expect(confetti).toHaveBeenCalledTimes(1);
		expect(confetti).toHaveBeenCalledWith({
			origin: {
				y: 0.2,
			},
			particleCount: 150,
			spread: 200,
			colors: ['#6AC395', '#223829', '#95D4B3'],
			disableForReducedMotion: true,
		});
	});
});
