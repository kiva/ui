import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import numeralFilter from '#src/plugins/numeral-filter';
import ImpactStat from '#src/components/Portfolio/ImpactStats/ImpactStat';

const renderServerHtml = async props => {
	const app = createSSRApp({
		render: () => h(ImpactStat, {
			label: 'Lives touched',
			tooltip: 'The number of borrowers you\'ve lent to.',
			valueTestId: 'impact-lives-touched',
			...props,
		}),
	});
	app.config.globalProperties.$filters = { numeral: numeralFilter };
	return renderToString(app);
};

// Parses the markup the way a browser does, so invalid nesting is rearranged as it would be on the page
const parse = html => {
	const container = document.createElement('div');
	container.innerHTML = html;
	return container;
};

describe('ImpactStat server render', () => {
	it('keeps the loading text inside the value when parsed by a browser', async () => {
		const page = parse(await renderServerHtml({ loading: true }));
		const value = page.querySelector('[data-testid="impact-lives-touched"]');

		expect(value.querySelector('.kv-loading-text')).not.toBeNull();
	});

	it('keeps the formatted value inside the value when parsed by a browser', async () => {
		const page = parse(await renderServerHtml({ value: 284 }));

		expect(page.querySelector('[data-testid="impact-lives-touched"]').textContent.trim()).toBe('284');
	});
});
