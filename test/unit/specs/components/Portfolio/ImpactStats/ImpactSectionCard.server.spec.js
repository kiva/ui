import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import ImpactSectionCard from '#src/components/Portfolio/ImpactStats/ImpactSectionCard';

const renderServerHtml = async (props, slots) => {
	const app = createSSRApp({
		render: () => h(ImpactSectionCard, { title: 'Geographic Reach', ...props }, slots),
	});
	return renderToString(app);
};

// Parses the markup the way a browser does, so invalid nesting is rearranged as it would be on the page
const parse = html => {
	const container = document.createElement('div');
	container.innerHTML = html;
	return container;
};

describe('ImpactSectionCard server render', () => {
	it('renders the title, pill skeleton and loading slot', async () => {
		const page = parse(await renderServerHtml({ loading: true }, {
			pill: () => '7 of 32 countries',
			loading: () => h('div', { 'data-testid': 'skeleton' }),
		}));

		expect(page.querySelector('h3').textContent.trim()).toBe('Geographic Reach');
		expect(page.querySelector('[data-testid="skeleton"]')).not.toBeNull();
		expect(page.querySelector('[data-testid="impact-section-pill"] .kv-loading-text')).not.toBeNull();
		expect(page.textContent).not.toContain('We couldn\'t load');
	});

	it('labels the section with its title', async () => {
		const page = parse(await renderServerHtml({ loading: true }));
		const section = page.querySelector('section');

		expect(page.querySelector(`[id="${section.getAttribute('aria-labelledby')}"]`).tagName).toBe('H3');
	});

	it('keeps the subtitle loading text inside the subtitle when parsed by a browser', async () => {
		const page = parse(await renderServerHtml({ loading: true }, {
			subtitle: () => 'You lent to Rosa M on March 13, 2020',
		}));

		expect(page.querySelector('[data-testid="impact-section-subtitle"] .kv-loading-text')).not.toBeNull();
	});
});
