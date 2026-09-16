import confetti from 'canvas-confetti';

export const showConfetti = () => {
	confetti({
		origin: {
			y: 0.2,
		},
		particleCount: 150,
		spread: 200,
		colors: ['#6AC395', '#223829', '#95D4B3'],
		disableForReducedMotion: true,
		// Above the design system's modal layer (z-modal = 1400) so bursts render
		// over modal overlays; kept below toast (1700) and tooltip (1800).
		zIndex: 1600,
	});
};
