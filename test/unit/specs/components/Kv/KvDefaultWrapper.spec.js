import { render } from '@testing-library/vue';
import KvDefaultWrapper from '../../../../../src/components/Kv/KvDefaultWrapper';
import { KvPageContainer } from '@kiva/kv-components';

describe('KvDefaultWrapper.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvDefaultWrapper).toBeDefined();
		expect(KvDefaultWrapper.name).toBe('KvDefaultWrapper');
	});

	it('renders KvPageContainer component', () => {
		const { container } = render(KvDefaultWrapper, {
			global: {
				stubs: {
					KvPageContainer: {
						template: '<div class="kv-page-container"><slot /></div>'
					}
				}
			}
		});

		expect(container.querySelector('.kv-page-container')).toBeTruthy();
	});

	it('renders slot content', () => {
		const slotContent = '<p>Page content here</p>';
		const { container } = render(KvDefaultWrapper, {
			slots: {
				default: slotContent
			},
			global: {
				stubs: {
					KvPageContainer: {
						template: '<div class="kv-page-container"><slot /></div>'
					}
				}
			}
		});

		expect(container.textContent).toContain('Page content here');
	});

	it('applies Tailwind padding classes', () => {
		const { container } = render(KvDefaultWrapper, {
			global: {
				stubs: {
					KvPageContainer: {
						template: '<div class="kv-page-container" :class="$attrs.class"><slot /></div>'
					}
				}
			}
		});

		const pageContainer = container.querySelector('.kv-page-container');
		const classes = pageContainer.className;

		// Check for padding classes
		expect(classes).toContain('tw-pt-');
		expect(classes).toContain('tw-pb-');
	});

	it('renders multiple children in slot', () => {
		const { container } = render(KvDefaultWrapper, {
			slots: {
				default: `
					<h1>Title</h1>
					<p>Paragraph</p>
					<button>Button</button>
				`
			},
			global: {
				stubs: {
					KvPageContainer: {
						template: '<div class="kv-page-container"><slot /></div>'
					}
				}
			}
		});

		expect(container.querySelector('h1')).toBeTruthy();
		expect(container.querySelector('p')).toBeTruthy();
		expect(container.querySelector('button')).toBeTruthy();
	});

	it('uses KvPageContainer from kv-components', () => {
		expect(KvDefaultWrapper.components.KvPageContainer).toBe(KvPageContainer);
	});
});
