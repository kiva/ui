import { render, screen } from '@testing-library/vue';
import MyTeamsPage from '#src/pages/LendingTeams/MyTeamsPage';
import { globalOptions } from '../../../specUtils';

describe('MyTeamsPage', () => {
	it('renders the page header with correct title', () => {
		render(MyTeamsPage, {
			global: {
				...globalOptions,
				stubs: {
					WwwPage: { template: '<div><slot /></div>' },
					KvPageContainer: { template: '<div><slot /></div>' },
					KvGrid: { template: '<div><slot /></div>' },
					MyTeamMessagesList: { template: '<div data-testid="my-team-messages"></div>' },
					MyTeamsList: { template: '<div data-testid="my-teams-list"></div>' },
				},
			},
		});

		expect(screen.getByRole('heading', { name: 'My Teams' })).toBeTruthy();
	});

	it('renders MyTeamMessagesList and MyTeamsList components', () => {
		render(MyTeamsPage, {
			global: {
				...globalOptions,
				stubs: {
					WwwPage: { template: '<div><slot /></div>' },
					KvPageContainer: { template: '<div><slot /></div>' },
					KvGrid: { template: '<div><slot /></div>' },
					MyTeamMessagesList: { template: '<div data-testid="my-team-messages">Messages</div>' },
					MyTeamsList: { template: '<div data-testid="my-teams-list">Teams</div>' },
				},
			},
		});

		expect(screen.getByTestId('my-team-messages')).toBeTruthy();
		expect(screen.getByTestId('my-teams-list')).toBeTruthy();
	});
});
