import FullBorrowerProfile from '#src/components/BorrowerProfile/FullBorrowerProfile';

const { isAnonymized, showComments } = FullBorrowerProfile.computed;

// Evaluates a computed with a mock `this` context, resolving other computeds it depends on.
function evalShowComments({ isPrivileged = false, anonymizationLevel = 'none' } = {}) {
	const context = {
		isPrivileged,
		loanData: { anonymizationLevel },
	};
	context.isAnonymized = isAnonymized.call(context);
	return showComments.call(context);
}

describe('FullBorrowerProfile comment section visibility', () => {
	describe('isAnonymized', () => {
		it.each([
			['full', true],
			['pii', true],
			['none', false],
			[undefined, false],
			['', false],
		])('anonymizationLevel "%s" -> %s', (level, expected) => {
			expect(isAnonymized.call({ loanData: { anonymizationLevel: level } })).toBe(expected);
		});
	});

	describe('showComments', () => {
		it('hides for a non-privileged user regardless of anonymization', () => {
			expect(evalShowComments({ isPrivileged: false, anonymizationLevel: 'none' })).toBe(false);
			expect(evalShowComments({ isPrivileged: false, anonymizationLevel: 'full' })).toBe(false);
		});

		it('shows for a privileged user on a non-anonymized loan', () => {
			expect(evalShowComments({ isPrivileged: true, anonymizationLevel: 'none' })).toBe(true);
		});

		it('hides for a privileged user on a full/pii anonymized loan', () => {
			expect(evalShowComments({ isPrivileged: true, anonymizationLevel: 'full' })).toBe(false);
			expect(evalShowComments({ isPrivileged: true, anonymizationLevel: 'pii' })).toBe(false);
		});
	});
});
