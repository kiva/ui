import FullBorrowerProfile from '#src/components/BorrowerProfile/FullBorrowerProfile';

const {
	isAnonymized,
	isPrivileged,
	showAddCommentsSection,
	showUpdatesSection,
} = FullBorrowerProfile.computed;

// Evaluates a computed with a mock `this` context, resolving other computeds it depends on.
function evalShowComments({ privileged = false, anonymizationLevel = 'none' } = {}) {
	const context = {
		loanData: {
			anonymizationLevel,
			userProperties: { isPrivileged: privileged },
		},
	};
	context.isAnonymized = isAnonymized.call(context);
	context.isPrivileged = isPrivileged.call(context);
	return showAddCommentsSection.call(context);
}

// Evaluates showUpdatesSection with a mock `this`, resolving the isAnonymized computed it depends on.
function evalShowUpdates({ showUpdates = true, anonymizationLevel = 'none' } = {}) {
	const context = {
		showUpdates,
		loanData: { anonymizationLevel },
	};
	context.isAnonymized = isAnonymized.call(context);
	return showUpdatesSection.call(context);
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

	describe('isPrivileged', () => {
		it('defaults to false when userProperties are missing', () => {
			expect(isPrivileged.call({ loanData: {} })).toBe(false);
			expect(isPrivileged.call({})).toBe(false);
		});
	});

	describe('showComments', () => {
		describe('privileged user', () => {
			it('shows when the loan is not anonymized', () => {
				expect(evalShowComments({ privileged: true, anonymizationLevel: 'none' })).toBe(true);
			});

			it('treats a missing anonymizationLevel as none', () => {
				expect(evalShowComments({ privileged: true, anonymizationLevel: undefined })).toBe(true);
			});

			it('hides on a full/pii anonymized loan', () => {
				expect(evalShowComments({ privileged: true, anonymizationLevel: 'full' })).toBe(false);
				expect(evalShowComments({ privileged: true, anonymizationLevel: 'pii' })).toBe(false);
			});
		});

		describe('non-privileged user', () => {
			it('hides regardless of anonymization', () => {
				expect(evalShowComments({ privileged: false, anonymizationLevel: 'none' })).toBe(false);
				expect(evalShowComments({ privileged: false, anonymizationLevel: 'full' })).toBe(false);
				expect(evalShowComments({ privileged: false, anonymizationLevel: 'pii' })).toBe(false);
			});
		});
	});
});

describe('FullBorrowerProfile updates section visibility', () => {
	it('shows updates on a non-anonymized loan', () => {
		expect(evalShowUpdates({ showUpdates: true, anonymizationLevel: 'none' })).toBe(true);
		expect(evalShowUpdates({ showUpdates: true, anonymizationLevel: undefined })).toBe(true);
	});

	it('hides updates on a full/pii anonymized loan (MP-3083)', () => {
		expect(evalShowUpdates({ showUpdates: true, anonymizationLevel: 'full' })).toBe(false);
		expect(evalShowUpdates({ showUpdates: true, anonymizationLevel: 'pii' })).toBe(false);
	});

	it('stays hidden once the child has emitted hide-section, even when not anonymized', () => {
		expect(evalShowUpdates({ showUpdates: false, anonymizationLevel: 'none' })).toBe(false);
	});
});
