import CDNHelper from '../../../../src/util/CDNHelper';

describe('CDNHelper', () => {
	let helper;
	beforeEach(() => {
		helper = new CDNHelper();
	});

	it('initializes with empty tags and cacheControl', () => {
		expect(helper.tags).toBeInstanceOf(Set);
		expect(helper.tags.size).toBe(0);
		expect(helper.cacheControl).toBeDefined();
	});

	describe('addTags', () => {
		it('adds tags to the set', () => {
			helper.addTags(['foo', 'bar']);
			expect(helper.tags.has('foo')).toBe(true);
			expect(helper.tags.has('bar')).toBe(true);
		});

		it('handles non-array input gracefully', () => {
			const initialSize = helper.tags.size;
			helper.addTags('not-an-array');
			helper.addTags(null);
			helper.addTags(undefined);
			helper.addTags({ tag: 'object' });
			expect(helper.tags.size).toBe(initialSize);
		});

		it('returns this for chaining', () => {
			const result = helper.addTags(['baz']);
			expect(result).toBe(helper);
		});
	});

	describe('set', () => {
		it('sets cacheControl property if it exists', () => {
			helper.cacheControl.testKey = 1;
			helper.set('testKey', 2);
			expect(helper.cacheControl.testKey).toBe(2);
		});

		it('does not set property if it does not exist', () => {
			helper.set('notAKey', 123);
			expect(helper.cacheControl.notAKey).toBeUndefined();
		});

		it('returns this for chaining', () => {
			expect(helper.set('testKey', 1)).toBe(helper);
		});
	});

	describe('setNumeric', () => {
		it('setNumeric sets numeric value if lower or unset', () => {
			helper.cacheControl.num = 10;
			helper.setNumeric('num', 5);
			expect(helper.cacheControl.num).toBe(5);
			helper.setNumeric('num', 20);
			expect(helper.cacheControl.num).toBe(5);
		});

		it('setNumeric does not set if not a number', () => {
			helper.cacheControl.num = 10;
			helper.setNumeric('num', 'notnum');
			expect(helper.cacheControl.num).toBe(10);
		});

		it('setNumeric returns this for chaining', () => {
			expect(helper.setNumeric('num', 1)).toBe(helper);
		});
	});

	describe('private', () => {
		it('sets private true and public false', () => {
			helper.cacheControl.private = false;
			helper.cacheControl.public = true;
			helper.private();
			expect(helper.cacheControl.private).toBe(true);
			expect(helper.cacheControl.public).toBe(false);
		});

		it('returns this for chaining', () => {
			expect(helper.private()).toBe(helper);
		});
	});

	describe('public', () => {
		it('sets public true if not private', () => {
			helper.cacheControl.private = false;
			helper.cacheControl.public = false;
			helper.public();
			expect(helper.cacheControl.public).toBe(true);
		});

		it('does not set public if private is true', () => {
			helper.cacheControl.private = true;
			helper.cacheControl.public = false;
			helper.public();
			expect(helper.cacheControl.public).toBe(false);
		});

		it('returns this for chaining', () => {
			expect(helper.public()).toBe(helper);
		});
	});
});
