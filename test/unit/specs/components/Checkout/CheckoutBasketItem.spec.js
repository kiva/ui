//import { getByDisplayValue, getByTestId, render } from '@testing-library/vue';
import BasketItem from '@/components/Checkout/BasketItem';
//import LoanReservation from '@/components/Checkout/LoanReservation';
import kvAnalytics from '@/plugins/kv-analytics-plugin';
import VueRouter from 'vue-router';
import numeralFilter from '@/plugins/numeral-filter';
import CookieStore from '@/util/cookieStore';
import { MockKvAuth0 } from '@/util/KvAuth0';
import { screen } from '@testing-library/dom';
import promoLoanReservation from '../../../fixtures/PromoLoanReservation.json';
//import JoinTeam from "../../../../../src/pages/LoginAndRegister/JoinTeam";
//import {number} from "tailwindcss/lib/util/dataTypes";

const emptyComponent = {
	template: '<div></div>',
};

// set up data injections
const PromoLoanReservationData = promoLoanReservation;
const DateUpdateData = {
	"loan": {
			"id": 2444883,
			"name": "Twubakane Cb Group",
			"use": "to buy more beans and sorghum with her loan.",
			"status": "fundraising",
			"matchingText": "2x Matching by Coca Cola Foundation",
			"loanAmount": "8750.00",
			"plannedExpirationDate": "2050-10-12T19:40:15Z",
			"sector": {"id": 12, "name": "Food", "__typename": "Sector"},
			"activity": {"id": 67, "name": "Food Production/Sales", "__typename": "Activity"},
			"geocode": {
				"country": {"name": "Rwanda", "isoCode": "RW", "__typename": "Country"},
				"__typename": "Geocode"
			},
			"loanFundraisingInfo": {
				"isExpiringSoon": false,
				"fundedAmount": "5065.00",
				"reservedAmount": "25.00",
				"__typename": "LoanFundraisingInfo"
			},
			"image": {
				"id": 4947325,
				"url": "https://www-dev-kiva-org-0.freetls.fastly.net/img/s150/aa895120425465e8437e08e69c72218b.jpg",
				"url_2x": "https://www-dev-kiva-org-0.freetls.fastly.net/img/s300/aa895120425465e8437e08e69c72218b.jpg",
				"__typename": "Image"
			},
			"sponsor_name": "Urwego Bank",
			"__typename": "LoanPartner"
		}
	};



// Test that the basket item renders the components it contains:
// Checkout Item Img, Remove Basket Item, Loan Reservation, Team Attribution, Loan Promo Credits,
// Loan Price, Remove Basket Item

describe('BasketItem loan', () => {
	it('should contain these components', async () => {
		const { getByText } = render(
			BasketItem,
	{
				provide: {
					apollo: {
						readFragment: () => {},
						query: () => Promise.resolve({}),
						readQuery: () => {},
					},
					cookieStore: new CookieStore(),
					kvAuth0: MockKvAuth0,
				},
				routes: new VueRouter(),
				props: {
					disableMatching: false,
					disableRedirects: false,
					loan: promoLoanReservation,
					teams: [
						{
							__typename: "Team",
							id: 23770,
							name: "Donut Empire"
						}
					]
				},
				stubs: {
					LoanReservation: { ...emptyComponent }
				}
			},
			vue => {
				vue.use(kvAnalytics);
				vue.filter('numeral', numeralFilter);
			}
			);

		// not a component, but making sure this is showing still
		const LoanTitle = getByText('Twubakane Cb Group in Rwanda');
		expect(LoanTitle).toBeDefined();

		// Can't use text 'reservation expires in' to select because it is inside a component rendered
		// by LoanReservation, which has not actually been rendered here. Must use what we have.
		const LoanReservation = screen.getByTestId('basket-loan-reservation-text');
		expect(LoanReservation).toBeDefined();

		const CheckoutItemImg = screen.getByTestId('basket-loan-image');
		expect(CheckoutItemImg).toBeDefined();

		const LoanPrice = screen.getByTestId('basket-loan-price-selector');
		expect(LoanPrice).toBeDefined();

		const TeamAttribution = getByText('Donut Empire');
		expect(TeamAttribution).toBeDefined();

		const RemoveBasketItem = screen.getByTestId('removeBasketItem');
		expect(RemoveBasketItem).toBeDefined();

		const LoanPromoCredits = getByText('25.00 credit applied');
		expect(LoanPromoCredits).toBeDefined();
		}
		)
	}
	)

// now we test each individual component that we checked above
// describe('LoanReservation', () => {
// 	it('should contain lightbox', async () => {
// 		// lightbox is the same one used everywhere and should be tested separately
// 		const { getByText } = render(
// 			LoanReservation,
// 			{
// 				provide: {
// 					apollo: {
// 						readFragment: () => {
// 						},
// 						query: () => Promise.resolve({}),
// 						readQuery: () => {
// 						},
// 					},
// 					cookieStore: new CookieStore(),
// 					kvAuth0: MockKvAuth0,
// 				},
// 				routes: new VueRouter(),
// 				props: {
// 					disableMatching: false,
// 					disableRedirects: false,
// 					loan: promoLoanReservation,
// 					teams: [
// 						{
// 							__typename: "Team",
// 							id: 23770,
// 							name: "Donut Empire"
// 						}
// 					]
// 				},
// 				stubs: {
// 					LoanReservation: { ...emptyComponent }
// 				}
// 			},
// 			vue => {
// 				vue.use(kvAnalytics);
// 				vue.filter('numeral', numeralFilter);
// 			}
// 		)
// 		const KvLightbox = getByText('What does it mean that my loan is not reserved?');
// 		const ReservationWhy = getByTestId('basket-loan-reservation=why');
// 		const KvLightBoxBody = getByText('Loans will not be reservered');
//
// 		expect(KvLightbox).toContain(ReservationWhy);
// 		expect(ReservationWhy).toContain(KvLightBoxBody);
//
// 	}
// 	)
// 	it('should count down until the loan reservation expires', async () => {
// 		const { getByText } = render(
// 			LoanReservation,
// 			{
// 				provide: {
// 					apollo: {
// 						readFragment: () => {
// 						},
// 						query: () => Promise.resolve({}),
// 						readQuery: () => {
// 						},
// 					},
// 					cookieStore: new CookieStore(),
// 					kvAuth0: MockKvAuth0,
// 				},
// 				routes: new VueRouter(),
// 				props: {
// 					disableMatching: false,
// 					disableRedirects: false,
// 					loan: promoLoanReservation,
// 					teams: [
// 						{
// 							__typename: "Team",
// 							id: 23770,
// 							name: "Donut Empire"
// 						}
// 					]
// 				},
// 				stubs: {
// 					LoanReservation: { ...emptyComponent }
// 				}
// 			},
// 			vue => {
// 				vue.use(kvAnalytics);
// 				vue.filter('numeral', numeralFilter);
// 			}
// 		)
// 		//const ReservationText = getByText('Reservation expires in');
// 		const ReservationText = getByTestId('basket-loan-reservation-text')
// 		expect(ReservationText).toContain(number)
// 		expect(ReservationText).toHaveProperty(class = reservation-info)
// 	}
// 	);

// it('should be able to remove loan reservation from basket on click', async () => {
// 		const {getByText} = render(
// 			LoanReservation,
// 			{
// 				routes: new VueRouter(),
// 				props: {
// 					disableMatching: false,
// 					disableRedirects: false,
// 					loan: promoLoanReservation,
// 					teams: [
// 						{
// 							__typename: "Team",
// 							id: 23770,
// 							name: "Donut Empire"
// 						}
// 					]
// 				},
// 				stubs: {
// 					LoanReservation: {...emptyComponent}
// 				}
// 			},
// 			vue => {
// 				vue.use(kvAnalytics);
// 				vue.filter('numeral', numeralFilter);
// 			}
// 		)
// 		const mockCallBack = jest.fn();
// 		const removeButton = getByTestId.first('removeBasketItem');
// 		//const removeButtonClick = shallow((<removeButton onClick={mockCallBack}>Ok!</removeButton>));
// 		expect(removeButton).toBeDisabled()
// 	}
//
// );
// 	// const
// }
// );
