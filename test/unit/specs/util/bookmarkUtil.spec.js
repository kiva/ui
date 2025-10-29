import bookmarkLoan from '../../../../src/util/bookmarkUtil';

describe('bookmarkUtil', () => {
	describe('bookmarkLoan', () => {
		it('should call apollo.mutate with correct parameters when bookmarking', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ data: { success: true } })
			};
			const loanId = 123;
			const isBookmarked = true;

			await bookmarkLoan(apollo, loanId, isBookmarked);

			expect(apollo.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					loan_id: loanId,
					is_favorite: isBookmarked
				}
			});
		});

		it('should call apollo.mutate with correct parameters when unbookmarking', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ data: { success: true } })
			};
			const loanId = 456;
			const isBookmarked = false;

			await bookmarkLoan(apollo, loanId, isBookmarked);

			expect(apollo.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					loan_id: loanId,
					is_favorite: isBookmarked
				}
			});
		});

		it('should return the promise from apollo.mutate', async () => {
			const expectedResult = { data: { success: true } };
			const apollo = {
				mutate: vi.fn().mockResolvedValue(expectedResult)
			};

			const result = await bookmarkLoan(apollo, 789, true);

			expect(result).toEqual(expectedResult);
		});

		it('should propagate errors from apollo.mutate', async () => {
			const expectedError = new Error('GraphQL error');
			const apollo = {
				mutate: vi.fn().mockRejectedValue(expectedError)
			};

			await expect(bookmarkLoan(apollo, 789, true)).rejects.toThrow('GraphQL error');
		});

		it('should handle string loan IDs', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ data: { success: true } })
			};

			await bookmarkLoan(apollo, '12345', true);

			expect(apollo.mutate).toHaveBeenCalledWith(expect.objectContaining({
				variables: {
					loan_id: '12345',
					is_favorite: true
				}
			}));
		});

		it('should handle zero as loan ID', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ data: { success: true } })
			};

			await bookmarkLoan(apollo, 0, false);

			expect(apollo.mutate).toHaveBeenCalledWith(expect.objectContaining({
				variables: {
					loan_id: 0,
					is_favorite: false
				}
			}));
		});

		it('should be called exactly once per invocation', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ data: { success: true } })
			};

			await bookmarkLoan(apollo, 111, true);

			expect(apollo.mutate).toHaveBeenCalledTimes(1);
		});

		it('should include mutation object in the call', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ data: { success: true } })
			};

			await bookmarkLoan(apollo, 222, true);

			const callArgs = apollo.mutate.mock.calls[0][0];
			expect(callArgs).toHaveProperty('mutation');
			expect(callArgs).toHaveProperty('variables');
		});

		it('should handle large loan ID numbers', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ data: { success: true } })
			};
			const largeLoanId = 9999999999;

			await bookmarkLoan(apollo, largeLoanId, true);

			expect(apollo.mutate).toHaveBeenCalledWith(expect.objectContaining({
				variables: {
					loan_id: largeLoanId,
					is_favorite: true
				}
			}));
		});

		it('should handle negative loan IDs', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ data: { success: true } })
			};

			await bookmarkLoan(apollo, -1, false);

			expect(apollo.mutate).toHaveBeenCalledWith(expect.objectContaining({
				variables: {
					loan_id: -1,
					is_favorite: false
				}
			}));
		});
	});
});
