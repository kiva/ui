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
	});
});
