import { render } from '@testing-library/vue';
import { globalOptions, getOperationName } from '#src/../test/unit/specUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import UsesBorrowerMessageSuggestedLoans
	from '#src/../test/unit/fixtures/composables/UsesBorrowerMessageSuggestedLoans';

vi.mock('#src/util/logReadQueryError');

const flushPromises = () => new Promise(resolve => { setTimeout(resolve); });

const page = values => ({ data: { fundraisingLoans: { values } } });

const renderComposable = apollo => render(UsesBorrowerMessageSuggestedLoans, {
	props: { partnerId: 3 },
	global: { ...globalOptions, provide: { ...globalOptions.provide, apollo } },
});

const readLoans = getByTestId => JSON.parse(getByTestId('loans').textContent);

describe('useBorrowerMessageSuggestedLoans', () => {
	let apollo;

	beforeEach(() => {
		apollo = { query: vi.fn() };
		logReadQueryError.mockClear();
	});

	it('starts with loans unknown', () => {
		apollo.query.mockReturnValue(new Promise(() => {}));

		const { getByTestId } = renderComposable(apollo);

		expect(getByTestId('loans').textContent).toBe('null');
	});

	it('loads the partner loans on mount', async () => {
		apollo.query.mockResolvedValueOnce(page([{ id: 1 }, { id: 2 }, { id: 3 }]));

		const { getByTestId } = renderComposable(apollo);
		await flushPromises();

		expect(apollo.query).toHaveBeenCalledTimes(1);
		expect(getOperationName(apollo.query.mock.calls[0][0].query)).toBe('borrowerMessagePartnerLoans');
		expect(apollo.query.mock.calls[0][0].variables).toEqual({ partnerId: 3, origin: 'web:borrower-message' });
		expect(readLoans(getByTestId)).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
		expect(getByTestId('is-fallback').textContent).toBe('false');
	});

	it('falls back to personalized loans when the partner has none', async () => {
		apollo.query.mockResolvedValueOnce(page([])).mockResolvedValueOnce(page([{ id: 9 }]));

		const { getByTestId } = renderComposable(apollo);
		await flushPromises();

		expect(apollo.query).toHaveBeenCalledTimes(2);
		expect(getOperationName(apollo.query.mock.calls[1][0].query)).toBe('borrowerMessageFallbackLoans');
		expect(apollo.query.mock.calls[1][0].variables).toEqual({ origin: 'web:borrower-message' });
		expect(readLoans(getByTestId)).toEqual([{ id: 9 }]);
		expect(getByTestId('is-fallback').textContent).toBe('true');
	});

	it('falls back when the partner query fails', async () => {
		apollo.query.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(page([{ id: 9 }]));

		const { getByTestId } = renderComposable(apollo);
		await flushPromises();

		expect(readLoans(getByTestId)).toEqual([{ id: 9 }]);
		expect(getByTestId('is-fallback').textContent).toBe('true');
		expect(logReadQueryError).toHaveBeenCalledTimes(1);
	});

	it.each([
		['empty', query => query.mockResolvedValue(page([]))],
		['failing', query => query.mockRejectedValue(new Error('network'))],
		['missing data', query => query.mockResolvedValue({ data: null, errors: [{ message: 'boom' }] })],
	])('settles on no loans when both queries come back %s', async (_, arrange) => {
		arrange(apollo.query);

		const { getByTestId } = renderComposable(apollo);
		await flushPromises();

		expect(apollo.query).toHaveBeenCalledTimes(2);
		expect(readLoans(getByTestId)).toEqual([]);
	});

	it('drops null loans', async () => {
		apollo.query.mockResolvedValueOnce(page([null, { id: 1 }]));

		const { getByTestId } = renderComposable(apollo);
		await flushPromises();

		expect(apollo.query).toHaveBeenCalledTimes(1);
		expect(readLoans(getByTestId)).toEqual([{ id: 1 }]);
	});
});
