import { render, waitFor } from '@testing-library/vue';
import SupportedByLenders from '#src/components/BorrowerProfile/SupportedByLenders';

const participants = {
	values: [
		{
			latestSharePurchaseDate: '2023-11-08T02:32:20Z',
			lender: {
				name: 'Joy',
				image: {
					url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				},
			},
			shareAmount: '25.00',
			__typename: 'LendingAction',
		},
		{
			latestSharePurchaseDate: '2023-11-08T02:32:20Z',
			lender: {
				name: 'Joy',
				image: {
					url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				},
			},
			shareAmount: '25.00',
			__typename: 'LendingAction',
		},
		{
			latestSharePurchaseDate: '2023-11-08T02:32:20Z',
			lender: {
				name: 'Joy',
				image: {
					url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				},
			},
			shareAmount: '25.00',
			__typename: 'LendingAction',
		},
		{
			latestSharePurchaseDate: '2023-11-08T02:32:20Z',
			lender: {
				name: 'Joy',
				image: {
					url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				},
			},
			shareAmount: '25.00',
			__typename: 'LendingAction',
		},
		{
			latestSharePurchaseDate: '2023-11-08T02:32:20Z',
			lender: {
				name: 'Joy',
				image: {
					url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				},
			},
			shareAmount: '25.00',
			__typename: 'LendingAction',
		},
		{
			latestSharePurchaseDate: '2023-11-08T02:32:20Z',
			lender: {
				name: 'Joy',
				image: {
					url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				},
			},
			shareAmount: '25.00',
			__typename: 'LendingAction',
		},
	],
};

describe('SupportedByLenders', () => {
	it('should display 5 participants photos at maximum', async () => {
		const props = {
			participants,
		};

		const numberOfParticipants = props.participants.values.length;

		const { getByText, findAllByText } = render(SupportedByLenders, {
			props,
		});

		const images = await waitFor(() => findAllByText('J', { exact: false }));
		expect(images.length).toEqual(numberOfParticipants > 5 ? 5 : numberOfParticipants);

		getByText(`Supported by ${numberOfParticipants} people`);
	});

	it('should handle challenge mode with single member', () => {
		const { getByText } = render(SupportedByLenders, {
			props: {
				participants: { totalCount: 1, values: [participants.values[0]] },
				isChallenge: true
			}
		});

		getByText('1 member participating');
	});

	it('should handle challenge mode with multiple members', () => {
		const { getByText } = render(SupportedByLenders, {
			props: {
				participants: { totalCount: 3, values: participants.values.slice(0, 3) },
				isChallenge: true
			}
		});

		getByText('3 members participating');
	});

	it('should handle single person in non-challenge mode', () => {
		const { getByText } = render(SupportedByLenders, {
			props: {
				participants: { values: [participants.values[0]] }
			}
		});

		getByText('Supported by 1 person');
	});

	it('should handle minimal mode without support text', () => {
		const { queryByText } = render(SupportedByLenders, {
			props: {
				participants: { values: [participants.values[0]] },
				minimal: true
			}
		});

		expect(queryByText('Supported by')).toBeNull();
	});

	it('should handle null participants values', () => {
		const { container } = render(SupportedByLenders, {
			props: {
				participants: { values: null }
			}
		});

		const avatars = container.querySelectorAll('[data-testid="participation-lenders"] > *');
		expect(avatars.length).toBe(0);
	});

	it('should handle undefined participants totalCount for challenge', () => {
		const { getByText } = render(SupportedByLenders, {
			props: {
				participants: {},
				isChallenge: true
			}
		});

		getByText('0 members participating');
	});

	it('should filter out participants without images', () => {
		const { container } = render(SupportedByLenders, {
			props: {
				participants: {
					values: [
						participants.values[0],
						{ lender: { name: 'No Image', image: null } },
						participants.values[1]
					]
				}
			}
		});

		const avatars = container.querySelectorAll('[data-testid="participation-lenders"] > *');
		expect(avatars.length).toBe(2);
	});

	it('should handle participant without lender property', () => {
		const { container } = render(SupportedByLenders, {
			props: {
				participants: {
					values: [
						{
							name: 'Direct Participant',
							image: { url: 'https://example.com/image.jpg' }
						}
					]
				}
			}
		});

		const avatars = container.querySelectorAll('[data-testid="participation-lenders"] > *');
		expect(avatars.length).toBe(1);
	});
});
