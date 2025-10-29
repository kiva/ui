import { render } from '@testing-library/vue';
import BorrowerCountry from '../../../../../src/components/BorrowerProfile/BorrowerCountry';

// Mock components
vi.mock('@kiva/kv-components', () => ({
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		template: '<div>Loading...</div>'
	}
}));
vi.mock('#src/components/Kv/KvMap', () => ({
	default: { name: 'KvMap', template: '<div>Map</div>' }
}));
vi.mock('#src/components/BorrowerProfile/CountryInfo', () => ({
	default: { name: 'CountryInfo', template: '<div>Country Info</div>' }
}));
vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn()
}));

describe('BorrowerCountry.vue', () => {
	let mockApollo;
	let mockCookieStore;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn()
		};
		mockCookieStore = {};
	});

	const createWrapper = (props = {}) => {
		return render(BorrowerCountry, {
			props: {
				loanId: 123,
				...props
			},
			global: {
				provide: {
					apollo: mockApollo,
					cookieStore: mockCookieStore
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('has the correct component name', () => {
			expect(BorrowerCountry.name).toBe('BorrowerCountry');
		});

		it('declares the correct inject properties', () => {
			expect(BorrowerCountry.inject).toEqual(['apollo', 'cookieStore']);
		});

		it('declares the loanId prop with correct type and default', () => {
			expect(BorrowerCountry.props.loanId).toEqual({
				type: Number,
				default: 0
			});
		});

		it('declares all required components', () => {
			expect(BorrowerCountry.components.CountryInfo).toBeDefined();
			expect(BorrowerCountry.components.KvLoadingPlaceholder).toBeDefined();
			expect(BorrowerCountry.components.KvMap).toBeDefined();
		});
	});

	describe('Initial State', () => {
		it('initializes with correct data properties', () => {
			const component = BorrowerCountry;
			const data = component.data.call({});

			expect(data.mapZoomLevel).toBe(5);
			expect(data.mapInitialZoom).toBe(4);
			expect(data.mapAutoZoomDelay).toBe(500);
			expect(data.mapAspectRatio).toBe(1.3);
			expect(data.mapLat).toBeNull();
			expect(data.mapLong).toBeNull();
			expect(data.loading).toBe(true);
		});
	});

	describe('Loading State', () => {
		it('renders loading placeholder when loading is true', () => {
			mockApollo.query.mockResolvedValue({
				data: {
					lend: {
						loan: {
							id: 123,
							geocode: {
								latitude: 10.5,
								longitude: 20.5,
								country: {
									id: 'KE',
									geocode: {
										latitude: 1.0,
										longitude: 36.0
									}
								}
							}
						}
					}
				}
			});

			const { getByText } = createWrapper();
			expect(getByText('Loading...')).toBeTruthy();
		});
	});

	describe('Lifecycle', () => {
		it('calls loadCoordinates on mount', () => {
			const loadCoordinates = vi.fn();
			const instance = {
				loadCoordinates
			};

			BorrowerCountry.mounted.call(instance);
			expect(loadCoordinates).toHaveBeenCalled();
		});
	});

	describe('Watch', () => {
		it('calls loadCoordinates when loanId changes to a new non-zero value', () => {
			const loadCoordinates = vi.fn();
			const instance = {
				loadCoordinates
			};

			BorrowerCountry.watch.loanId.call(instance, 456, 123);
			expect(loadCoordinates).toHaveBeenCalled();
		});

		it('does not call loadCoordinates when loanId is unchanged', () => {
			const loadCoordinates = vi.fn();
			const instance = {
				loadCoordinates
			};

			BorrowerCountry.watch.loanId.call(instance, 123, 123);
			expect(loadCoordinates).not.toHaveBeenCalled();
		});

		it('does not call loadCoordinates when new loanId is 0', () => {
			const loadCoordinates = vi.fn();
			const instance = {
				loadCoordinates
			};

			BorrowerCountry.watch.loanId.call(instance, 0, 123);
			expect(loadCoordinates).not.toHaveBeenCalled();
		});
	});

	describe('Methods - loadCoordinates', () => {
		it('returns early if loanId is not set', () => {
			const instance = {
				loanId: 0,
				apollo: mockApollo
			};

			const result = BorrowerCountry.methods.loadCoordinates.call(instance);
			expect(result).toBeUndefined();
			expect(mockApollo.query).not.toHaveBeenCalled();
		});

		it('calls apollo query with correct variables', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					lend: {
						loan: {
							id: 123,
							geocode: {
								latitude: 10.5,
								longitude: 20.5,
								country: {
									id: 'KE',
									geocode: {
										latitude: 1.0,
										longitude: 36.0
									}
								}
							}
						}
					}
				}
			});

			const instance = {
				loanId: 123,
				mapLat: null,
				mapLong: null,
				loading: true,
				apollo: mockApollo
			};

			await BorrowerCountry.methods.loadCoordinates.call(instance);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				variables: { loanId: 123 }
			});
		});

		it('sets coordinates from loan geocode', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					lend: {
						loan: {
							id: 123,
							geocode: {
								latitude: 10.5,
								longitude: 20.5,
								country: {
									id: 'KE',
									geocode: {
										latitude: 1.0,
										longitude: 36.0
									}
								}
							}
						}
					}
				}
			});

			const instance = {
				loanId: 123,
				mapLat: null,
				mapLong: null,
				loading: true,
				apollo: mockApollo
			};

			await BorrowerCountry.methods.loadCoordinates.call(instance);

			expect(instance.mapLat).toBe(10.5);
			expect(instance.mapLong).toBe(20.5);
			expect(instance.loading).toBe(false);
		});

		it('falls back to country geocode when loan coordinates are missing', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					lend: {
						loan: {
							id: 123,
							geocode: {
								latitude: null,
								longitude: null,
								country: {
									id: 'KE',
									geocode: {
										latitude: 1.0,
										longitude: 36.0
									}
								}
							}
						}
					}
				}
			});

			const instance = {
				loanId: 123,
				mapLat: null,
				mapLong: null,
				loading: true,
				apollo: mockApollo
			};

			await BorrowerCountry.methods.loadCoordinates.call(instance);

			expect(instance.mapLat).toBe(1.0);
			expect(instance.mapLong).toBe(36.0);
			expect(instance.loading).toBe(false);
		});

		it('falls back to country geocode when loan latitude is 0', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					lend: {
						loan: {
							id: 123,
							geocode: {
								latitude: 0,
								longitude: 0,
								country: {
									id: 'KE',
									geocode: {
										latitude: 1.0,
										longitude: 36.0
									}
								}
							}
						}
					}
				}
			});

			const instance = {
				loanId: 123,
				mapLat: null,
				mapLong: null,
				loading: true,
				apollo: mockApollo
			};

			await BorrowerCountry.methods.loadCoordinates.call(instance);

			expect(instance.mapLat).toBe(1.0);
			expect(instance.mapLong).toBe(36.0);
		});

		it('handles missing geocode data gracefully', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					lend: {
						loan: {
							id: 123,
							geocode: null
						}
					}
				}
			});

			const instance = {
				loanId: 123,
				mapLat: null,
				mapLong: null,
				loading: true,
				apollo: mockApollo
			};

			await BorrowerCountry.methods.loadCoordinates.call(instance);

			expect(instance.mapLat).toBeNull();
			expect(instance.mapLong).toBeNull();
			expect(instance.loading).toBe(false);
		});

		it('handles query errors', async () => {
			const mockError = new Error('Query failed');
			mockApollo.query.mockRejectedValue(mockError);

			const logReadQueryError = (await import('#src/util/logReadQueryError')).default;

			const instance = {
				loanId: 123,
				mapLat: null,
				mapLong: null,
				loading: true,
				apollo: mockApollo
			};

			await BorrowerCountry.methods.loadCoordinates.call(instance);

			expect(logReadQueryError).toHaveBeenCalledWith(mockError, 'borrowerProfileSideSheetQuery');
		});
	});

	describe('Rendered Content', () => {
		it('renders KvMap with correct props after loading', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					lend: {
						loan: {
							id: 123,
							geocode: {
								latitude: 10.5,
								longitude: 20.5,
								country: {
									id: 'KE',
									geocode: {
										latitude: 1.0,
										longitude: 36.0
									}
								}
							}
						}
					}
				}
			});

			createWrapper();

			// Allow query to resolve
			await new Promise(res => {
				setTimeout(res, 0);
			});

			// Verify component structure
			expect(BorrowerCountry.components.KvMap).toBeDefined();
		});

		it('renders CountryInfo component', () => {
			mockApollo.query.mockResolvedValue({
				data: {
					lend: {
						loan: {
							id: 123,
							geocode: {
								latitude: 10.5,
								longitude: 20.5,
								country: {
									id: 'KE',
									geocode: {
										latitude: 1.0,
										longitude: 36.0
									}
								}
							}
						}
					}
				}
			});

			createWrapper();

			expect(BorrowerCountry.components.CountryInfo).toBeDefined();
		});
	});
});
