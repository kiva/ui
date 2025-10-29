import {
	applyLendingReward,
	applyUpcCode,
	applyRedemptionCode,
	validateQueryParams,
	getPromoFromBasket,
} from '../../../../src/util/campaignUtils';

describe('campaignUtils.js', () => {
	describe('applyLendingReward', () => {
		it('should call apollo.mutate with correct mutation and variables', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({ data: {} }),
			};

			await applyLendingReward('promo123', mockApollo);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					promoFundId: 'promo123',
				},
			});
		});

		it('should return the promise from apollo.mutate', async () => {
			const mockResult = { data: { shop: { id: '1' } } };
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue(mockResult),
			};

			const result = await applyLendingReward('promo456', mockApollo);

			expect(result).toEqual(mockResult);
		});
	});

	describe('applyUpcCode', () => {
		it('should call apollo.mutate with universal_code credit type', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({ data: {} }),
			};

			await applyUpcCode('UPC123', mockApollo);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					creditType: 'universal_code',
					redemptionCode: 'UPC123',
				},
			});
		});
	});

	describe('applyRedemptionCode', () => {
		it('should call apollo.mutate with redemption_code credit type', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({ data: {} }),
			};

			await applyRedemptionCode('REDEEM456', mockApollo);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					creditType: 'redemption_code',
					redemptionCode: 'REDEEM456',
				},
			});
		});
	});

	describe('validateQueryParams', () => {
		it('should apply UPC code when upc param is present', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({ data: {} }),
			};

			await validateQueryParams({ upc: 'UPC789' }, mockApollo);

			expect(mockApollo.mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: expect.objectContaining({
						creditType: 'universal_code',
						redemptionCode: 'UPC789',
					}),
				}),
			);
		});

		it('should apply redemption code when promoCode param is present', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({ data: {} }),
			};

			await validateQueryParams({ promoCode: 'PROMO123' }, mockApollo);

			expect(mockApollo.mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: expect.objectContaining({
						creditType: 'redemption_code',
						redemptionCode: 'PROMO123',
					}),
				}),
			);
		});

		it('should apply lending reward when lendingReward param is present', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({ data: {} }),
			};

			await validateQueryParams({ lendingReward: 'reward789' }, mockApollo);

			expect(mockApollo.mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: expect.objectContaining({
						promoFundId: 'reward789',
					}),
				}),
			);
		});

		it('should prioritize upc over other params', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({ data: {} }),
			};

			await validateQueryParams(
				{
					upc: 'UPC123',
					promoCode: 'PROMO456',
					lendingReward: 'reward789',
				},
				mockApollo,
			);

			expect(mockApollo.mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: expect.objectContaining({
						creditType: 'universal_code',
						redemptionCode: 'UPC123',
					}),
				}),
			);
		});

		it('should prioritize promoCode over lendingReward when upc is not present', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({ data: {} }),
			};

			await validateQueryParams(
				{ promoCode: 'PROMO456', lendingReward: 'reward789' },
				mockApollo,
			);

			expect(mockApollo.mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: expect.objectContaining({
						creditType: 'redemption_code',
						redemptionCode: 'PROMO456',
					}),
				}),
			);
		});

		it('should reject with message when no promotion params are present', async () => {
			const mockApollo = { mutate: vi.fn() };

			await expect(validateQueryParams({}, mockApollo)).rejects.toBe('No promotion found.');
		});
	});

	describe('getPromoFromBasket', () => {
		it('should call apollo.query with promoFundId as string', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({ data: {} }),
			};

			await getPromoFromBasket('promo123', mockApollo);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					promoFundId: 'promo123',
				},
				fetchPolicy: 'network-only',
			});
		});

		it('should handle null promoFundId', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({ data: {} }),
			};

			await getPromoFromBasket(null, mockApollo);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					promoFundId: null,
				},
				fetchPolicy: 'network-only',
			});
		});

		it('should convert numeric promoFundId to string', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({ data: {} }),
			};

			await getPromoFromBasket(123, mockApollo);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					promoFundId: '123',
				},
				fetchPolicy: 'network-only',
			});
		});

		it('should pass through undefined promoFundId', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({ data: {} }),
			};

			// When promoFundId is undefined, the function converts it to null in the logic
			await getPromoFromBasket(undefined, mockApollo);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					promoFundId: null,
				},
				fetchPolicy: 'network-only',
			});
		});
	});
});
