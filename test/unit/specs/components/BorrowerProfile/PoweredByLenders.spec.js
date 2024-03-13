import { render, waitFor } from '@testing-library/vue';
import PoweredByLenders from '@/components/BorrowerProfile/PoweredByLenders';

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

describe('PoweredByLenders', () => {
	it('should display 5 participants photos at maximum', async () => {
		const props = {
			participants,
		};

		const numberOfParticipants = props.participants.values.length;

		const { getByText, findAllByText } = render(PoweredByLenders, {
			props,
		});

		const images = await waitFor(() => findAllByText('J', { exact: false }));
		expect(images.length).toEqual(numberOfParticipants > 5 ? 5 : numberOfParticipants);

		getByText(`Powered by ${numberOfParticipants} lenders`);
	});
});
