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

	it('puts fallthrough attributes on the section', () => {
		const { container } = renderCard({ attrs: { 'data-testid': 'impact-geographic-reach' } });

		expect(container.firstElementChild.tagName).toBe('SECTION');
		expect(container.firstElementChild.dataset.testid).toBe('impact-geographic-reach');
	});
});
