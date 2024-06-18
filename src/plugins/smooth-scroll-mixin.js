export default {
	methods: {
		smoothScrollTo({ yPosition, millisecondsToAnimate = 200 }) {
			const startingPosition = window.scrollY;
			const endTime = (new Date()).getTime() + millisecondsToAnimate;
			const yDifference = startingPosition - yPosition;

			// use basic scrollTo instead of animation if request animation frame is undefined
			if (!window.requestAnimationFrame) {
				window.scrollTo(0, yPosition);
				return true;
			}

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
		scrollToSection(sectionId) {
			const elementToScrollTo = document.querySelector(sectionId);
			const topOfSectionToScrollTo = elementToScrollTo?.offsetTop ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		},
	},
};
