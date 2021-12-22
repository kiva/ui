export default {
	methods: {
		lockScroll() {
			if (typeof window !== 'undefined') {
				document.body.classList.add('tw-overflow-hidden');
			}
		},
		unlockScroll() {
			if (typeof window !== 'undefined') {
				document.body.classList.remove('tw-overflow-hidden');
			}
		},
		lockScrollSmallOnly() {
			if (typeof window !== 'undefined') {
				document.body.classList.add('tw-overflow-hidden', 'md:tw-overflow-auto');
			}
		},
		unlockScrollSmallOnly() {
			if (typeof window !== 'undefined') {
				document.body.classList.remove('tw-overflow-hidden', 'md:tw-overflow-auto');
			}
		},
	},
};
