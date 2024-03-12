import { render } from '@testing-library/vue';
import PoweredByLenders from '@/components/BorrowerProfile/PoweredByLenders';

const participants = {
	values: [
		{
			latestSharePurchaseDate: '2023-11-13T10:51:10Z',
			lender: {
				name: 'Erica',
				image: {
					url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				},
			},
			shareAmount: '5.00',
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
	it('should display 5 participants photos at maximum', () => {
		const props = {
			participants,
		};

		const numberOfParticipants = props.participants.values.length;

		const { getByText, getAllByAltText } = render(PoweredByLenders, {
			props,
		});

		const images = getAllByAltText('Lender photo');
		expect(images.length).toEqual(numberOfParticipants > 5 ? 5 : numberOfParticipants);

		getByText(`Powered by ${numberOfParticipants} lenders`);
	});
});
