/**
 * Focuses the element when focus has dropped to the page, as it does when the focused control is disabled. Focus the
 * viewer moved elsewhere is left alone.
 *
 * @param {HTMLElement|null|undefined} el
 */
export default function focusIfDropped(el) {
	const active = document.activeElement;
	if (!el || (active && active !== document.body)) {
		return;
	}
	el.focus();
}
