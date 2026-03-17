import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import MyTeamsList from '#src/components/LendingTeams/MyTeams/MyTeamsList';
import { globalOptions } from '../../../../specUtils';

const mockTeam = (id, overrides = {}) => ({
	id,
	team: {
		id,
		name: `Team ${id}`,
		teamPublicId: `team-${id}`,
		image: {
			id: `img-${id}`,
			url: `https://example.com/team-${id}.jpg`,
		},
		...overrides.team,
	},
	...overrides,
});

const mockTeamsResponse = (totalCount, count) => ({
	data: {
		my: {
			id: '123',
			teams: {
				totalCount,
				values: Array.from({ length: count }, (_, i) => mockTeam(i + 1)),
			},
		},
	},
});

describe('MyTeamsList', () => {
	it('shows loading skeletons initially', () => {
		const { container } = render(MyTeamsList, {
			global: {
				...globalOptions,
				stubs: {
					KvButton: { template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div class="skeleton"></div>' },
					TeamCard: { template: '<div></div>' },
				},
			},
		});

		const skeletons = container.querySelectorAll('.skeleton');
		expect(skeletons.length).toBeGreaterThan(0);
	});

	it('shows empty state when no teams', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockTeamsResponse(0, 0)));

		render(MyTeamsList, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: {
						...globalOptions.provide.apollo,
						query: mockQuery,
					},
				},
				stubs: {
					KvButton: { template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div></div>' },
					TeamCard: { template: '<div></div>' },
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('You haven\'t joined any teams yet.')).toBeTruthy();
			expect(screen.getByText('Browse Teams')).toBeTruthy();
		});
	});

	it('renders teams without "More Teams" button when count is below threshold', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockTeamsResponse(5, 5)));

		render(MyTeamsList, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: {
						...globalOptions.provide.apollo,
						query: mockQuery,
					},
				},
				stubs: {
					KvButton: { template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div></div>' },
					TeamCard: { template: '<div><slot /></div>' },
				},
			},
		});

		await waitFor(() => {
			expect(mockQuery).toHaveBeenCalled();
		});

		expect(screen.queryByText('More Teams')).toBeFalsy();
	});

	it('shows "More Teams" button when count exceeds displayed items', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockTeamsResponse(25, 20)));

		render(MyTeamsList, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: {
						...globalOptions.provide.apollo,
						query: mockQuery,
					},
				},
				stubs: {
					KvButton: { template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div></div>' },
					TeamCard: { template: '<div></div>' },
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('More Teams')).toBeTruthy();
		});
	});

	it('loads more teams when "More Teams" button is clicked', async () => {
		const user = userEvent.setup();
		let callCount = 0;
		const mockQuery = vi.fn(() => {
			callCount += 1;
			if (callCount === 1) {
				return Promise.resolve(mockTeamsResponse(25, 20));
			}
			return Promise.resolve({
				data: {
					my: {
						id: '123',
						teams: {
							totalCount: 25,
							values: Array.from({ length: 5 }, (_, i) => mockTeam(21 + i)),
						},
					},
				},
			});
		});

		render(MyTeamsList, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: {
						...globalOptions.provide.apollo,
						query: mockQuery,
					},
				},
				stubs: {
					KvButton: { template: '<button @click="$attrs.onClick"><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div></div>' },
					TeamCard: { template: '<div></div>' },
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('More Teams')).toBeTruthy();
		});

		const moreButton = screen.getByText('More Teams');
		await user.click(moreButton);

		await waitFor(() => {
			expect(mockQuery).toHaveBeenCalledTimes(2);
			expect(mockQuery).toHaveBeenNthCalledWith(2, expect.objectContaining({
				variables: expect.objectContaining({
					offset: 20,
					limit: 20,
				}),
			}));
		});
	});
});
