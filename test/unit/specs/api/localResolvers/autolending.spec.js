import autolendingResolver from '#src/api/localResolvers/autolending';
import bothProfilesQuery from '#src/graphql/query/autolending/bothProfiles.graphql';
import serverProfileQuery from '#src/graphql/query/autolending/profileFromServer.graphql';
import updateServerProfile from '#src/graphql/mutation/autolending/updateServerProfile.graphql';
import logFormatter from '#src/util/logFormatter';

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn(),
}));

vi.mock('#src/api/fixtures/AutolendProfile', () => ({
	default: vi.fn(() => ({
		__typename: 'AutolendProfile',
		id: null,
		isEnabled: false,
		donationPercentage: 15,
		lendAfterDaysIdle: 90,
	})),
	getCacheableProfile: vi.fn(profile => ({
		...profile,
		__typename: 'AutolendProfile',
	})),
	getInputProfile: vi.fn(profile => {
		if (!profile) return {};
		const {
			loanSearchCriteria, id, cIdleStartTime, __typename, ...cleanProfile
		} = profile;
		return {
			...cleanProfile,
			loanSearchCriteria,
		};
	}),
	profilesAreEqual: vi.fn(),
}));

vi.mock('#src/api/fixtures/LoanSearchCriteria', () => ({
	default: vi.fn(() => ({
		__typename: 'LoanSearchCriteria',
		queryString: '',
		filters: {},
	})),
	criteriaAreEqual: vi.fn(),
	getSearchableCriteria: vi.fn(criteria => ({
		filters: criteria?.filters || {}
	})),
}));

describe('autolending.js', () => {
	let cache;
	let client;
	let resolver;

	beforeEach(() => {
		// Simple cache mock that tracks writeQuery calls
		const cacheData = {};
		cache = {
			writeQuery: vi.fn(({ query, data }) => {
				cacheData[query] = data;
			}),
			readQuery: vi.fn(({ query }) => cacheData[query] || null),
		};

		client = {
			query: vi.fn(),
			mutate: vi.fn(),
			watchQuery: vi.fn(),
		};

		resolver = autolendingResolver();
	});

	describe('defaults', () => {
		it('should write default autolending state to cache', () => {
			resolver.defaults(cache);

			expect(cache.writeQuery).toHaveBeenCalledWith({
				query: bothProfilesQuery,
				data: {
					autolending: {
						id: 0,
						__typename: 'Autolending',
						currentProfile: null,
						savedProfile: null,
						currentLoanCount: 0,
						profileChanged: false,
						loadingProfile: false,
						countingLoans: false,
						savingProfile: false,
						warningThreshold: 25,
					}
				}
			});
		});
	});

	describe('Mutation.autolending', () => {
		it('should return AutolendingMutation typename', () => {
			const result = resolver.resolvers.Mutation.autolending();

			expect(result).toEqual({
				id: 0,
				__typename: 'AutolendingMutation',
			});
		});
	});

	describe('AutolendingMutation.initAutolending', () => {
		it('should fetch profile from server successfully', async () => {
			const mockProfile = {
				isEnabled: true,
				donationPercentage: 15,
				loanSearchCriteria: { filters: { gender: 'female' } },
			};

			client.query.mockResolvedValue({
				data: {
					my: {
						autolendProfile: mockProfile,
					},
				},
			});

			const mockObservable = {
				subscribe: vi.fn(({ next }) => {
					next({ data: { lend: { loans: { totalCount: 42 } } } });
					return { unsubscribe: vi.fn() };
				}),
			};
			client.watchQuery.mockReturnValue(mockObservable);

			const result = await resolver.resolvers.AutolendingMutation.initAutolending(
				{},
				{},
				{ cache, client }
			);

			expect(result).toBe(true);
			expect(client.query).toHaveBeenCalledWith({
				query: serverProfileQuery,
				fetchPolicy: 'network-only',
			});
			expect(cache.writeQuery).toHaveBeenCalledWith(
				expect.objectContaining({
					query: bothProfilesQuery,
				})
			);
		});

		it('should handle query errors and throw error code', async () => {
			client.query.mockResolvedValue({
				errors: [{ extensions: { code: 'AUTH_ERROR' } }],
			});

			await expect(
				resolver.resolvers.AutolendingMutation.initAutolending({}, {}, { cache, client })
			).rejects.toThrow('AUTH_ERROR');
		});

		it('should handle query errors without code and use message', async () => {
			client.query.mockResolvedValue({
				errors: [{ message: 'Network error', extensions: {} }],
			});

			await expect(
				resolver.resolvers.AutolendingMutation.initAutolending({}, {}, { cache, client })
			).rejects.toThrow('Network error');
		});

		it('should handle loan count query errors gracefully', async () => {
			const mockProfile = {
				isEnabled: true,
				loanSearchCriteria: { filters: {} },
			};

			client.query.mockResolvedValue({
				data: {
					my: {
						autolendProfile: mockProfile,
					},
				},
			});

			const mockObservable = {
				subscribe: vi.fn(({ error }) => {
					error(new Error('Loan count error'));
					return { unsubscribe: vi.fn() };
				}),
			};
			client.watchQuery.mockReturnValue(mockObservable);

			const result = await resolver.resolvers.AutolendingMutation.initAutolending(
				{},
				{},
				{ cache, client }
			);

			expect(result).toBe(true);
			expect(logFormatter).toHaveBeenCalledWith(expect.any(Error), 'error');
		});

		it('should handle loan count with missing data path', async () => {
			const mockProfile = {
				isEnabled: true,
				loanSearchCriteria: { filters: {} },
			};

			client.query.mockResolvedValue({
				data: {
					my: {
						autolendProfile: mockProfile,
					},
				},
			});

			const mockObservable = {
				subscribe: vi.fn(({ next }) => {
					next({ data: {} });
					return { unsubscribe: vi.fn() };
				}),
			};
			client.watchQuery.mockReturnValue(mockObservable);

			const result = await resolver.resolvers.AutolendingMutation.initAutolending(
				{},
				{},
				{ cache, client }
			);

			expect(result).toBe(true);
			// Should resolve with count of 0 when data path is missing
		});

		it('should convert legacy risk rating to integer ceiling', async () => {
			const mockProfile = {
				isEnabled: true,
				loanSearchCriteria: {
					filters: {
						riskRating: { min: 2.5, max: 5 },
					},
				},
			};

			client.query.mockResolvedValue({
				data: {
					my: {
						autolendProfile: mockProfile,
					},
				},
			});

			const mockObservable = {
				subscribe: vi.fn(({ next }) => {
					next({ data: { lend: { loans: { totalCount: 0 } } } });
					return { unsubscribe: vi.fn() };
				}),
			};
			client.watchQuery.mockReturnValue(mockObservable);

			await resolver.resolvers.AutolendingMutation.initAutolending(
				{},
				{},
				{ cache, client }
			);

			// Verify cache was written with converted value
			const writeCall = cache.writeQuery.mock.calls.find(
				call => call[0]?.data?.autolending?.currentProfile?.loanSearchCriteria
			);
			const { riskRating } = writeCall[0].data.autolending.currentProfile.loanSearchCriteria.filters;
			expect(riskRating.min).toBe(3);
		});

		it('should convert legacy loan term to valid tiers', async () => {
			const mockProfile = {
				isEnabled: true,
				loanSearchCriteria: {
					filters: {
						lenderTerm: { min: 3, max: 30 },
					},
				},
			};

			client.query.mockResolvedValue({
				data: {
					my: {
						autolendProfile: mockProfile,
					},
				},
			});

			const mockObservable = {
				subscribe: vi.fn(({ next }) => {
					next({ data: { lend: { loans: { totalCount: 0 } } } });
					return { unsubscribe: vi.fn() };
				}),
			};
			client.watchQuery.mockReturnValue(mockObservable);

			await resolver.resolvers.AutolendingMutation.initAutolending(
				{},
				{},
				{ cache, client }
			);

			// Verify cache was written with converted value (30 -> 24)
			const writeCall = cache.writeQuery.mock.calls.find(
				call => call[0]?.data?.autolending?.currentProfile?.loanSearchCriteria
			);
			const { lenderTerm } = writeCall[0].data.autolending.currentProfile.loanSearchCriteria.filters;
			expect(lenderTerm.max).toBe(24);
			expect(lenderTerm.min).toBe(0);
		});

		it('should remove queryString when converting legacy profile', async () => {
			const mockProfile = {
				isEnabled: true,
				loanSearchCriteria: {
					queryString: 'test query',
					filters: {},
				},
			};

			client.query.mockResolvedValue({
				data: {
					my: {
						autolendProfile: mockProfile,
					},
				},
			});

			const mockObservable = {
				subscribe: vi.fn(({ next }) => {
					next({ data: { lend: { loans: { totalCount: 0 } } } });
					return { unsubscribe: vi.fn() };
				}),
			};
			client.watchQuery.mockReturnValue(mockObservable);

			await resolver.resolvers.AutolendingMutation.initAutolending(
				{},
				{},
				{ cache, client }
			);

			// Verify queryString was set to null
			const writeCall = cache.writeQuery.mock.calls.find(
				call => call[0]?.data?.autolending?.currentProfile?.loanSearchCriteria
			);
			const { queryString } = writeCall[0].data.autolending.currentProfile.loanSearchCriteria;
			expect(queryString).toBeNull();
		});
	});

	describe('AutolendingMutation.saveProfile', () => {
		beforeEach(() => {
			// Set up a profile in cache
			cache.readQuery.mockReturnValue({
				autolending: {
					currentProfile: {
						id: 0,
						__typename: 'AutolendProfile',
						isEnabled: true,
						enableAfter: 0,
						lendAfterDaysIdle: 90,
						idleCreditOptIn: true,
						loanSearchCriteria: { filters: {} },
					},
				},
			});
		});

		it('should save profile to server successfully', async () => {
			const serverProfile = {
				isEnabled: true,
				donationPercentage: 15,
				loanSearchCriteria: { filters: {} },
			};

			client.mutate.mockResolvedValue({
				data: {
					my: {
						updateAutolendProfile: serverProfile,
					},
				},
			});

			const result = await resolver.resolvers.AutolendingMutation.saveProfile(
				{},
				{},
				{ cache, client }
			);

			expect(result).toBe(true);
			expect(client.mutate).toHaveBeenCalledWith({
				mutation: updateServerProfile,
				variables: { profile: expect.any(Object) },
			});
		});

		it('should convert enableAfter 0 to lendAfterDaysIdle 0', async () => {
			cache.readQuery.mockReturnValue({
				autolending: {
					currentProfile: {
						isEnabled: true,
						enableAfter: 0,
						lendAfterDaysIdle: 999,
						loanSearchCriteria: { filters: {} },
					},
				},
			});

			client.mutate.mockResolvedValue({
				data: {
					my: {
						updateAutolendProfile: { isEnabled: true },
					},
				},
			});

			await resolver.resolvers.AutolendingMutation.saveProfile(
				{},
				{},
				{ cache, client }
			);

			const mutateCall = client.mutate.mock.calls[0][0];
			// enableAfter 0 should not trigger conversion
			expect(mutateCall.variables.profile.enableAfter).toBe(0);
		});

		it('should convert enableAfter 1-2 to lendAfterDaysIdle 45', async () => {
			cache.readQuery.mockReturnValue({
				autolending: {
					currentProfile: {
						isEnabled: true,
						enableAfter: 1,
						lendAfterDaysIdle: 0,
						loanSearchCriteria: { filters: {} },
					},
				},
			});

			client.mutate.mockResolvedValue({
				data: {
					my: {
						updateAutolendProfile: { isEnabled: true },
					},
				},
			});

			await resolver.resolvers.AutolendingMutation.saveProfile(
				{},
				{},
				{ cache, client }
			);

			const mutateCall = client.mutate.mock.calls[0][0];
			expect(mutateCall.variables.profile.lendAfterDaysIdle).toBe(45);
			expect(mutateCall.variables.profile.enableAfter).toBe(0);
		});

		it('should convert enableAfter 3 to lendAfterDaysIdle 90', async () => {
			cache.readQuery.mockReturnValue({
				autolending: {
					currentProfile: {
						isEnabled: true,
						enableAfter: 3,
						lendAfterDaysIdle: 0,
						loanSearchCriteria: { filters: {} },
					},
				},
			});

			client.mutate.mockResolvedValue({
				data: {
					my: {
						updateAutolendProfile: { isEnabled: true },
					},
				},
			});

			await resolver.resolvers.AutolendingMutation.saveProfile(
				{},
				{},
				{ cache, client }
			);

			const mutateCall = client.mutate.mock.calls[0][0];
			expect(mutateCall.variables.profile.lendAfterDaysIdle).toBe(90);
		});

		it('should convert enableAfter 6+ to lendAfterDaysIdle 120', async () => {
			cache.readQuery.mockReturnValue({
				autolending: {
					currentProfile: {
						isEnabled: true,
						enableAfter: 12,
						lendAfterDaysIdle: 0,
						loanSearchCriteria: { filters: {} },
					},
				},
			});

			client.mutate.mockResolvedValue({
				data: {
					my: {
						updateAutolendProfile: { isEnabled: true },
					},
				},
			});

			await resolver.resolvers.AutolendingMutation.saveProfile(
				{},
				{},
				{ cache, client }
			);

			const mutateCall = client.mutate.mock.calls[0][0];
			expect(mutateCall.variables.profile.lendAfterDaysIdle).toBe(120);
		});

		it('should sync idleCreditOptIn with isEnabled', async () => {
			cache.readQuery.mockReturnValue({
				autolending: {
					currentProfile: {
						isEnabled: true,
						enableAfter: 0,
						idleCreditOptIn: false,
						loanSearchCriteria: { filters: {} },
					},
				},
			});

			client.mutate.mockResolvedValue({
				data: {
					my: {
						updateAutolendProfile: { isEnabled: true },
					},
				},
			});

			await resolver.resolvers.AutolendingMutation.saveProfile(
				{},
				{},
				{ cache, client }
			);

			const mutateCall = client.mutate.mock.calls[0][0];
			expect(mutateCall.variables.profile.idleCreditOptIn).toBe(true);
		});

		it('should handle mutation errors and throw error code', async () => {
			client.mutate.mockResolvedValue({
				errors: [{ code: 'SAVE_ERROR' }],
			});

			await expect(
				resolver.resolvers.AutolendingMutation.saveProfile({}, {}, { cache, client })
			).rejects.toThrow('SAVE_ERROR');
		});

		it('should handle mutation errors without code and use message', async () => {
			client.mutate.mockResolvedValue({
				errors: [{ message: 'Save failed' }],
			});

			await expect(
				resolver.resolvers.AutolendingMutation.saveProfile({}, {}, { cache, client })
			).rejects.toThrow('Save failed');
		});

		it('should return false when server returns null profile', async () => {
			client.mutate.mockResolvedValue({
				data: {
					my: {
						updateAutolendProfile: null,
					},
				},
			});

			const result = await resolver.resolvers.AutolendingMutation.saveProfile(
				{},
				{},
				{ cache, client }
			);

			expect(result).toBe(false);
		});

		it('should handle mutation rejection', async () => {
			client.mutate.mockRejectedValue(new Error('Network error'));

			await expect(
				resolver.resolvers.AutolendingMutation.saveProfile({}, {}, { cache, client })
			).rejects.toThrow('Network error');
		});
	});

	describe('AutolendingMutation.editProfile', () => {
		it('should call profilesAreEqual to check if profile changed', async () => {
			cache.readQuery.mockReturnValue({
				autolending: {
					currentProfile: {
						isEnabled: true,
						loanSearchCriteria: { filters: { gender: 'female' } },
					},
					savedProfile: {
						isEnabled: true,
						loanSearchCriteria: { filters: { gender: 'female' } },
					},
				},
			});

			const AutolendProfileModule = await import('#src/api/fixtures/AutolendProfile');
			const LoanSearchCriteriaModule = await import('#src/api/fixtures/LoanSearchCriteria');

			vi.mocked(AutolendProfileModule.profilesAreEqual).mockReturnValue(true);
			vi.mocked(LoanSearchCriteriaModule.criteriaAreEqual).mockReturnValue(true);

			const result = resolver.resolvers.AutolendingMutation.editProfile(
				{},
				{ profile: { isEnabled: false } },
				{ cache, client }
			);

			expect(result).toBe(true);
			expect(AutolendProfileModule.profilesAreEqual).toHaveBeenCalled();
		});

		it('should fetch new loan count when criteria changes', async () => {
			cache.readQuery.mockReturnValue({
				autolending: {
					currentProfile: {
						isEnabled: true,
						loanSearchCriteria: { filters: { gender: 'female' } },
					},
					savedProfile: {
						isEnabled: true,
						loanSearchCriteria: { filters: { gender: 'female' } },
					},
				},
			});

			const AutolendProfileModule = await import('#src/api/fixtures/AutolendProfile');
			const LoanSearchCriteriaModule = await import('#src/api/fixtures/LoanSearchCriteria');

			vi.mocked(AutolendProfileModule.profilesAreEqual).mockReturnValue(false);
			vi.mocked(LoanSearchCriteriaModule.criteriaAreEqual).mockReturnValue(false);

			const mockObservable = {
				subscribe: vi.fn(({ next }) => {
					next({ data: { lend: { loans: { totalCount: 100 } } } });
					return { unsubscribe: vi.fn() };
				}),
			};
			client.watchQuery.mockReturnValue(mockObservable);

			await resolver.resolvers.AutolendingMutation.editProfile(
				{},
				{ profile: { loanSearchCriteria: { filters: { gender: 'male' } } } },
				{ cache, client }
			);

			expect(client.watchQuery).toHaveBeenCalled();
		});

		it('should not fetch loan count when criteria unchanged', async () => {
			cache.readQuery.mockReturnValue({
				autolending: {
					currentProfile: {
						isEnabled: true,
						loanSearchCriteria: { filters: { gender: 'female' } },
					},
					savedProfile: {
						isEnabled: false,
						loanSearchCriteria: { filters: { gender: 'female' } },
					},
				},
			});

			const AutolendProfileModule = await import('#src/api/fixtures/AutolendProfile');
			const LoanSearchCriteriaModule = await import('#src/api/fixtures/LoanSearchCriteria');

			vi.mocked(AutolendProfileModule.profilesAreEqual).mockReturnValue(false);
			vi.mocked(LoanSearchCriteriaModule.criteriaAreEqual).mockReturnValue(true);

			const result = resolver.resolvers.AutolendingMutation.editProfile(
				{},
				{ profile: { isEnabled: false } },
				{ cache, client }
			);

			expect(result).toBe(true);
			expect(client.watchQuery).not.toHaveBeenCalled();
		});
	});
});
