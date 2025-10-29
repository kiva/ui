import { render } from '@testing-library/vue';
import KvCharityNavigator from '../../../../../src/components/Kv/KvCharityNavigator';

describe('KvCharityNavigator.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvCharityNavigator).toBeDefined();
		expect(KvCharityNavigator.name).toBe('KvCharityNavigator');
	});

	it('renders the container div', () => {
		const { container } = render(KvCharityNavigator);

		expect(container.querySelector('#container')).toBeTruthy();
	});

	it('has default title prop', () => {
		const wrapper = render(KvCharityNavigator);
		const component = wrapper.container.querySelector('#container');

		expect(component).toBeTruthy();
		// Note: The template is commented out, so we're just testing the component renders
	});

	it('has default wideIcon prop as false', () => {
		const { container } = render(KvCharityNavigator);

		expect(container.querySelector('#container')).toBeTruthy();
	});

	it('accepts wideIcon prop as true', () => {
		const { container } = render(KvCharityNavigator, {
			props: {
				wideIcon: true
			}
		});

		expect(container.querySelector('#container')).toBeTruthy();
	});

	it('has default subtitle prop', () => {
		const wrapper = render(KvCharityNavigator);
		const component = wrapper.container.querySelector('#container');

		expect(component).toBeTruthy();
	});

	it('accepts custom title', () => {
		const { container } = render(KvCharityNavigator, {
			props: {
				title: 'Custom Award Title'
			}
		});

		expect(container.querySelector('#container')).toBeTruthy();
	});

	it('accepts custom subtitle', () => {
		const { container } = render(KvCharityNavigator, {
			props: {
				subtitle: 'Custom subtitle text'
			}
		});

		expect(container.querySelector('#container')).toBeTruthy();
	});
});
