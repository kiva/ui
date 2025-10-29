import { handleApolloErrors, preFetchApolloQuery, preFetchAll } from '../../../../src/util/apolloPreFetch';
import logFormatter from '../../../../src/util/logFormatter';

vi.mock('#src/util/logFormatter', () => ({ default: vi.fn() }));

const dummyQuery = { kind: 'Document', definitions: [] };

describe('apolloPreFetch', () => {
	describe('handleApolloErrors', () => {
		afterEach(() => {
			vi.clearAllMocks();
		});

		it('calls the correct handler for each error code', async () => {
			const handlers = {
				ERR1: vi.fn(() => Promise.resolve('handled1')),
				ERR2: vi.fn(() => Promise.resolve('handled2')),
			};
			const errors = [
				{ message: 'err1', code: 'ERR1' },
				{ message: 'err2', extensions: { code: 'ERR2' } },
			];
			const result = await handleApolloErrors(handlers, errors);
			expect(handlers.ERR1).toHaveBeenCalledWith({ graphQLErrors: [errors[0]] });
			expect(handlers.ERR2).toHaveBeenCalledWith({ graphQLErrors: [expect.objectContaining(errors[1])] });
			expect(result).toEqual(['handled1', 'handled2']);
		});

		it('logs a warning for unhandled error codes', async () => {
			const handlers = {};
			const errors = [{ message: 'err', code: 'UNHANDLED' }];
			await handleApolloErrors(handlers, errors);
			expect(logFormatter).toHaveBeenCalledWith(
				expect.stringContaining("No error handler for error code 'UNHANDLED'"),
				'warn'
			);
		});

		it('skips logging for well-known error codes', async () => {
			const handlers = {};
			const errors = [{ message: 'auth required', code: 'api.authenticationRequired' }];
			await handleApolloErrors(handlers, errors);
			expect(logFormatter).not.toHaveBeenCalled();
		});

		it('throws if a handler does not return a Promise', async () => {
			const handlers = { ERR: () => 123 };
			const errors = [{ message: 'err', code: 'ERR' }];
			await expect(() => handleApolloErrors(handlers, errors))
				.toThrow('Error handler functions must return a Promise');
		});
	});

	describe('preFetchApolloQuery', () => {
		const client = { query: vi.fn() };
		const args = { cookieStore: { get: vi.fn(() => 'cookieVal') } };

		afterEach(() => {
			vi.clearAllMocks();
		});

		it('skips prefetch if shouldPreFetch returns false', async () => {
			const config = { shouldPreFetch: () => false };
			const result = await preFetchApolloQuery(config, client, args);
			expect(result).toBeUndefined();
			expect(client.query).not.toHaveBeenCalled();
		});

		it('calls config.preFetch if provided', async () => {
			const preFetch = vi.fn(() => Promise.resolve('manual'));
			const config = { preFetch };
			const result = await preFetchApolloQuery(config, client, args);
			expect(preFetch).toHaveBeenCalledWith(config, client, args);
			expect(result).toBe('manual');
		});

		it('throws if preFetch does not return a Promise', () => {
			const config = { preFetch: () => 123 };
			expect(() => preFetchApolloQuery(config, client, args))
				.toThrow('Pre-fetch functions must return a Promise');
		});

		it('calls client.query with correct variables and resolves result', async () => {
			const config = {
				query: dummyQuery,
				preFetchVariables: () => ({ foo: 'bar' }),
			};
			const expectedResult = { data: 1 };
			client.query.mockResolvedValue(expectedResult);
			const result = await preFetchApolloQuery(config, client, args);
			expect(client.query).toHaveBeenCalledWith({
				query: dummyQuery,
				variables: { basketId: 'cookieVal', foo: 'bar' },
				fetchPolicy: 'network-only',
			});
			expect(result).toBe(expectedResult);
		});

		it('handles errors by calling handleApolloErrors and resolves', async () => {
			const config = {
				query: dummyQuery,
				errorHandlers: { ERR: vi.fn(() => Promise.resolve('handled')) },
				preFetchVariables: () => ({}),
			};
			const error = { message: 'err', code: 'ERR' };
			client.query.mockResolvedValue({ errors: [error] });
			const result = await preFetchApolloQuery(config, client, args);
			expect(result).toEqual(['handled']);
		});

		it('rejects if client.query rejects', async () => {
			const config = { query: dummyQuery };
			const err = new Error('fail');
			client.query.mockRejectedValue(err);
			await expect(preFetchApolloQuery(config, client, args)).rejects.toThrow('fail');
		});

		it('calls client.query without basketId if cookieStore is not provided', async () => {
			const config = {
				query: dummyQuery,
				preFetchVariables: () => ({ foo: 'bar' }),
			};
			const argsWithoutCookie = {};
			const expectedResult = { data: 1 };
			client.query.mockResolvedValue(expectedResult);
			await preFetchApolloQuery(config, client, argsWithoutCookie);
			expect(client.query).toHaveBeenCalledWith({
				query: dummyQuery,
				variables: { foo: 'bar' },
				fetchPolicy: 'network-only',
			});
		});

		it('uses empty object for variables if preFetchVariables is not provided', async () => {
			const config = { query: dummyQuery };
			const argsWithoutCookie = {};
			client.query.mockResolvedValue({ data: 1 });
			await preFetchApolloQuery(config, client, argsWithoutCookie);
			expect(client.query).toHaveBeenCalledWith({
				query: dummyQuery,
				variables: {},
				fetchPolicy: 'network-only',
			});
		});
	});

	describe('preFetchAll', () => {
		it('returns an empty array if no components have apollo configs', async () => {
			const result = await preFetchAll([], {}, {});
			expect(result).toEqual([]);
		});

		it('calls preFetchApolloQuery for each preFetch operation in all components', async () => {
			const fakeClient = { query: vi.fn().mockResolvedValue({}) };
			const fakeArgs = { foo: 1 };
			const op1 = {
				preFetch: vi.fn().mockResolvedValue('result1'),
				query: dummyQuery,
			};
			const op2 = {
				preFetch: vi.fn().mockResolvedValue('result2'),
				query: dummyQuery,
			};
			const comp1 = { apollo: [op1, op2] };
			const comp2 = { apollo: [op1] };
			const result = await preFetchAll([comp1, comp2], fakeClient, fakeArgs);
			expect(result).toEqual(['result1', 'result2', 'result1']);
			expect(op1.preFetch).toHaveBeenCalledTimes(2);
			expect(op2.preFetch).toHaveBeenCalledTimes(1);
		});

		it('skips operations where preFetch is false or missing', async () => {
			const op1 = { preFetch: false, query: dummyQuery };
			const op2 = { query: dummyQuery };
			const comp = { apollo: [op1, op2] };
			const result = await preFetchAll([comp], {}, {});
			expect(result).toEqual([]);
		});
	});
});
