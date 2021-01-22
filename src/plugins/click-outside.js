export default {
	directives: {
		/**
		 * Directive that detects a click
		 * outside element and fires a callback function
		 * Sample Use:
		 * <div v-click-outside="nameOfCustomEventToCall">Some content</div>
		 * TODO Register directive globally?
		*/
		clickOutside: {
			bind(el, binding, vnode) {
				// eslint-disable-next-line no-param-reassign
				el.clickOutsideEvent = event => {
					// here I check that click was outside the el and his children
					if (!(el === event.target || el.contains(event.target))) {
						// and if it did, call method provided in attribute value
						vnode.context[binding.expression](event);
					}
				};
				document.body.addEventListener('click', el.clickOutsideEvent);
			},
			unbind(el) {
				document.body.removeEventListener('click', el.clickOutsideEvent);
			},
		}
	},
};
