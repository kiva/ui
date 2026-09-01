import CommentsAndWhySpecial from '#src/components/BorrowerProfile/CommentsAndWhySpecial';

const { showWhySpecial, showSection } = CommentsAndWhySpecial.computed;

function evalShowWhySpecial(whySpecial) {
	return showWhySpecial.call({ whySpecial });
}

// showSection depends on enhancedComments + showWhySpecial; resolve showWhySpecial from whySpecial.
function evalShowSection({ comments = [], whySpecial = '' } = {}) {
	const context = { enhancedComments: comments, whySpecial };
	context.showWhySpecial = showWhySpecial.call(context);
	return showSection.call(context);
}

describe('CommentsAndWhySpecial why-special slide visibility (MP-3083)', () => {
	describe('showWhySpecial', () => {
		it('is false when there is no why-special text', () => {
			expect(evalShowWhySpecial('')).toBe(false);
			expect(evalShowWhySpecial(null)).toBe(false);
			expect(evalShowWhySpecial(undefined)).toBe(false);
		});

		it('is true when why-special text is present', () => {
			expect(evalShowWhySpecial('she is a hard worker')).toBe(true);
		});
	});

	describe('showSection', () => {
		it('shows when there is at least one comment, even with no why-special', () => {
			expect(evalShowSection({ comments: [{ id: 1 }], whySpecial: '' })).toBe(true);
		});

		it('shows when there is why-special text, even with no comments', () => {
			expect(evalShowSection({ comments: [], whySpecial: 'she is a hard worker' })).toBe(true);
		});

		it('hides when there are no comments and no why-special text', () => {
			expect(evalShowSection({ comments: [], whySpecial: '' })).toBe(false);
		});
	});
});
