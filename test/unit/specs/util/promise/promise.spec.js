import promise from '../../../../../src/util/promise';

describe('promise', () => {
	it('is an alias for Promise', () => {
		expect(promise).toBe(Promise);
	});
});
