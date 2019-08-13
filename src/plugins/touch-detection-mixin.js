export default {
	data() {
		return {
			usingTouch: false,
		};
	},
	created() {
		if (window) {
			const self = this;
			window.addEventListener('touchstart', function onFirstTouch() {
				self.usingTouch = true;
				window.removeEventListener('touchstart', onFirstTouch);
			});
		}
	},
};
