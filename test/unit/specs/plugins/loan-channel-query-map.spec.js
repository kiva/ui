import loanChannelQueryMapMixin from '#src/plugins/loan-channel-query-map';

describe('loan-channel-query-map', () => {
	describe('data', () => {
		it('should return an object with loanChannelQueryMap array', () => {
			const data = loanChannelQueryMapMixin.data();
			expect(data).toHaveProperty('loanChannelQueryMap');
			expect(Array.isArray(data.loanChannelQueryMap)).toBe(true);
		});

		it('should have many loan channel entries', () => {
			const data = loanChannelQueryMapMixin.data();
			// The file contains around 150+ entries
			expect(data.loanChannelQueryMap.length).toBeGreaterThan(100);
		});

		describe('loan channel structure validation', () => {
			let channels;

			beforeAll(() => {
				channels = loanChannelQueryMapMixin.data().loanChannelQueryMap;
			});

			it('should have valid structure for all channels', () => {
				channels.forEach(channel => {
					// Required properties
					expect(channel).toHaveProperty('id');
					expect(channel).toHaveProperty('url');

					// Type validation
					expect(typeof channel.id).toBe('number');
					expect(typeof channel.url).toBe('string');

					// Optional properties with type checks
					if (channel.queryParams !== undefined) {
						expect(typeof channel.queryParams).toBe('string');
					}
					if (channel.algoliaParams !== undefined) {
						expect(typeof channel.algoliaParams).toBe('string');
					}
					if (channel.fallbackUrl !== undefined) {
						expect(typeof channel.fallbackUrl).toBe('string');
					}
					if (channel.flssLoanSearch !== undefined) {
						expect(typeof channel.flssLoanSearch).toBe('object');
					}
				});
			});

			it('should have unique ids', () => {
				const ids = channels.map(c => c.id);
				const uniqueIds = new Set(ids);
				expect(ids.length).toBe(uniqueIds.size);
			});

			it('should have unique urls', () => {
				const urls = channels.map(c => c.url);
				const uniqueUrls = new Set(urls);
				expect(urls.length).toBe(uniqueUrls.size);
			});
		});

		describe('flssLoanSearch property types', () => {
			let channels;

			beforeAll(() => {
				channels = loanChannelQueryMapMixin.data().loanChannelQueryMap;
			});

			it('should have valid flssLoanSearch structures', () => {
				const channelsWithFlss = channels.filter(c => c.flssLoanSearch);

				channelsWithFlss.forEach(channel => {
					const flss = channel.flssLoanSearch;

					// Check types of common properties
					if (flss.gender !== undefined) {
						expect(typeof flss.gender).toBe('string');
					}
					if (flss.sectorId !== undefined) {
						expect(Array.isArray(flss.sectorId)).toBe(true);
					}
					if (flss.themeId !== undefined) {
						expect(Array.isArray(flss.themeId)).toBe(true);
					}
					if (flss.tagId !== undefined) {
						expect(Array.isArray(flss.tagId)).toBe(true);
					}
					if (flss.countryIsoCode !== undefined) {
						expect(Array.isArray(flss.countryIsoCode)).toBe(true);
					}
					if (flss.distributionModel !== undefined) {
						expect(typeof flss.distributionModel).toBe('string');
						expect(['DIRECT', 'FIELDPARTNER']).toContain(flss.distributionModel);
					}
					if (flss.sortBy !== undefined) {
						expect(typeof flss.sortBy).toBe('string');
					}
					if (flss.isIndividual !== undefined) {
						expect(typeof flss.isIndividual).toBe('boolean');
					}
					if (flss.isMatchable !== undefined) {
						expect(typeof flss.isMatchable).toBe('boolean');
					}
				});
			});
		});
	});
});
