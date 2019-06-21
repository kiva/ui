export default {
	methods: {
		categoryRowArrowsVisible() {
			/*
			We are using the lack of CSS hover support to gate the visibility of the arrows
			*/
			if (typeof window === 'undefined' || typeof document === 'undefined') {
				return true;
			}
			const rightArrow = document.querySelector('.arrow.right-arrow');
			if (!rightArrow) {
				return true;
			}
			return window.getComputedStyle(rightArrow).display !== 'none';
		},
	},
};
