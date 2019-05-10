export default {
	methods: {
		lockScroll() {
			if (typeof window !== 'undefined') {
				document.body.classList.add('scroll-locked');
			}
		},
		unlockScroll() {
			if (typeof window !== 'undefined') {
				document.body.classList.remove('scroll-locked');
			}
		},
		lockScrollSmallOnly() {
			if (typeof window !== 'undefined') {
				document.body.classList.add('scroll-locked-small-only');
			}
		},
		unlockScrollSmallOnly() {
			if (typeof window !== 'undefined') {
				document.body.classList.remove('scroll-locked-small-only');
			}
		},
	},
};
