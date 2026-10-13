/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import LoanActionsMenu from '#src/components/BorrowerProfile/LoanActionsMenu';
import { globalOptions } from '../../../specUtils';

function mountMenu() {
	return mount(LoanActionsMenu, {
		attachTo: document.body,
		global: { ...globalOptions },
	});
}

const trigger = wrapper => wrapper.find('[data-testid="bp-loan-actions-menu-button"]');
const menu = wrapper => wrapper.find('[data-testid="bp-loan-actions-menu"]');
const items = wrapper => wrapper.findAll('[role="menuitem"]');

describe('LoanActionsMenu', () => {
	let wrapper;

	afterEach(() => {
		wrapper?.unmount();
	});

	it('starts closed with a labelled trigger that announces the menu state', () => {
		wrapper = mountMenu();

		expect(trigger(wrapper).element.tagName).toBe('BUTTON');
		expect(trigger(wrapper).attributes('aria-label')).toBe('More loan options');
		expect(trigger(wrapper).attributes('aria-haspopup')).toBe('menu');
		expect(trigger(wrapper).attributes('aria-expanded')).toBe('false');
		expect(trigger(wrapper).attributes('aria-controls')).toBe('bp-loan-actions-menu');
		expect(menu(wrapper).isVisible()).toBe(false);
	});

	it('opens on click with "Loan details" and "Share" items, and closes on a second click', async () => {
		wrapper = mountMenu();

		await trigger(wrapper).trigger('click');

		expect(trigger(wrapper).attributes('aria-expanded')).toBe('true');
		expect(menu(wrapper).isVisible()).toBe(true);
		expect(menu(wrapper).attributes('role')).toBe('menu');
		expect(items(wrapper).map(item => item.text())).toEqual(['Loan details', 'Share']);

		await trigger(wrapper).trigger('click');

		expect(trigger(wrapper).attributes('aria-expanded')).toBe('false');
		expect(menu(wrapper).isVisible()).toBe(false);
	});

	it('opens from the keyboard and focuses the first item on ArrowDown', async () => {
		wrapper = mountMenu();

		await trigger(wrapper).trigger('keydown', { key: 'ArrowDown' });

		expect(menu(wrapper).isVisible()).toBe(true);
		expect(document.activeElement).toBe(items(wrapper)[0].element);
	});

	it('opens from the keyboard and focuses the last item on ArrowUp', async () => {
		wrapper = mountMenu();

		await trigger(wrapper).trigger('keydown', { key: 'ArrowUp' });

		expect(menu(wrapper).isVisible()).toBe(true);
		expect(document.activeElement).toBe(items(wrapper)[1].element);
	});

	it('moves focus between items with the arrow keys and wraps', async () => {
		wrapper = mountMenu();
		await trigger(wrapper).trigger('keydown', { key: 'ArrowDown' });

		await items(wrapper)[0].trigger('keydown', { key: 'ArrowDown' });
		expect(document.activeElement).toBe(items(wrapper)[1].element);

		await items(wrapper)[1].trigger('keydown', { key: 'ArrowDown' });
		expect(document.activeElement).toBe(items(wrapper)[0].element);

		await items(wrapper)[0].trigger('keydown', { key: 'ArrowUp' });
		expect(document.activeElement).toBe(items(wrapper)[1].element);
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		wrapper = mountMenu();
		await trigger(wrapper).trigger('keydown', { key: 'ArrowDown' });

		await items(wrapper)[0].trigger('keydown', { key: 'Escape' });

		expect(menu(wrapper).isVisible()).toBe(false);
		expect(trigger(wrapper).attributes('aria-expanded')).toBe('false');
		expect(document.activeElement).toBe(trigger(wrapper).element);
	});

	it('closes on Tab without trapping focus', async () => {
		wrapper = mountMenu();
		await trigger(wrapper).trigger('keydown', { key: 'ArrowDown' });

		const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
		items(wrapper)[0].element.dispatchEvent(event);
		await wrapper.vm.$nextTick();

		expect(menu(wrapper).isVisible()).toBe(false);
		expect(event.defaultPrevented).toBe(false);
	});

	it('closes on a click outside', async () => {
		wrapper = mountMenu();
		await trigger(wrapper).trigger('click');

		document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await wrapper.vm.$nextTick();

		expect(menu(wrapper).isVisible()).toBe(false);
	});

	it('stays open on a click inside the menu surface', async () => {
		wrapper = mountMenu();
		await trigger(wrapper).trigger('click');

		menu(wrapper).element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await wrapper.vm.$nextTick();

		expect(menu(wrapper).isVisible()).toBe(true);
	});

	it.each([
		['loan-details', 0],
		['share', 1],
	])('emits %s when its item is chosen, then closes and refocuses the trigger', async (event, index) => {
		wrapper = mountMenu();
		await trigger(wrapper).trigger('click');

		await items(wrapper)[index].trigger('click');

		expect(wrapper.emitted(event)).toHaveLength(1);
		expect(menu(wrapper).isVisible()).toBe(false);
		expect(document.activeElement).toBe(trigger(wrapper).element);
	});

	it('removes its document listener on unmount', () => {
		const removeSpy = vi.spyOn(document, 'removeEventListener');
		wrapper = mountMenu();
		const handler = wrapper.vm.onDocumentClick;

		wrapper.unmount();
		wrapper = null;

		expect(removeSpy).toHaveBeenCalledWith('click', handler);
		removeSpy.mockRestore();
	});
});
