// Attach a touchstart event handler to the immediate children of the body.
// Useful for capturing the user tapping outside of a target element.
export function onBodyTouchstart(handler) {
	[...document.body.children].forEach(child => child.addEventListener('touchstart', handler));
}

// Remove a touchstart event handler from the immediate children of the body
export function offBodyTouchstart(handler) {
	[...document.body.children].forEach(child => child.removeEventListener('touchstart', handler));
}

// Returns true if the event target is any of the given elements or if the event target
// is contained by any of the given elements.
export function isTargetElement(event, elements) {
	const els = Array.isArray(elements) ? elements : [elements];
	for (let i = 0; i < els.length; i += 1) {
		if (els[i] === event.target || els[i].contains(event.target)) {
			return true;
		}
	}
	return false;
}
