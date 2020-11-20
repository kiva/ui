/* eslint-disable no-param-reassign */

function setInitialStyle(el, { property, delay, easing }) {
	el.style.overflow = 'hidden';
	el.style.transition = `${property} ${delay}ms ${easing}`;
}

function unsetStyles(el, { property }) {
	el.style[property] = null;
	el.style.overflow = null;
	el.style.transition = null;
}

export function expand(el, {
	easing = 'ease',
	delay = 500,
	done = () => {},
	from = 0,
	property = 'height',
}) {
	// set initial styles
	setInitialStyle(el, { property, delay, easing });

	// need to measure the property, so first set the value to 'auto' and unset display:none from v-show
	el.style[property] = 'auto';
	el.style.display = null;

	// measure the property
	const propValue = window.getComputedStyle(el).getPropertyValue(property);

	// set the property to the 'from' value
	el.style[property] = from;

	el.addEventListener('transitionend', function listener() {
		unsetStyles(el, { property });
		// finally, call the done callback after the transition
		done();
		el.removeEventListener('transitionend', listener, true);
	}, true);

	// hack to cause the browser to reflow
	void el.offsetWidth; // eslint-disable-line no-void
	// ...and set the property to the measured value on the next tick so it animates w/ css
	el.style[property] = propValue;
}

export function collapse(el, {
	easing = 'ease',
	delay = 500,
	done = () => {},
	to = 0,
	property = 'height',
}) {
	// set initial styles
	setInitialStyle(el, { property, delay, easing });

	// explicitly set the property value...
	el.style[property] = window.getComputedStyle(el).getPropertyValue(property);

	el.addEventListener('transitionend', function listener() {
		unsetStyles(el, { property });
		// finally, call the done callback after the transition
		done();
		el.removeEventListener('transitionend', listener, true);
	}, true);

	// hack to cause the browser to reflow
	void el.offsetWidth; // eslint-disable-line no-void
	// ...and set the property to the 'to' value on the next tick so it animates w/ css
	el.style[property] = to;
}
