import { queryAllPartners } from '#src/util/autoLendingUtils';
import _sortBy from 'lodash/sortBy';

const createResult = count => (Array.from({ length: count }, (_, i) => ({ name: `${i}` })));

describe('autoLendingUtils.js', () => {
	describe('queryAllPartners', () => {
		it('should make only one call if under 100 results and return sorted', async () => {
			const apollo = {
				query: vi.fn().mockReturnValue(
					new Promise(resolve => {
						resolve({
							data: {
								general: {
									partners: {
										totalCount: 50,
										values: createResult(50),
									}
								}
							}
						});
					})
				)
			};

			const result = await queryAllPartners(apollo);

			expect(result).toEqual(_sortBy(createResult(50), 'name'));
			expect(apollo.query).toBeCalledTimes(1);
		});

		it('should make only more calls if over 100 results', async () => {
			const apollo = {
				query: vi.fn().mockReturnValue(
					new Promise(resolve => {
						resolve({
							data: {
								general: {
									partners: {
										totalCount: 250,
										values: createResult(100),
									}
								}
							}
						});
					})
				)
			};

			const result = await queryAllPartners(apollo);

			expect(result.length).toBe(300);
			expect(apollo.query).toBeCalledTimes(3);
		});

		it('should make only more calls if over 100 results and exactly an increment of 100', async () => {
			const apollo = {
				query: vi.fn().mockReturnValue(
					new Promise(resolve => {
						resolve({
							data: {
								general: {
									partners: {
										totalCount: 300,
										values: createResult(100),
									}
								}
							}
						});
					})
				)
			};

			const result = await queryAllPartners(apollo);

			expect(result.length).toBe(300);
			expect(apollo.query).toBeCalledTimes(3);
		});

		it('should filter out "direct to" partners', async () => {
			const apollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						general: {
							partners: {
								totalCount: 3,
								values: [
									{ name: 'Partner A' },
									{ name: 'N/A Direct to borrower' },
									{ name: 'Partner B' }
								]
							}
						}
					}
				})
			};

			const result = await queryAllPartners(apollo);

			expect(result).toHaveLength(2);
			expect(result.some(p => p.name.includes('Direct to'))).toBe(false);
		});

		it('should handle query errors gracefully', async () => {
			const apollo = {
				query: vi.fn().mockRejectedValue(new Error('Query failed'))
			};

			const result = await queryAllPartners(apollo);

			expect(result).toEqual([]);
		});

		it('should handle missing data structure gracefully', async () => {
			const apollo = {
				query: vi.fn().mockResolvedValue({
					data: {}
				})
			};

			const result = await queryAllPartners(apollo);

			expect(result).toEqual([]);
		});

		it('should handle null partner values', async () => {
			const apollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						general: {
							partners: {
								totalCount: 2,
								values: [
									{ name: 'Partner A' },
									null
								]
							}
						}
					}
				})
			};

			const result = await queryAllPartners(apollo);

			expect(result).toHaveLength(1);
			expect(result[0].name).toBe('Partner A');
		});

		it('should handle partners without name field', async () => {
			const apollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						general: {
							partners: {
								totalCount: 2,
								values: [
									{ name: 'Partner A' },
									{ id: 123 }
								]
							}
						}
					}
				})
			};

			const result = await queryAllPartners(apollo);

			expect(result).toHaveLength(1);
		});

		it('should sort partners alphabetically by name', async () => {
			const apollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						general: {
							partners: {
								totalCount: 3,
								values: [
									{ name: 'Zebra Partner' },
									{ name: 'Alpha Partner' },
									{ name: 'Middle Partner' }
								]
							}
						}
					}
				})
			};

			const result = await queryAllPartners(apollo);

			expect(result[0].name).toBe('Alpha Partner');
			expect(result[1].name).toBe('Middle Partner');
			expect(result[2].name).toBe('Zebra Partner');
		});
	});
});
