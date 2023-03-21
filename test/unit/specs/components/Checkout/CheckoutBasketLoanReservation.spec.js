import kvAnalytics from '@/plugins/kv-analytics-plugin';
import LoanReservation from '@/components/Checkout/LoanReservation';
import numeralFilter from '@/plugins/numeral-filter';
import { render } from '@testing-library/vue';

const Time = new Date(); // creates a new date/time based on now
Time.setMinutes(Time.getMinutes() + 5);

describe('LoanReservation', () => {

	it('should contain these components in these states of visibility', () => {
		// lightbox is the same one used everywhere and should be tested separately
		const {
			getByText, getByTestId, getByRole, queryByRole
		} = render(
			LoanReservation,
			{
				props: {
					isExpiringSoon: false,
					expiryTime: Time.toISOString()
				},
			},
			vue => {
				vue.use(kvAnalytics);
				vue.filter('numeral', numeralFilter);
			}
		);

		// note, because only the LoanReservation is being rendered, parts for expiration and non-expiration present
		// These elements should be present, but hidden
		const CloseLightbox = getByRole('img', { hidden: true });
		getByRole('button', { hidden: true });
		getByRole('dialog', { hidden: true });
		// should not be able to find them if not specifying they are hidden
		const KvLightboxSectionHidden = queryByRole('dialog');
		const CloseLightboxHidden = queryByRole('img');
		const CloseLightboxHide = CloseLightbox.getAttribute('aria-hidden');
		expect(KvLightboxSectionHidden).toBe(null);
		expect(CloseLightboxHidden).toBe(null);
		expect(CloseLightboxHide).toBe('true');

		getByText('What does it mean that my loan is not reserved?');
		getByTestId('basket-loan-why-lightbox');
		getByText('Reservation expires in 4m', { exact: false } );
		getByText('Loans will not be reserved', { exact: false });

	});
});
