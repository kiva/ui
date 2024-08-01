export default {
	directives: {
		/**
		 * Directive that detects a click
		 * outside element and fires a callback function
		 * Sample Use:
		 * <div v-click-outside="nameOfCustomEventToCall">Some content</div>
		 * mixins: [
		 *   clickOutside,
		 * ],
		*/
		clickOutside: {
			beforeMount(el, binding) {
				// eslint-disable-next-line no-param-reassign
				el.clickOutsideEvent = event => {
					// here I check that click was outside the el and his children
					if (!(el === event.target || el.contains(event.target))) {
						// and if it did, call method provided in attribute value
						binding.value(event, el);
					}
				};
				document.body.addEventListener('click', el.clickOutsideEvent);
			},
			unmounted(el) {
				document.body.removeEventListener('click', el.clickOutsideEvent);
			},
		}
	},
};
