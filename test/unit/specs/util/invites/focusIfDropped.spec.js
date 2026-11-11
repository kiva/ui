import focusIfDropped from '#src/util/invites/focusIfDropped';

describe('focusIfDropped', () => {
	let target;
	let other;

	beforeEach(() => {
		target = document.createElement('input');
		other = document.createElement('input');
		document.body.append(target, other);
	});

	afterEach(() => {
		target.remove();
		other.remove();
	});

	it('focuses the element when focus is on the page', () => {
		document.activeElement?.blur();
		expect(document.activeElement).toBe(document.body);
		focusIfDropped(target);
		expect(document.activeElement).toBe(target);
	});

	it('leaves focus the viewer moved elsewhere', () => {
		other.focus();
		focusIfDropped(target);
		expect(document.activeElement).toBe(other);
	});

	it.each([null, undefined])('does nothing without an element (%s)', el => {
		document.activeElement?.blur();
		expect(() => focusIfDropped(el)).not.toThrow();
		expect(document.activeElement).toBe(document.body);
	});
});
