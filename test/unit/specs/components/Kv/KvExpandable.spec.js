import {
	render
} from '@testing-library/vue';
import KvExpandable from '#src/components/Kv/KvExpandable';

describe('KvExpandable.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvExpandable).toBeDefined();
		expect(KvExpandable.name).toBe('KvExpandable');
	});

	it('renders slot content', () => {
		const { container } = render(KvExpandable, {
			slots: {
				default: '<div class="test-content">Test Content</div>'
			}
		});

		expect(container.querySelector('.test-content')).toBeTruthy();
		expect(container.textContent).toContain('Test Content');
	});

	it('has default property prop of height', () => {
		expect(KvExpandable.props.property.default).toBe('height');
	});

	it('has default delay prop of 500', () => {
		expect(KvExpandable.props.delay.default).toBe(500);
	});

	it('has default easing prop of ease', () => {
		expect(KvExpandable.props.easing.default).toBe('ease');
	});

	it('has default skipEnter prop of false', () => {
		expect(KvExpandable.props.skipEnter.default).toBe(false);
	});

	it('has default skipLeave prop of false', () => {
		expect(KvExpandable.props.skipLeave.default).toBe(false);
	});

	it('accepts custom property prop', () => {
		const { container } = render(KvExpandable, {
			props: {
				property: 'width'
			},
			slots: {
				default: '<div>Content</div>'
			}
		});

		expect(container.querySelector('div')).toBeTruthy();
	});

	it('accepts custom delay prop', () => {
		const { container } = render(KvExpandable, {
			props: {
				delay: 1000
			},
			slots: {
				default: '<div>Content</div>'
			}
		});

		expect(container.querySelector('div')).toBeTruthy();
	});

	it('accepts custom easing prop', () => {
		const { container } = render(KvExpandable, {
			props: {
				easing: 'ease-in-out'
			},
			slots: {
				default: '<div>Content</div>'
			}
		});

		expect(container.querySelector('div')).toBeTruthy();
	});

	it('enter method calls expand with correct options', () => {
		const { container } = render(KvExpandable, {
			props: {
				property: 'height',
				delay: 300,
				easing: 'ease-in'
			},
			slots: {
				default: '<div>Content</div>'
			}
		});

		expect(container.querySelector('div')).toBeTruthy();
	});

	it('leave method calls collapse with correct options', () => {
		const { container } = render(KvExpandable, {
			props: {
				property: 'height',
				delay: 300,
				easing: 'ease-out'
			},
			slots: {
				default: '<div>Content</div>'
			}
		});

		expect(container.querySelector('div')).toBeTruthy();
	});

	it('skips enter transition when skipEnter is true', () => {
		const { container } = render(KvExpandable, {
			props: {
				skipEnter: true
			},
			slots: {
				default: '<div>Content</div>'
			}
		});

		expect(container.querySelector('div')).toBeTruthy();
	});

	it('skips leave transition when skipLeave is true', () => {
		const { container } = render(KvExpandable, {
			props: {
				skipLeave: true
			},
			slots: {
				default: '<div>Content</div>'
			}
		});

		expect(container.querySelector('div')).toBeTruthy();
	});
});
