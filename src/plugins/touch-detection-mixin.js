export default {
	data() {
		return {
			usingTouch: false,
		};
	},
	created() {
		if (typeof window !== 'undefined') {
			const self = this;
			window.addEventListener('touchstart', function onFirstTouch() {
				self.usingTouch = true;
				window.removeEventListener('touchstart', onFirstTouch);
			});
		}
	},
};
