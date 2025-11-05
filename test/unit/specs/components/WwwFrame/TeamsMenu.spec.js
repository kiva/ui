import { render } from '@testing-library/vue';
import TeamsMenu from '#src/components/WwwFrame/Header/TeamsMenu';
import CookieStore from '#src/util/cookieStore';
import { MockKvAuth0 } from '#src/util/KvAuth0';

const user = {
	my: {
		teams: {
			totalCount: 0,
			values: [],
		},
	},
};

const userWithOneTeam = {
	my: {
		teams: {
			totalCount: 1,
			values: [
				{
					id: 1,
					team: {
						id: 1,
						name: 'Team 1',
						teamPublicId: 'team1',
					},
				},
			],
		},
	},
};

const userWithMultipleTeams = {
	my: {
		teams: {
			totalCount: 6,
			values: [
				{
					id: 1,
					team: {
						id: 1,
						name: 'Team 1',
						teamPublicId: 'team1',
					},
				},
				{
					id: 2,
					team: {
						id: 2,
						name: 'Team 2',
						teamPublicId: 'team2',
					},
				},
				{
					id: 3,
					team: {
						id: 3,
						name: 'Team 3',
						teamPublicId: 'team3',
					},
				},
				{
					id: 4,
					team: {
						id: 4,
						name: 'Team 4',
						teamPublicId: 'team4',
					},
				},
				{
					id: 5,
					team: {
						id: 5,
						name: 'Team 5',
						teamPublicId: 'team5',
					},
				},
				{
					id: 6,
					team: {
						id: 6,
						name: 'Team 6',
						teamPublicId: 'team6',
					},
				},
			],
		},
	},
};

function renderTeamsMenu(props) {
	return render(TeamsMenu, {
		props,
		directives: { kvTrackEvent: () => { } },
		provide: {
			apollo: {
				readFragment: () => { },
				query: () => Promise.resolve({}),
				readQuery: () => { },
			},
			cookieStore: new CookieStore(),
			kvAuth0: MockKvAuth0,
		},
		global: {
			stubs: ['router-link']
		},
	});
}

describe('TeamsMenu', () => {
	it('should show only Teams link', async () => {
		const props = {
			teams: user.my.teams,
		};
		const { queryByTestId } = renderTeamsMenu(props);

		const anchor = queryByTestId('header-lending-teams');
		expect(anchor.getAttribute('to')).toBe('/teams');
	});

	it('should show Teams Dropdown with one team option', async () => {
		const props = {
			teams: userWithOneTeam.my.teams,
		};
		const { queryByText } = renderTeamsMenu(props);

		const activity = queryByText("My Team's activity");
		const impact = queryByText("My Team's impact");

		const { teamPublicId } = props.teams.values[0].team;

		expect(activity.getAttribute('href')).toBe(`/team/${teamPublicId}`);
		expect(impact.getAttribute('href')).toBe(`/team/${teamPublicId}/impact`);
	});

	it('should show 3 teams', async () => {
		const limitedTeams = userWithMultipleTeams.my.teams.values.slice(0, 3);
		const props = {
			teams: {
				totalCount: limitedTeams.length,
				values: limitedTeams,
			},
		};
		const { queryByText } = renderTeamsMenu(props);

		props.teams.values.forEach(t => {
			const { teamPublicId } = t.team;
			expect(queryByText(t.team.name).getAttribute('href')).toBe(`/team/${teamPublicId}`);
		});
	});

	it('should only show 5 teams and a link to view all my teams', async () => {
		const props = {
			teams: userWithMultipleTeams.my.teams,
		};
		const { queryByText } = renderTeamsMenu(props);

		const limitedTeams = props.teams.values.slice(0, 5);

		limitedTeams.forEach(t => {
			const { teamPublicId } = t.team;
			expect(queryByText(t.team.name).getAttribute('href')).toBe(`/team/${teamPublicId}`);
		});

		const allMyTeams = queryByText('View all my teams');
		expect(allMyTeams.getAttribute('href')).toBe('/teams/my-teams');
	});
});
