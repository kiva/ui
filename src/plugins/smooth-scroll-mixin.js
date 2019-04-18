export default {
	methods: {
		smoothScrollTo({ yPosition, millisecondsToAnimate = 200 }) {
			const startingPosition = window.scrollY;
			const endTime = (new Date()).getTime() + millisecondsToAnimate;
			const yDifference = startingPosition - yPosition;

			const scroll = () => {
				const currentTime = (new Date()).getTime();

				const percentageDone = 1 - ((endTime - currentTime) / millisecondsToAnimate);
				const percentageToAnimate = Math.min(percentageDone, 1);
				const newScrollY = startingPosition - (percentageToAnimate * yDifference);
				window.scrollTo(0, newScrollY);

				if (currentTime < endTime) {
					window.requestAnimationFrame(scroll);
				}
			};

			window.requestAnimationFrame(scroll);
		},
	},
};
