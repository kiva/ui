import logReadQueryError from '#src/util/logReadQueryError';
import logFormatter from '#src/util/logFormatter';

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

describe('logReadQueryError', () => {
	it('should log error with query type and stack trace', () => {
		const error = new Error('Test error');
		const queryType = 'userQuery';

		logReadQueryError(error, queryType);

		expect(logFormatter).toHaveBeenCalledWith(
			expect.stringContaining('userQuery:'),
			'error'
		);
		expect(logFormatter).toHaveBeenCalledWith(
			expect.stringContaining(error.stack),
			'error'
		);
	});

	it('should use default query type when not provided', () => {
		const error = new Error('Test error');

		logReadQueryError(error);

		expect(logFormatter).toHaveBeenCalledWith(
			expect.stringContaining('undefined_query_error_type:'),
			'error'
		);
	});

	it('should handle errors with different stack traces', () => {
		const error = new Error('Different error');
		error.stack = 'Custom stack trace';

		logReadQueryError(error, 'customQuery');

		expect(logFormatter).toHaveBeenCalledWith(
			'customQuery: Custom stack trace',
			'error'
		);
	});

	it('should handle error with undefined stack', () => {
		const error = { stack: undefined };

		logReadQueryError(error, 'queryType');

		expect(logFormatter).toHaveBeenCalledWith(
			'queryType: undefined',
			'error'
		);
	});

	it('should handle empty query type string', () => {
		const error = new Error('Test error');

		logReadQueryError(error, '');

		expect(logFormatter).toHaveBeenCalledWith(
			expect.stringContaining(': '),
			'error'
		);
		expect(logFormatter).toHaveBeenCalledWith(
			expect.stringContaining(error.stack),
			'error'
		);
	});

	it('should handle null query type', () => {
		const error = new Error('Test error');

		logReadQueryError(error, null);

		expect(logFormatter).toHaveBeenCalledWith(
			expect.stringContaining('null:'),
			'error'
		);
	});

	it('should call logFormatter with error severity level', () => {
		const error = new Error('Test error');

		logReadQueryError(error, 'testQuery');

		const { calls } = logFormatter.mock;
		expect(calls[0][1]).toBe('error');
	});
});
