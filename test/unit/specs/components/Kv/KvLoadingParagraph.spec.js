import { render } from '@testing-library/vue';
import KvLoadingParagraph from '#src/components/Kv/KvLoadingParagraph';

describe('KvLoadingParagraph.vue', () => {
	it('renders a loading paragraph container', () => {
		const { container } = render(KvLoadingParagraph);

		const paragraph = container.querySelector('.loading-paragraph');
		expect(paragraph).toBeTruthy();
	});

	it('renders 4 loading lines by default', () => {
		const { container } = render(KvLoadingParagraph);

		const lines = container.querySelectorAll('.loading-paragraph__line');
		expect(lines.length).toBe(4);
	});

	it('renders custom number of lines when numLines prop is provided', () => {
		const { container } = render(KvLoadingParagraph, {
			props: {
				numLines: 3
			}
		});

		const lines = container.querySelectorAll('.loading-paragraph__line');
		expect(lines.length).toBe(3);
	});

	it('renders 7 lines when numLines is 7', () => {
		const { container } = render(KvLoadingParagraph, {
			props: {
				numLines: 7
			}
		});

		const lines = container.querySelectorAll('.loading-paragraph__line');
		expect(lines.length).toBe(7);
	});

	it('renders 1 line when numLines is 1', () => {
		const { container } = render(KvLoadingParagraph, {
			props: {
				numLines: 1
			}
		});

		const lines = container.querySelectorAll('.loading-paragraph__line');
		expect(lines.length).toBe(1);
	});

	it('renders multiple KvLoadingPlaceholder components', () => {
		const { container } = render(KvLoadingParagraph, {
			props: {
				numLines: 2
			}
		});

		// Each line should be a KvLoadingPlaceholder
		const lines = container.querySelectorAll('.loading-paragraph__line');
		expect(lines.length).toBe(2);
		lines.forEach(line => {
			expect(line).toBeTruthy();
		});
	});

	it('has a component name', () => {
		expect(KvLoadingParagraph.name).toBe('KvLoadingParagraph');
	});

	it('has a serverCacheKey function', () => {
		expect(typeof KvLoadingParagraph.serverCacheKey).toBe('function');
	});

	it('generates unique cache keys based on numLines prop', () => {
		const cacheKey1 = KvLoadingParagraph.serverCacheKey({ numLines: 3 });
		const cacheKey2 = KvLoadingParagraph.serverCacheKey({ numLines: 5 });

		// Different numLines should generate different cache keys (at least in prefix)
		expect(cacheKey1.split('-')[0]).toBe(cacheKey2.split('-')[0]); // Same component name
		expect(cacheKey1.split('-')[1]).not.toBe(cacheKey2.split('-')[1]); // Different numLines

		// Cache keys should contain the component name and numLines
		expect(cacheKey1).toContain('KvLoadingParagraph');
		expect(cacheKey1).toContain('3');
		expect(cacheKey2).toContain('5');
	});
});
