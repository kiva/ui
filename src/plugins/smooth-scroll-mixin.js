export default {
	methods: {
		smoothScrollTo({ yPosition, millisecondsToAnimate = 250, stops }) {
			const startingPosition = window.scrollY;
			const endTime = (new Date()).getTime() + millisecondsToAnimate;
			const numberOfStops = stops || Math.ceil(millisecondsToAnimate / 2);
			const yDifference = startingPosition - yPosition;

			let animationComplete = false;

			for (let i = 0; i < numberOfStops; i += 1) {
				// eslint-disable-next-line no-loop-func
				setTimeout(() => {
					if (animationComplete) {
						return;
					}

					const currentTime = (new Date()).getTime();

					const isOverTime = currentTime > endTime;
					const isLastIteration = i === (numberOfStops - 1);
					if (isOverTime || isLastIteration) {
						animationComplete = true;
						window.scrollTo(0, yPosition);
						return;
					}

					const percentageDone = 1 - ((endTime - currentTime) / millisecondsToAnimate);
					const newScrollY = startingPosition - (percentageDone * yDifference);

					window.scrollTo(0, newScrollY);
				}, (i / (numberOfStops - 1)) * millisecondsToAnimate);
			}
		},
	},
};
