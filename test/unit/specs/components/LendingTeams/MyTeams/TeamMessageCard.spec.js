import { render, screen } from '@testing-library/vue';
import TeamMessageCard from '#src/components/LendingTeams/MyTeams/TeamMessageCard';
import { globalOptions } from '../../../../specUtils';

const mockMessage = (id, overrides = {}) => ({
	id: `${id}`,
	body: overrides.body || `This is message ${id}`,
	date: '2024-01-15T10:30:00Z',
	sender: {
		id: `sender-${id}`,
		name: `Sender ${id}`,
		publicId: `sender${id}`,
		imageUrl: `https://example.com/sender-${id}.jpg`,
		...overrides.sender,
	},
	team: {
		id: `team-${id}`,
		name: `Team ${id}`,
		teamPublicId: `team-${id}`,
		imageUrl: `https://example.com/team-${id}.jpg`,
		...overrides.team,
	},
	...overrides,
});

describe('TeamMessageCard', () => {
	it('renders sender name, team name, and date for each message', () => {
		render(TeamMessageCard, {
			props: {
				message: mockMessage(1),
			},
			global: globalOptions,
		});

		expect(screen.getByText('Sender 1')).toBeTruthy();
		expect(screen.getByText('Team 1')).toBeTruthy();
		expect(screen.getByText('This is message 1')).toBeTruthy();
	});

	it('converts message ID references to deep links', () => {
		const bodyWithRef = 'See message #12345 for details';
		const { container } = render(TeamMessageCard, {
			props: {
				message: mockMessage(1, { body: bodyWithRef }),
			},
			global: globalOptions,
		});

		const links = container.querySelectorAll('a[href*="msgID=12345"]');
		expect(links.length).toBeGreaterThan(0);
	});

	it('renders deep link to message in header', () => {
		const { container } = render(TeamMessageCard, {
			props: {
				message: mockMessage(1),
			},
			global: globalOptions,
		});

		const deepLink = container.querySelector('a[href*="msgID=1#msg_1"]');
		expect(deepLink).toBeTruthy();
		expect(deepLink.textContent).toContain('#1');
	});

	it('escapes HTML in body but does not convert escaped characters to deep links', () => {
		const bodyWithSpecialChars = 'This message has <script>alert("xss")</script> tags & other content';
		const { container } = render(TeamMessageCard, {
			props: {
				message: mockMessage(1, { body: bodyWithSpecialChars }),
			},
			global: globalOptions,
		});

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

	it('sender name links to lender profile', () => {
		const { container } = render(TeamMessageCard, {
			props: {
				message: mockMessage(1, {
					sender: {
						publicId: 'sender123',
						name: 'Test Sender',
					},
				}),
			},
			global: globalOptions,
		});

		const senderLink = container.querySelector('router-link[to="/lender/sender123"]');
		expect(senderLink).toBeTruthy();
		expect(senderLink.textContent).toBe('Test Sender');
	});
});
