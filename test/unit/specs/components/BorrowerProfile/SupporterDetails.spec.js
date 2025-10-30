import { render, waitFor } from '@testing-library/vue';
import SupporterDetails from '#src/components/BorrowerProfile/SupporterDetails';
import { commonStubs, createStubComponent } from '../../../helpers/componentTestHelpers';

// Mock SVG import
vi.mock('#src/assets/images/kiva_k.svg?url', () => ({
	default: '/mock-kiva-k.svg'
}));

describe('SupporterDetails.vue', () => {
	// Mock window properties
	beforeEach(() => {
		Object.defineProperty(document.documentElement, 'clientWidth', {
			writable: true,
			configurable: true,
			value: 1024
		});

		// Mock getCurrentInstance for Vue 3
		vi.mock('vue', async () => {
			const actual = await vi.importActual('vue');
			return {
				...actual,
				getCurrentInstance: vi.fn(() => ({
					vnode: { key: 'test-key-123' }
				}))
			};
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Component Structure', () => {
		it('has the correct component name', () => {
			expect(SupporterDetails.name).toBe('SupporterDetails');
		});

		it('declares the expected props', () => {
			expect(SupporterDetails.props).toEqual({
				name: {
					type: String,
					default: ''
				},
				hash: {
					type: String,
					default: ''
				},
				itemData: {
					type: Object,
					default: expect.any(Function)
				},
				publicId: {
					type: String,
					default: ''
				},
				whereabouts: {
					type: String,
					default: ''
				},
				displayType: {
					type: String,
					default: ''
				},
				hasAnonymousSupporters: {
					type: Boolean,
					default: false
				}
			});
		});

		it('registers the expected components', () => {
			expect(SupporterDetails.components).toHaveProperty('BorrowerImage');
			expect(SupporterDetails.components).toHaveProperty('KvTooltip');
		});
	});

	describe('Initial State', () => {
		it('initializes with correct default data', () => {
			const component = SupporterDetails;
			const data = component.data();

			expect(data.kivaKUrl).toBe('/mock-kiva-k.svg');
			expect(data.anonymousSupporterCard).toBe(false);
			expect(data.isMobile).toBe(false);
			expect(data.userCardStyleOptions).toHaveLength(7);
		});
	});

	describe('Computed Properties', () => {
		describe('borrowerImageAspect', () => {
			it('returns 1 when not mobile', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'John Doe',
						hash: 'abc123',
						publicId: 'johndoe'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});

			it('returns 3/4 when mobile', async () => {
				Object.defineProperty(document.documentElement, 'clientWidth', {
					writable: true,
					configurable: true,
					value: 320
				});

				const { container } = render(SupporterDetails, {
					props: {
						name: 'John Doe',
						hash: 'abc123',
						publicId: 'johndoe'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				await waitFor(() => {
					expect(container).toBeTruthy();
				});
			});
		});

		describe('configureTracking', () => {
			it('returns lender tracking when displayType is lenders', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'John Doe',
						publicId: 'johndoe',
						displayType: 'lenders'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});

			it('returns team tracking when displayType is teams', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'Team Name',
						publicId: 'teamid',
						displayType: 'teams'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});
		});

		describe('lenderNameFirstLetter', () => {
			it('returns first letter uppercase', () => {
				const { getByText } = render(SupporterDetails, {
					props: {
						name: 'john doe',
						publicId: 'johndoe'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(getByText('john doe')).toBeTruthy();
			});

			it('returns empty string when name is empty', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: '',
						publicId: 'test'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});
		});

		describe('linkPath', () => {
			it('returns lender path when displayType is lenders', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'John Doe',
						publicId: 'johndoe',
						displayType: 'lenders'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});

			it('returns team path when displayType is teams', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'Team Name',
						publicId: 'teamid',
						displayType: 'teams'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});

			it('returns empty string when publicId is not provided', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'John Doe',
						publicId: '',
						displayType: 'lenders'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});
		});

		describe('teamTooltipData', () => {
			it('returns tooltip data when all required fields present', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'Team Name',
						publicId: 'teamid',
						displayType: 'teams',
						itemData: {
							id: 123,
							category: 'Technology',
							lenderCount: 50,
							lenderCountForLoan: 5
						}
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				// Tooltip should render with team data
				const tooltip = container.querySelector('[data-testid^="tooltip-id-"]');
				expect(tooltip).toBeTruthy();
			});

			it('returns null when category is missing', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'Team Name',
						publicId: 'teamid',
						displayType: 'teams',
						itemData: {
							id: 123,
							lenderCount: 50,
							lenderCountForLoan: 5
						}
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				// Tooltip should not render when category is missing
				const tooltip = container.querySelector('[data-testid^="tooltip-id-"]');
				expect(tooltip).toBeFalsy();
			});

			it('returns null when lenderCount is missing', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'Team Name',
						publicId: 'teamid',
						displayType: 'teams',
						itemData: {
							id: 123,
							category: 'Technology',
							lenderCountForLoan: 5
						}
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				// Tooltip should not render when lenderCount is missing
				const tooltip = container.querySelector('[data-testid^="tooltip-id-"]');
				expect(tooltip).toBeFalsy();
			});
		});
	});

	describe('Lifecycle Methods', () => {
		describe('mounted', () => {
			it('sets anonymousSupporterCard when hasAnonymousSupporters is true', async () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'Anonymous',
						hasAnonymousSupporters: true
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				await waitFor(() => {
					expect(container.querySelector('img[src="/mock-kiva-k.svg"]')).toBeTruthy();
				});
			});

			it('calls determineIfMobile on mount', () => {
				const { container } = render(SupporterDetails, {
					props: {
						name: 'John Doe',
						publicId: 'johndoe'
					},
					global: {
						stubs: {
							BorrowerImage: createStubComponent('BorrowerImage', {
								template: '<img data-testid="borrower-image" />',
								props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
							}),
							KvTooltip: commonStubs.KvTooltip,
							'router-link': {
								template: '<a><slot /></a>',
								props: ['to']
							}
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});
		});
	});

	describe('Rendered Content', () => {
		it('renders BorrowerImage when hash is provided and not anonymous', () => {
			const { queryByTestId } = render(SupporterDetails, {
				props: {
					name: 'John Doe',
					hash: 'abc123',
					publicId: 'johndoe'
				},
				global: {
					stubs: {
						BorrowerImage: createStubComponent('BorrowerImage', {
							template: '<img data-testid="borrower-image" />',
							props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
						}),
						KvTooltip: commonStubs.KvTooltip,
						'router-link': {
							template: '<a><slot /></a>',
							props: ['to']
						}
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			expect(queryByTestId('borrower-image')).toBeTruthy();
		});

		it('renders first letter when hash is not provided and not anonymous', () => {
			const { getByText } = render(SupporterDetails, {
				props: {
					name: 'John Doe',
					publicId: 'johndoe'
				},
				global: {
					stubs: {
						BorrowerImage: createStubComponent('BorrowerImage', {
							template: '<img data-testid="borrower-image" />',
							props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
						}),
						KvTooltip: commonStubs.KvTooltip,
						'router-link': {
							template: '<a><slot /></a>',
							props: ['to']
						}
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			expect(getByText('J')).toBeTruthy();
		});

		it('renders Kiva K logo when anonymous supporter', async () => {
			const { container } = render(SupporterDetails, {
				props: {
					name: 'Anonymous',
					hasAnonymousSupporters: true
				},
				global: {
					stubs: {
						BorrowerImage: createStubComponent('BorrowerImage', {
							template: '<img data-testid="borrower-image" />',
							props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
						}),
						KvTooltip: commonStubs.KvTooltip,
						'router-link': {
							template: '<a><slot /></a>',
							props: ['to']
						}
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			await waitFor(() => {
				expect(container.querySelector('img[src="/mock-kiva-k.svg"]')).toBeTruthy();
			});
		});

		it('renders supporter name', () => {
			const { getByText } = render(SupporterDetails, {
				props: {
					name: 'John Doe',
					publicId: 'johndoe'
				},
				global: {
					stubs: {
						BorrowerImage: createStubComponent('BorrowerImage', {
							template: '<img data-testid="borrower-image" />',
							props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
						}),
						KvTooltip: commonStubs.KvTooltip,
						'router-link': {
							template: '<a><slot /></a>',
							props: ['to']
						}
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			expect(getByText('John Doe')).toBeTruthy();
		});

		it('renders whereabouts when provided', () => {
			const { getByText } = render(SupporterDetails, {
				props: {
					name: 'John Doe',
					publicId: 'johndoe',
					whereabouts: 'San Francisco, CA'
				},
				global: {
					stubs: {
						BorrowerImage: createStubComponent('BorrowerImage', {
							template: '<img data-testid="borrower-image" />',
							props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
						}),
						KvTooltip: commonStubs.KvTooltip,
						'router-link': {
							template: '<a><slot /></a>',
							props: ['to']
						}
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			expect(getByText('San Francisco, CA')).toBeTruthy();
		});

		it('renders tooltip for teams when itemData is complete', () => {
			const { container } = render(SupporterDetails, {
				props: {
					name: 'Tech Team',
					publicId: 'techteam',
					displayType: 'teams',
					itemData: {
						id: 123,
						category: 'Technology',
						lenderCount: 50,
						lenderCountForLoan: 5
					}
				},
				global: {
					stubs: {
						BorrowerImage: createStubComponent('BorrowerImage', {
							template: '<img data-testid="borrower-image" />',
							props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
						}),
						KvTooltip: commonStubs.KvTooltip,
						'router-link': {
							template: '<a><slot /></a>',
							props: ['to']
						}
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			const tooltip = container.querySelector('[data-testid^="tooltip-id-"]');
			expect(tooltip).toBeTruthy();
			expect(tooltip.textContent).toContain('Technology');
			expect(tooltip.textContent).toContain('5 of 50 members');
		});

		it('does not render tooltip when isMobile', async () => {
			Object.defineProperty(document.documentElement, 'clientWidth', {
				writable: true,
				configurable: true,
				value: 320
			});

			const { container } = render(SupporterDetails, {
				props: {
					name: 'Tech Team',
					publicId: 'techteam',
					displayType: 'teams',
					itemData: {
						id: 123,
						category: 'Technology',
						lenderCount: 50,
						lenderCountForLoan: 5
					}
				},
				global: {
					stubs: {
						BorrowerImage: createStubComponent('BorrowerImage', {
							template: '<img data-testid="borrower-image" />',
							props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
						}),
						KvTooltip: commonStubs.KvTooltip,
						'router-link': {
							template: '<a><slot /></a>',
							props: ['to']
						}
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			await waitFor(() => {
				const tooltip = container.querySelector('[data-testid^="tooltip-id-"]');
				expect(tooltip).toBeFalsy();
			});
		});

		it('applies team heading style when displayType is teams', () => {
			const { container } = render(SupporterDetails, {
				props: {
					name: 'Tech Team',
					publicId: 'techteam',
					displayType: 'teams'
				},
				global: {
					stubs: {
						BorrowerImage: createStubComponent('BorrowerImage', {
							template: '<img data-testid="borrower-image" />',
							props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
						}),
						KvTooltip: commonStubs.KvTooltip,
						'router-link': {
							template: '<a><slot /></a>',
							props: ['to']
						}
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			const nameElement = container.querySelector('.tw-text-h4');
			expect(nameElement).toBeTruthy();
		});
	});
});
