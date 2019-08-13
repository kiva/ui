export default {
	data() {
		return {
			usingTouch: false,
		};
	},
	created() {
		if (window) {
			window.addEventListener('touchstart', function onFirstTouch() {
				this.usingTouch = true;
				window.removeEventListener('touchstart', onFirstTouch);
			});
		}
	},
};
