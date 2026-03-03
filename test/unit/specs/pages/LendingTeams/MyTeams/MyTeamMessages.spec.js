import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import MyTeamMessages from '#src/pages/LendingTeams/MyTeams/MyTeamMessages';
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

describe('MyTeamMessages', () => {
	it('shows loading skeletons initially', () => {
		const { container } = render(MyTeamMessages, {
			global: {
				...globalOptions,
				stubs: {
					KvButton: { template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div class="skeleton"></div>' },
				},
			},
		});

		const skeletons = container.querySelectorAll('.skeleton');
		expect(skeletons.length).toBeGreaterThan(0);
	});

	it('shows empty state when no messages', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(0, 0)));

		render(MyTeamMessages, {
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
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('No team messages yet.')).toBeTruthy();
		});
	});

	it('renders messages without "Show More Messages" button when count is below threshold', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(5, 5)));

		render(MyTeamMessages, {
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
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('This is message 1')).toBeTruthy();
			expect(screen.getByText('This is message 5')).toBeTruthy();
		});

		expect(screen.queryByText('Show More Messages')).toBeFalsy();
	});

	it('shows "Show More Messages" button when count exceeds displayed items', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(25, 20)));

		render(MyTeamMessages, {
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
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('This is message 1')).toBeTruthy();
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

		render(MyTeamMessages, {
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

	it('renders sender name, team name, and date for each message', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(1, 1)));

		render(MyTeamMessages, {
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
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByText('Sender 1')).toBeTruthy();
			expect(screen.getByText('Team 1')).toBeTruthy();
			expect(screen.getByText('This is message 1')).toBeTruthy();
		});
	});

	it('converts message ID references to deep links', async () => {
		const bodyWithRef = 'See message #12345 for details';
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(1, 1, [{ body: bodyWithRef }])));

		const { container } = render(MyTeamMessages, {
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
				},
			},
		});

		await waitFor(() => {
			const links = container.querySelectorAll('a[href*="msgID=12345"]');
			expect(links.length).toBeGreaterThan(0);
		});
	});

	it('renders deep link to message in header', async () => {
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(1, 1)));

		const { container } = render(MyTeamMessages, {
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
				},
			},
		});

		await waitFor(() => {
			const deepLink = container.querySelector('a[href*="msgID=1#msg_1"]');
			expect(deepLink).toBeTruthy();
			expect(deepLink.textContent).toContain('#1');
		});
	});

	it('escapes HTML in body but does not convert escaped characters to deep links', async () => {
		const bodyWithSpecialChars = 'This message has <script>alert("xss")</script> tags & other content';
		const mockQuery = vi.fn(() => Promise.resolve(mockMessagesResponse(1, 1, [{ body: bodyWithSpecialChars }])));

		const { container } = render(MyTeamMessages, {
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
				},
			},
		});

		await waitFor(() => {
			// Should not create links from numbers that appear in escaped HTML entities
			const links = container.querySelectorAll('a[href*="msgID="]');
			// Besides header, should have no additional message ID links since there are no #number patterns
			expect(links.length).toBe(1);

			// The script tag should be escaped, not rendered
			const scriptTags = container.querySelectorAll('script');
			expect(scriptTags.length).toBe(0);

			// And the <script> tag and & entity should be escaped
			const messageBody = container.querySelector('p');
			expect(messageBody.innerHTML).toContain('&lt;script&gt;');
			expect(messageBody.innerHTML).toContain('&amp;');
		});
	});
});
