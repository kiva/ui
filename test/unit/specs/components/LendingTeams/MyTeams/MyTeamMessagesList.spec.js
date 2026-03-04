import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import MyTeamMessagesList from '#src/components/LendingTeams/MyTeams/MyTeamMessagesList';
import { globalOptions } from '../../../../specUtils';

const mockMessage = (id, overrides = {}) => ({
	id: `${id}`,
	body: overrides.body || `This is message ${id}`,
	date: '2024-01-15T10:30:00Z',
	sender: {
		id: `sender-${id}`,
		name: `Sender ${id}`,
		publicId: `sender${id}`,
		image: {
			id: `sender-img-${id}`,
			url: `https://example.com/sender-${id}.jpg`,
		},
		...overrides.sender,
	},
	team: {
		id: `team-${id}`,
		name: `Team ${id}`,
		teamPublicId: `team-${id}`,
		image: {
			id: `team-img-${id}`,
			url: `https://example.com/team-${id}.jpg`,
		},
		...overrides.team,
	},
	...overrides,
});

const mockMessagesResponse = (totalCount, count, overrides = []) => ({
	data: {
		my: {
			id: '123',
			teamMessages: {
				totalCount,
				values: Array.from({ length: count }, (_, i) => mockMessage(i + 1, overrides[i] || {})),
			},
		},
	},
});

describe('MyTeamMessagesList', () => {
	it('shows loading skeletons initially', () => {
		const { container } = render(MyTeamMessagesList, {
			global: {
				...globalOptions,
				stubs: {
					KvButton: { template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div class="skeleton"></div>' },
					TeamMessageCard: { template: '<div></div>' },
				},
			},
		});

		const skeletons = container.querySelectorAll('.skeleton');
		expect(skeletons.length).toBeGreaterThan(0);
	});

	it('shows empty state when no messages', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(0, 0)));

		render(MyTeamMessagesList, {
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
					TeamMessageCard: { template: '<div></div>' },
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('No team messages yet.')).toBeTruthy();
		});
	});

	it('renders messages without "Show More Messages" button when count is below threshold', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(5, 5)));

		render(MyTeamMessagesList, {
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
					TeamMessageCard: { template: '<div></div>' },
				},
			},
		});

		await waitFor(() => {
			expect(screen.queryByText('Show More Messages')).toBeFalsy();
		});
	});

	it('shows "Show More Messages" button when count exceeds displayed items', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(25, 20)));

		render(MyTeamMessagesList, {
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
					TeamMessageCard: { template: '<div></div>' },
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('Show More Messages')).toBeTruthy();
		});
	});

	it('loads more messages when "Show More Messages" button is clicked', async () => {
		const user = userEvent.setup();
		let callCount = 0;
		const mockQuery = vi.fn(() => {
			callCount += 1;
			if (callCount === 1) {
				return Promise.resolve(mockMessagesResponse(25, 20));
			}
			return Promise.resolve({
				data: {
					my: {
						id: '123',
						teamMessages: {
							totalCount: 25,
							values: Array.from({ length: 5 }, (_, i) => mockMessage(21 + i)),
						},
					},
				},
			});
		});

		render(MyTeamMessagesList, {
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
					TeamMessageCard: { template: '<div></div>' },
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('Show More Messages')).toBeTruthy();
		});

		const moreButton = screen.getByText('Show More Messages');
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
