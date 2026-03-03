import { render, screen } from '@testing-library/vue';
import MyTeams from '#src/pages/LendingTeams/MyTeams/MyTeams';
import { globalOptions } from '../../../../specUtils';

describe('MyTeams', () => {
	it('renders the page header with correct title', () => {
		render(MyTeams, {
			global: {
				...globalOptions,
				stubs: {
					WwwPage: { template: '<div><slot /></div>' },
					KvPageContainer: { template: '<div><slot /></div>' },
					KvGrid: { template: '<div><slot /></div>' },
					MyTeamMessages: { template: '<div data-testid="my-team-messages"></div>' },
					MyTeamsList: { template: '<div data-testid="my-teams-list"></div>' },
				},
			},
		});

		expect(screen.getByRole('heading', { name: 'My Teams' })).toBeTruthy();
	});

	it('renders MyTeamMessages and MyTeamsList components', () => {
		render(MyTeams, {
			global: {
				...globalOptions,
				stubs: {
					WwwPage: { template: '<div><slot /></div>' },
					KvPageContainer: { template: '<div><slot /></div>' },
					KvGrid: { template: '<div><slot /></div>' },
					MyTeamMessages: { template: '<div data-testid="my-team-messages">Messages</div>' },
					MyTeamsList: { template: '<div data-testid="my-teams-list">Teams</div>' },
				},
			},
		});

		expect(screen.getByTestId('my-team-messages')).toBeTruthy();
		expect(screen.getByTestId('my-teams-list')).toBeTruthy();
	});
});
