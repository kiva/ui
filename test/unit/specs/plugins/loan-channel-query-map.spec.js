import {
	describe, it, expect
} from 'vitest';
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

		describe('spot-check specific channels', () => {
			let channels;

			beforeAll(() => {
				channels = loanChannelQueryMapMixin.data().loanChannelQueryMap;
			});

			it('should have a "women" channel (id: 5)', () => {
				const womenChannel = channels.find(c => c.id === 5);
				expect(womenChannel).toBeDefined();
				expect(womenChannel.url).toBe('women');
				expect(womenChannel.queryParams).toContain('gender=female');
				expect(womenChannel.flssLoanSearch).toHaveProperty('gender', 'female');
			});

			it('should have an "agriculture" channel (id: 8)', () => {
				const agricultureChannel = channels.find(c => c.id === 8);
				expect(agricultureChannel).toBeDefined();
				expect(agricultureChannel.url).toBe('agriculture');
				expect(agricultureChannel.queryParams).toContain('sector=1');
				expect(agricultureChannel.flssLoanSearch).toHaveProperty('sectorId');
				expect(agricultureChannel.flssLoanSearch.sectorId).toContain(1);
			});

			it('should have an "education" channel (id: 4)', () => {
				const educationChannel = channels.find(c => c.id === 4);
				expect(educationChannel).toBeDefined();
				expect(educationChannel.url).toBe('education');
				expect(educationChannel.queryParams).toContain('sector=15');
				expect(educationChannel.flssLoanSearch).toHaveProperty('sectorId');
				expect(educationChannel.flssLoanSearch.sectorId).toContain(15);
			});

			it('should have "ending-soon" channel with sortBy (id: 3)', () => {
				const endingSoonChannel = channels.find(c => c.id === 3);
				expect(endingSoonChannel).toBeDefined();
				expect(endingSoonChannel.url).toBe('ending-soon');
				expect(endingSoonChannel.queryParams).toContain('sortBy=expiringSoon');
				expect(endingSoonChannel.flssLoanSearch).toHaveProperty('sortBy', 'expiringSoon');
			});

			it('should have "kiva-u-s" channel with multiple countries (id: 28)', () => {
				const kivaUSChannel = channels.find(c => c.id === 28);
				expect(kivaUSChannel).toBeDefined();
				expect(kivaUSChannel.url).toBe('kiva-u-s');
				expect(kivaUSChannel.flssLoanSearch).toHaveProperty('countryIsoCode');
				expect(kivaUSChannel.flssLoanSearch.countryIsoCode).toContain('US');
				expect(kivaUSChannel.flssLoanSearch).toHaveProperty('distributionModel', 'DIRECT');
			});

			it('should have "eco-friendly" channel with multiple tags (id: 18)', () => {
				const ecoFriendlyChannel = channels.find(c => c.id === 18);
				expect(ecoFriendlyChannel).toBeDefined();
				expect(ecoFriendlyChannel.url).toBe('eco-friendly');
				expect(ecoFriendlyChannel.flssLoanSearch).toHaveProperty('tagId');
				expect(Array.isArray(ecoFriendlyChannel.flssLoanSearch.tagId)).toBe(true);
				expect(ecoFriendlyChannel.flssLoanSearch.tagId.length).toBeGreaterThan(0);
			});

			it('should have "refugees-and-i-d-ps" channel with theme (id: 32)', () => {
				const refugeesChannel = channels.find(c => c.id === 32);
				expect(refugeesChannel).toBeDefined();
				expect(refugeesChannel.url).toBe('refugees-and-i-d-ps');
				expect(refugeesChannel.flssLoanSearch).toHaveProperty('themeId');
				expect(refugeesChannel.flssLoanSearch.themeId).toContain(28);
			});

			it('should have "matched-loans" channel with isMatchable flag (id: 155)', () => {
				const matchedLoansChannel = channels.find(c => c.id === 155);
				expect(matchedLoansChannel).toBeDefined();
				expect(matchedLoansChannel.url).toBe('matched-loans');
				expect(matchedLoansChannel.flssLoanSearch).toHaveProperty('isMatchable', true);
			});

			it('should have channels with fallbackUrl for unsupported algolia searches', () => {
				const channelsWithFallback = channels.filter(c => c.fallbackUrl);
				expect(channelsWithFallback.length).toBeGreaterThan(0);

				// Check that fallback URL is a valid path
				channelsWithFallback.forEach(channel => {
					expect(channel.fallbackUrl).toMatch(/^\/lend/);
				});
			});

			it('should have "mission-driven-orgs" with large partner list (id: 33)', () => {
				const missionDrivenChannel = channels.find(c => c.id === 33);
				expect(missionDrivenChannel).toBeDefined();
				expect(missionDrivenChannel.url).toBe('mission-driven-orgs');
				expect(missionDrivenChannel.flssLoanSearch).toHaveProperty('partnerId');
				expect(Array.isArray(missionDrivenChannel.flssLoanSearch.partnerId)).toBe(true);
				// Should have a large list of partners
				expect(missionDrivenChannel.flssLoanSearch.partnerId.length).toBeGreaterThan(50);
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
