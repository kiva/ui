import { render, screen } from '@testing-library/vue';
import TeamCard from '#src/components/LendingTeams/MyTeams/TeamCard';
import { globalOptions } from '../../../../specUtils';

const mockTeam = {
	id: 1,
	name: 'Test Team',
	teamPublicId: 'test-team',
	imageUrl: 'https://example.com/team.jpg',
};

describe('TeamCard', () => {
	it('renders team name as a link', () => {
		render(TeamCard, {
			props: {
				team: mockTeam,
			},
			global: {
				...globalOptions,
				stubs: {
					KvMaterialIcon: { template: '<span></span>' },
					KvDropdown: { template: '<div><slot /></div>' },
				},
			},
		});

		const link = screen.getByText('Test Team');
		expect(link).toBeTruthy();
		expect(link.getAttribute('to')).toBe('/team/test-team');
	});

	it('renders dropdown menu with 4 action links', () => {
		const { container } = render(TeamCard, {
			props: {
				team: mockTeam,
			},
			global: {
				...globalOptions,
				stubs: {
					KvMaterialIcon: { template: '<span></span>' },
					KvDropdown: { template: '<div><slot /></div>' },
				},
			},
		});

		expect(screen.getByText('Jump to message board')).toBeTruthy();
		expect(screen.getByText('Go to overview')).toBeTruthy();
		expect(screen.getByText('Set as preferred team')).toBeTruthy();
		expect(screen.getByText('Quit team')).toBeTruthy();

		const links = container.querySelectorAll('a');
		expect(links.length).toBe(4);
	});
});
