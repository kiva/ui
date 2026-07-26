import { capitalize, formatPossessiveName } from '#src/util/stringParserUtils';

describe('stringParserUtils.js', () => {
	describe('capitalize', () => {
		it('capitalizes the first letter', () => {
			expect(capitalize('january')).toBe('January');
		});

		it('leaves an already-capitalized string unchanged', () => {
			expect(capitalize('January')).toBe('January');
		});

		it('only touches the first letter, leaving the rest as-is', () => {
			expect(capitalize('john doe')).toBe('John doe');
		});

		it('returns falsy input unchanged', () => {
			expect(capitalize('')).toBe('');
			expect(capitalize(null)).toBe(null);
			expect(capitalize(undefined)).toBe(undefined);
		});
	});

	describe('formatPossessiveName', () => {
		it('returns empty string for null, undefined, or empty input', () => {
			expect(formatPossessiveName(null)).toBe('');
			expect(formatPossessiveName(undefined)).toBe('');
			expect(formatPossessiveName('')).toBe('');
		});

		it('adds just an apostrophe when name already ends with s', () => {
			expect(formatPossessiveName('Jess')).toBe("Jess'");
			expect(formatPossessiveName('James')).toBe("James'");
		});

		it("adds 's for names not ending with s", () => {
			expect(formatPossessiveName('Ana')).toBe("Ana's");
			expect(formatPossessiveName('John')).toBe("John's");
		});

		it('trims whitespace and adds apostrophe when expected', () => {
			expect(formatPossessiveName('  Simone  ')).toBe("Simone's");
			expect(formatPossessiveName('  Kiva User')).toBe("Kiva User's");
			// Even when empty string, whitespace should still be reduced
			expect(formatPossessiveName('   ')).toBe('');
		});
	});
});
