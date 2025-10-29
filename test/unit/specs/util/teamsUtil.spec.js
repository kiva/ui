import {
	teamCategories,
	teamCategoryFriendlyName,
	fetchTeams,
	fetchLeaderboard,
	fetchGoals,
} from '../../../../src/util/teamsUtil';

describe('teamsUtil.js', () => {
	describe('teamCategories', () => {
		it('should export an array of team categories', () => {
			expect(Array.isArray(teamCategories)).toBe(true);
			expect(teamCategories.length).toBeGreaterThan(0);
		});

		it('should have correct structure for each category', () => {
			teamCategories.forEach(category => {
				expect(category).toHaveProperty('value');
				expect(category).toHaveProperty('label');
			});
		});

		it('should include "All Categories" as first option', () => {
			expect(teamCategories[0]).toEqual({
				value: '',
				label: '-- All Categories --',
			});
		});
	});

	describe('teamCategoryFriendlyName', () => {
		it('should return the friendly name for a valid category value', () => {
			expect(teamCategoryFriendlyName('AlumniGroups')).toBe('Alumni Groups');
			expect(teamCategoryFriendlyName('Businesses')).toBe('Businesses');
			expect(teamCategoryFriendlyName('Clubs')).toBe('Clubs');
			expect(teamCategoryFriendlyName('CollegesUniversities')).toBe('Colleges/Universities');
			expect(teamCategoryFriendlyName('CommonInterest')).toBe('Common Interest');
			expect(teamCategoryFriendlyName('FieldPartnerFans')).toBe('Field Partner Fans');
			expect(teamCategoryFriendlyName('ReligiousCongregations')).toBe('Religious Congregations');
		});

		it('should return undefined for an invalid category value', () => {
			expect(teamCategoryFriendlyName('InvalidCategory')).toBeUndefined();
		});

		it('should return "All Categories" for empty string', () => {
			expect(teamCategoryFriendlyName('')).toBe('-- All Categories --');
		});
	});

	describe('fetchTeams', () => {
		it('should call apollo.query with correct variables', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: { community: { teams: [] } },
				}),
			};

			await fetchTeams(mockApollo, 'mostRecent', 'Businesses', 'member', 'test', 10, 20);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					sortOption: 'mostRecent',
					category: 'Businesses',
					membershipType: 'member',
					queryString: 'test',
					offset: 10,
					limit: 20,
				},
			});
		});

		it('should use default offset of 0 when not provided', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: { community: { teams: [] } },
				}),
			};

			await fetchTeams(mockApollo);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					sortOption: undefined,
					category: undefined,
					membershipType: undefined,
					queryString: undefined,
					offset: 0,
					limit: undefined,
				},
			});
		});

		it('should return teams data on success', async () => {
			const mockTeams = [{ id: '1', name: 'Team A' }];
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: { community: { teams: mockTeams } },
				}),
			};

			const result = await fetchTeams(mockApollo);

			expect(result).toEqual(mockTeams);
		});

		it('should handle errors gracefully', async () => {
			const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
			const mockApollo = {
				query: vi.fn().mockRejectedValue(new Error('Network error')),
			};

			const result = await fetchTeams(mockApollo);

			expect(result).toBeUndefined();
			expect(consoleLogSpy).toHaveBeenCalledWith('Fetching teams failed:', 'Network error');

			consoleLogSpy.mockRestore();
		});
	});

	describe('fetchLeaderboard', () => {
		it('should call apollo.query with correct variables', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: { community: { leaderboards: [] } },
				}),
			};

			await fetchLeaderboard(mockApollo, 'Businesses');

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					category: 'Businesses',
				},
			});
		});

		it('should handle undefined category', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: { community: { leaderboards: [] } },
				}),
			};

			await fetchLeaderboard(mockApollo);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					category: undefined,
				},
			});
		});

		it('should return leaderboards data on success', async () => {
			const mockLeaderboards = [{ rank: 1, name: 'Top Team' }];
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: { community: { leaderboards: mockLeaderboards } },
				}),
			};

			const result = await fetchLeaderboard(mockApollo, 'Sports');

			expect(result).toEqual(mockLeaderboards);
		});

		it('should handle errors gracefully', async () => {
			const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
			const mockApollo = {
				query: vi.fn().mockRejectedValue(new Error('Query failed')),
			};

			const result = await fetchLeaderboard(mockApollo);

			expect(result).toBeUndefined();
			expect(consoleLogSpy).toHaveBeenCalledWith('Loading leaderboards failed:', 'Query failed');

			consoleLogSpy.mockRestore();
		});
	});

	describe('fetchGoals', () => {
		it('should call apollo.query with limit and filters', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: { goals: [] },
				}),
			};
			const filters = { category: 'test', status: 'active' };

			await fetchGoals(mockApollo, 10, filters);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					category: 'test',
					status: 'active',
					limit: 10,
				},
			});
		});

		it('should use default limit of null when not provided', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: { goals: [] },
				}),
			};

			await fetchGoals(mockApollo);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: {
					limit: null,
				},
			});
		});

		it('should return goals data on success', async () => {
			const mockGoals = [{ id: '1', amount: 1000 }];
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: { goals: mockGoals },
				}),
			};

			const result = await fetchGoals(mockApollo, 5);

			expect(result).toEqual(mockGoals);
		});

		it('should handle errors gracefully', async () => {
			const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
			const mockApollo = {
				query: vi.fn().mockRejectedValue(new Error('Goals query error')),
			};

			const result = await fetchGoals(mockApollo);

			expect(result).toBeUndefined();
			expect(consoleLogSpy).toHaveBeenCalledWith('Team Goals query failed:', 'Goals query error');

			consoleLogSpy.mockRestore();
		});
	});
});
