import { render } from '@testing-library/vue';
import apolloPlugin from '#src/plugins/apollo-plugin';
import AutolendingSettingsPage from '#src/pages/Autolending/AutolendingSettingsPage';
import { globalOptions, routerLinkStub } from '../../../specUtils';

const message = 'Your auto-lending is currently managed by Kiva. To make changes, please contact support.';

const renderPage = autolendProfile => {
	const apollo = {
		...globalOptions.provide.apollo,
		readQuery: () => ({
			autolending: {
				id: 0,
				profileChanged: false,
				currentProfile: { id: 0, isEnabled: true },
			},
			my: { id: 1, autolendProfile },
		}),
	};
	return render(AutolendingSettingsPage, {
		global: {
			...globalOptions,
			plugins: [apolloPlugin],
			provide: { ...globalOptions.provide, apollo },
			stubs: {
				RouterLink: routerLinkStub,
				AutolendingStatus: { template: '<div data-test="status"></div>' },
				AutolendingWhen: { template: '<div data-test="when"></div>' },
				AutolendingWho: { template: '<div data-test="who"></div>' },
			},
		},
	});
};

const settingsShown = container => ['status', 'when', 'who']
	.map(name => container.querySelector(`[data-test="${name}"]`) !== null);

describe('AutolendingSettingsPage', () => {
	it('shows the managed-by-Kiva message to a lender with a saved search', () => {
		const { container } = renderPage({ id: 1, savedSearch: { id: 'abc' } });

		expect(container.textContent.replace(/\s+/g, ' ')).toContain(message);
		expect(container.querySelector('router-link[to="/help/contact-us"]').textContent.trim())
			.toBe('contact support');
		expect(settingsShown(container)).toEqual([false, false, false]);
	});

	it.each([
		['a Kiva Chooses lender', {
			id: 1, kivaChooses: true, loanSearchCriteria: null, savedSearch: null,
		}],
		['a lender with criteria', {
			id: 1, kivaChooses: false, loanSearchCriteria: { queryString: null }, savedSearch: null,
		}],
		['a lender with no criteria and Kiva Chooses off', {
			id: 1, kivaChooses: false, loanSearchCriteria: null, savedSearch: null,
		}],
		['a lender who never set up auto-lending', null],
	])('shows the settings to %s', (_, autolendProfile) => {
		const { container } = renderPage(autolendProfile);

		expect(settingsShown(container)).toEqual([true, true, true]);
		expect(container.textContent).not.toContain('managed by Kiva');
	});
});
