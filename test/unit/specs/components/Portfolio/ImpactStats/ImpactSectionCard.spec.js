import { render, within } from '@testing-library/vue';
import ImpactSectionCard from '#src/components/Portfolio/ImpactStats/ImpactSectionCard';

const renderCard = ({ props = {}, slots = {}, attrs = {} } = {}) => render(ImpactSectionCard, {
	props: { title: 'Geographic Reach', ...props },
	attrs,
	slots: { default: '<p>Body</p>', ...slots },
});

describe('ImpactSectionCard', () => {
	it('is a region named by its title, an h3', () => {
		const { getByRole } = renderCard();

		getByRole('region', { name: 'Geographic Reach' });
		getByRole('heading', { level: 3, name: 'Geographic Reach' });
	});

	it('renders the default slot as the body', () => {
		const { getByText } = renderCard();

		getByText('Body');
	});

	it('shows a subtitle from the prop, under the title', () => {
		const { getByRole, getByTestId } = renderCard({ props: { subtitle: 'Countries where you have lent' } });
		const subtitle = getByTestId('impact-section-subtitle');

		expect(subtitle.textContent.trim()).toBe('Countries where you have lent');
		expect(getByRole('heading').compareDocumentPosition(subtitle))
			.toBe(Node.DOCUMENT_POSITION_FOLLOWING);
	});

	it('shows a subtitle from the slot', () => {
		const { getByTestId } = renderCard({ slots: { subtitle: 'You lent to Rosa M on March 13, 2020' } });

		expect(getByTestId('impact-section-subtitle').textContent.trim()).toBe('You lent to Rosa M on March 13, 2020');
	});

	it('shows no subtitle element without one', () => {
		const { queryByTestId } = renderCard();

		expect(queryByTestId('impact-section-subtitle')).toBeNull();
	});

	it('wraps the pill slot in a small muted pill', () => {
		const { getByTestId } = renderCard({ slots: { pill: '7 of 32 countries' } });
		const pill = getByTestId('impact-section-pill');

		expect(pill.textContent.trim()).toBe('7 of 32 countries');
		expect(pill.classList).toContain('tw-bg-gray-100');
	});

	it('shows no pill without the slot', () => {
		const { queryByTestId } = renderCard();

		expect(queryByTestId('impact-section-pill')).toBeNull();
	});

	it('has no header without a title, and pads the top of the body', () => {
		const { container, getByText, queryByRole } = renderCard({ props: { title: '' } });

		expect(queryByRole('heading')).toBeNull();
		expect(container.querySelector('section').hasAttribute('aria-labelledby')).toBe(false);
		expect(getByText('Body').parentElement.classList).toContain('tw-pt-2.5');
	});

	it('pads the body sides unless flush', () => {
		const padded = renderCard().getByText('Body').parentElement.classList;
		expect(padded).toContain('tw-px-2.5');
		expect(padded).toContain('md:tw-px-3');
		expect(padded).not.toContain('tw-pt-2.5');

		const { container } = renderCard({ props: { flush: true } });
		const flush = within(container).getByText('Body').parentElement.classList;
		expect(flush).not.toContain('tw-px-2.5');
		expect(flush).not.toContain('md:tw-px-3');
	});

	it('clips to the rounded corners only when flush', () => {
		const frame = renderCard().container.querySelector('.kv-card-frame');
		expect(frame.classList).not.toContain('tw-overflow-hidden');

		const flushFrame = renderCard({ props: { flush: true } }).container.querySelector('.kv-card-frame');
		expect(flushFrame.classList).toContain('tw-overflow-hidden');
	});

	describe('loading', () => {
		const loadingSlots = { loading: '<div data-testid="skeleton"></div>', pill: '7 of 32 countries' };

		it('shows the loading slot instead of the body', () => {
			const { getByTestId, queryByText } = renderCard({ props: { loading: true }, slots: loadingSlots });

			getByTestId('skeleton');
			expect(queryByText('Body')).toBeNull();
		});

		it('keeps the title and a subtitle prop real', () => {
			const { getByRole, getByTestId } = renderCard({
				props: { loading: true, subtitle: 'Countries where you have lent' },
				slots: loadingSlots,
			});

			getByRole('heading', { level: 3, name: 'Geographic Reach' });
			expect(getByTestId('impact-section-subtitle').textContent.trim()).toBe('Countries where you have lent');
		});

		it('shows loading text in place of the pill', () => {
			const { getByTestId, queryByText } = renderCard({ props: { loading: true }, slots: loadingSlots });

			expect(getByTestId('impact-section-pill').querySelector('.kv-loading-text')).not.toBeNull();
			expect(queryByText('7 of 32 countries')).toBeNull();
		});

		it('shows loading text in place of a slotted subtitle', () => {
			const { getByTestId, queryByText } = renderCard({
				props: { loading: true },
				slots: { ...loadingSlots, subtitle: 'You lent to Rosa M on March 13, 2020' },
			});

			expect(getByTestId('impact-section-subtitle').querySelector('.kv-loading-text')).not.toBeNull();
			expect(queryByText('You lent to Rosa M on March 13, 2020')).toBeNull();
		});
	});

	describe('error', () => {
		it('replaces the body with the error message, keeping the title and hiding the pill', () => {
			const {
				getByRole, queryByRole, queryByText, queryByTestId
			} = renderCard({
				props: { error: true },
				slots: { pill: '7 of 32 countries' },
			});
			const alert = getByRole('alert');

			expect(alert.textContent).toContain('We couldn\'t load this right now.');
			expect(alert.textContent).toContain('Your loans are safe. Refresh the page to try again.');
			expect(queryByRole('button')).toBeNull();
			getByRole('heading', { level: 3, name: 'Geographic Reach' });
			expect(queryByText('Body')).toBeNull();
			expect(queryByTestId('impact-section-pill')).toBeNull();
		});

		it('shows the skeleton, not the error, when loading is also set', () => {
			const { getByTestId, queryByRole } = renderCard({
				props: { loading: true, error: true },
				slots: { loading: '<div data-testid="skeleton"></div>' },
			});

			getByTestId('skeleton');
			expect(queryByRole('alert')).toBeNull();
		});

		it('keeps the insets in a flush card', () => {
			const { getByRole } = renderCard({ props: { flush: true, error: true } });

			expect(getByRole('alert').parentElement.classList).toContain('tw-px-2.5');
		});

		it('shows in an untitled card', () => {
			const { getByRole, queryByRole } = renderCard({ props: { title: '', error: true } });

			getByRole('alert');
			expect(queryByRole('heading')).toBeNull();
		});
	});

	it('puts fallthrough attributes on the section', () => {
		const { container } = renderCard({ attrs: { 'data-testid': 'impact-geographic-reach' } });

		expect(container.firstElementChild.tagName).toBe('SECTION');
		expect(container.firstElementChild.dataset.testid).toBe('impact-geographic-reach');
	});
});
