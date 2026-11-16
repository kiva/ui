import { getMessageId, preFetchOperations } from '#src/composables/useBorrowerMessage';

const [operation] = preFetchOperations;

const preFetch = ({
	id = '123',
	update,
	errors,
	kivaId = null,
} = {}) => {
	const client = { query: vi.fn().mockResolvedValue({ data: { general: { update } }, errors }) };
	const route = { params: { id }, fullPath: `/portfolio/borrower-messages/${id}?utm_source=email` };
	const kvAuth0 = { getKivaId: () => kivaId };
	return { client, promise: operation.preFetch(operation, client, { route, kvAuth0 }) };
};

describe('useBorrowerMessage', () => {
	describe('getMessageId', () => {
		it('reads a positive integer id from the route', () => {
			expect(getMessageId({ params: { id: '123' } })).toBe(123);
			expect(getMessageId({ params: { id: '999999999' } })).toBe(999999999);
		});

		it.each(['', '0', '-1', '1.5', '1e3', 'abc', '012', '1000000000', '99999999999999999999'])('rejects %j', id => {
			expect(getMessageId({ params: { id } })).toBeNull();
		});
	});

	describe('preFetch', () => {
		it('loads the update by id', async () => {
			const { client, promise } = preFetch({ update: { id: 123, type: 'loan' } });

			await expect(promise).resolves.toBeUndefined();
			expect(client.query).toHaveBeenCalledWith(expect.objectContaining({ variables: { id: 123 } }));
		});

		it('redirects an invalid id to the list without querying', async () => {
			const { client, promise } = preFetch({ id: 'abc' });

			await expect(promise).rejects.toEqual({ path: '/portfolio/borrower-messages' });
			expect(client.query).not.toHaveBeenCalled();
		});

		it('redirects a missing update to the list', async () => {
			const { promise } = preFetch({ update: null });

			await expect(promise).rejects.toEqual({ path: '/portfolio/borrower-messages' });
		});

		it('sends logged-out viewers to login and back when they are not privileged', async () => {
			const { promise } = preFetch({
				update: null,
				errors: [{ message: 'nope', extensions: { code: 'api.notPrivileged' } }],
			});

			await expect(promise).rejects.toEqual({
				path: '/ui-login',
				query: { doneUrl: '/portfolio/borrower-messages/123?utm_source=email' },
			});
		});

		it('sends logged-in viewers to the list when they are not privileged', async () => {
			const { promise } = preFetch({
				update: null,
				errors: [{ message: 'nope', code: 'api.notPrivileged' }],
				kivaId: 42,
			});

			await expect(promise).rejects.toEqual({ path: '/portfolio/borrower-messages' });
		});

		it('loads partner updates without leaving the page', async () => {
			const { promise } = preFetch({ update: { id: 123, type: 'partner' } });

			await expect(promise).resolves.toBeUndefined();
		});
	});
});
