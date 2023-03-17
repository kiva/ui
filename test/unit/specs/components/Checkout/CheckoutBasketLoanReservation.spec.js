import kvAnalytics from '@/plugins/kv-analytics-plugin';
import LoanReservation from '@/components/Checkout/LoanReservation';
import numeralFilter from '@/plugins/numeral-filter';
import { render } from '@testing-library/vue';

const Time = new Date(); // creates a new date/time based on now
Time.setMinutes(Time.getMinutes() + 5);

describe('LoanReservation', () => {
	beforeEach(() => {
	});
	afterEach(jest.clearAllMocks);

	it('should contain these components in these states of visibility', async () => {
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
		const KvLightboxSection = getByRole('dialog', { hidden: true });
		const CloseLightbox = getByRole('img', { hidden: true });
		const ReservationWhyCloseButton = getByRole('button', { hidden: true });
		// should not be able to find them if not specifying they are hidden
		const KvLightboxSectionHidden = queryByRole('dialog');
		const CloseLightboxHidden = queryByRole('img');
		const CloseLightboxHide = CloseLightbox.getAttribute('aria-hidden');
		expect(KvLightboxSectionHidden).toBe(null);
		expect(CloseLightboxHidden).toBe(null);
		expect(CloseLightboxHide).toBe('true');
		expect(KvLightboxSection).toBeDefined();
		expect(ReservationWhyCloseButton).toBeDefined();

		const LoanMessage = getByText('What does it mean that my loan is not reserved?');
		const WhyLightbox = getByTestId('basket-loan-why-lightbox');
		const Reservation = getByText('Reservation expires in 4m 59s');
		const KvLightBoxBody = getByText('Loans will not be reserved', { exact: false });
		expect(LoanMessage).toBeDefined();
		expect(WhyLightbox).toBeDefined();
		expect(Reservation).toBeDefined();
		expect(KvLightBoxBody).toBeDefined();
	});
});
