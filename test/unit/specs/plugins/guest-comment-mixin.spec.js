import guestCommentMixin, {
	GUEST_COMMENT_COMMENT,
	GUEST_COMMENT_LOANID
} from '../../../../src/plugins/guest-comment-mixin';

// Mock the dependencies
vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

vi.mock('#src/graphql/mutation/loanAddComment.graphql', () => ({
	default: 'loanAddCommentMutation'
}));

describe('guest-comment-mixin.js', () => {
	let context;
	let mockApollo;
	let mockCookieStore;
	let mockRoute;

	const flushPromises = () => new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn()
		};

		mockCookieStore = {
			get: vi.fn(),
			remove: vi.fn()
		};

		mockRoute = {
			params: { id: '12345' }
		};

		context = {
			apollo: mockApollo,
			cookieStore: mockCookieStore,
			$route: mockRoute,
			$showTipMsg: vi.fn(),
			submitComment: guestCommentMixin.methods.submitComment
		};

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('constants', () => {
		it('should export GUEST_COMMENT_COMMENT constant', () => {
			expect(GUEST_COMMENT_COMMENT).toBe('guestCommentComment');
		});

		it('should export GUEST_COMMENT_LOANID constant', () => {
			expect(GUEST_COMMENT_LOANID).toBe('guestCommentLoanId');
		});
	});

	describe('mounted', () => {
		it('should submit comment when on correct loan page with guest comment cookies', async () => {
			mockCookieStore.get.mockImplementation(key => {
				if (key === GUEST_COMMENT_COMMENT) return 'Great loan!';
				if (key === GUEST_COMMENT_LOANID) return '12345';
				return null;
			});
			mockApollo.mutate.mockResolvedValue({
				data: { loan: { addComment: true } }
			});

			await guestCommentMixin.mounted.call(context);
			await flushPromises();

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'loanAddCommentMutation',
				variables: {
					id: 12345,
					body: 'Great loan!'
				}
			});
		});

		it('should show success message and remove cookies after successful comment', async () => {
			mockCookieStore.get.mockImplementation(key => {
				if (key === GUEST_COMMENT_COMMENT) return 'Great loan!';
				if (key === GUEST_COMMENT_LOANID) return '12345';
				return null;
			});
			mockApollo.mutate.mockResolvedValue({
				data: { loan: { addComment: true } }
			});

			await guestCommentMixin.mounted.call(context);
			await flushPromises();

			expect(context.$showTipMsg).toHaveBeenCalledWith('Thank you for leaving a comment!');
			expect(mockCookieStore.remove).toHaveBeenCalledWith(GUEST_COMMENT_COMMENT);
			expect(mockCookieStore.remove).toHaveBeenCalledWith(GUEST_COMMENT_LOANID);
		});

		it('should not submit comment when loan IDs do not match', async () => {
			mockCookieStore.get.mockImplementation(key => {
				if (key === GUEST_COMMENT_COMMENT) return 'Great loan!';
				if (key === GUEST_COMMENT_LOANID) return '99999'; // Different loan ID
				return null;
			});

			await guestCommentMixin.mounted.call(context);

			expect(mockApollo.mutate).not.toHaveBeenCalled();
		});

		it('should not submit comment when no comment cookie exists', async () => {
			mockCookieStore.get.mockImplementation(key => {
				if (key === GUEST_COMMENT_LOANID) return '12345';
				return null;
			});

			await guestCommentMixin.mounted.call(context);

			expect(mockApollo.mutate).not.toHaveBeenCalled();
		});

		it('should not submit comment when no loan ID cookie exists', async () => {
			mockCookieStore.get.mockImplementation(key => {
				if (key === GUEST_COMMENT_COMMENT) return 'Great loan!';
				return null;
			});

			await guestCommentMixin.mounted.call(context);

			expect(mockApollo.mutate).not.toHaveBeenCalled();
		});

		it('should handle error when comment is not added', async () => {
			mockCookieStore.get.mockImplementation(key => {
				if (key === GUEST_COMMENT_COMMENT) return 'Great loan!';
				if (key === GUEST_COMMENT_LOANID) return '12345';
				return null;
			});
			mockApollo.mutate.mockResolvedValue({
				data: { loan: { addComment: false } }
			});

			await guestCommentMixin.mounted.call(context);
			await flushPromises();

			expect(context.$showTipMsg).toHaveBeenCalledWith(
				'There was a problem commenting on this loan',
				'error'
			);
		});

		it('should handle mutation error', async () => {
			mockCookieStore.get.mockImplementation(key => {
				if (key === GUEST_COMMENT_COMMENT) return 'Great loan!';
				if (key === GUEST_COMMENT_LOANID) return '12345';
				return null;
			});
			mockApollo.mutate.mockRejectedValue(new Error('Network error'));

			await guestCommentMixin.mounted.call(context);
			await flushPromises();

			expect(context.$showTipMsg).toHaveBeenCalledWith(
				'There was a problem commenting on this loan',
				'error'
			);
		});

		it('should handle missing route params gracefully', async () => {
			context.$route = { params: {} };
			mockCookieStore.get.mockImplementation(key => {
				if (key === GUEST_COMMENT_COMMENT) return 'Great loan!';
				if (key === GUEST_COMMENT_LOANID) return 'undefined';
				return null;
			});

			await guestCommentMixin.mounted.call(context);

			// Should not crash, loan ID undefined won't match any real loan
			expect(mockApollo.mutate).not.toHaveBeenCalled();
		});
	});

	describe('submitComment', () => {
		it('should call Apollo mutate with correct parameters', async () => {
			mockCookieStore.get.mockReturnValue('Test comment');
			mockApollo.mutate.mockResolvedValue({
				data: { loan: { addComment: true } }
			});

			await guestCommentMixin.methods.submitComment.call(context);
			await flushPromises();

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'loanAddCommentMutation',
				variables: {
					id: 12345,
					body: 'Test comment'
				}
			});
		});
	});
});
