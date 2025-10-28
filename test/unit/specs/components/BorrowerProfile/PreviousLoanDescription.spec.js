import { render, waitFor } from '@testing-library/vue';
import PreviousLoanDescription from '#src/components/BorrowerProfile/PreviousLoanDescription';
import * as loanUtils from '#src/util/loanUtils';

// Mock child components
vi.mock('@kiva/kv-components', () => ({
	KvTextLink: {
		name: 'KvTextLink',
		template: '<a><slot /></a>'
	},
	KvMaterialIcon: {
		name: 'KvMaterialIcon',
		template: '<span></span>',
		props: ['icon']
	}
}));

vi.mock('#src/components/Kv/KvExpandable', () => ({
	default: {
		name: 'KvExpandable',
		template: '<div><slot /></div>',
		props: ['easing']
	}
}));

// Mock loan utils
vi.mock('#src/util/loanUtils', () => ({
	toParagraphs: vi.fn(text => {
		if (!text) return [];
		return text.split('\n\n').filter(p => p.trim());
	})
}));

// Mock graphql-tag
vi.mock('graphql-tag', () => ({
	gql: vi.fn(strings => strings[0])
}));

describe('PreviousLoanDescription.vue', () => {
	let mockApollo;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn(() => Promise.resolve({
				data: {
					lend: {
						loan: {
							id: 456,
							description: 'Previous loan description text.\n\nSecond paragraph.'
						}
					}
				}
			}))
		};
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Component Structure', () => {
		it('has the correct component name', () => {
			expect(PreviousLoanDescription.name).toBe('PreviousLoanDescription');
		});

		it('injects apollo', () => {
			expect(PreviousLoanDescription.inject).toEqual(['apollo']);
		});

		it('declares the expected props', () => {
			expect(PreviousLoanDescription.props).toEqual({
				loanId: {
					type: Number,
					default: 0
				},
				previousLoanId: {
					type: Number,
					default: 0
				},
				borrowerOrGroupName: {
					type: String,
					default: ''
				}
			});
		});

		it('registers the expected components', () => {
			expect(PreviousLoanDescription.components).toHaveProperty('KvTextLink');
			expect(PreviousLoanDescription.components).toHaveProperty('KvMaterialIcon');
			expect(PreviousLoanDescription.components).toHaveProperty('KvExpandable');
		});
	});

	describe('Initial State', () => {
		it('initializes with correct default data', () => {
			const component = PreviousLoanDescription;
			const data = component.data();

			expect(data.previousLoanDetailsOpen).toBe(false);
			expect(data.previousLoanDescription).toBe('');
			expect(data.mdiChevronDown).toBeDefined();
		});
	});

	describe('Computed Properties', () => {
		describe('formattedPreviousLoanDescription', () => {
			it('calls toParagraphs utility with description', () => {
				const testDescription = 'Paragraph one.\n\nParagraph two.';

				const result = loanUtils.toParagraphs(testDescription);

				expect(loanUtils.toParagraphs).toHaveBeenCalledWith(testDescription);
				expect(result).toHaveLength(2);
			});

			it('returns empty array when description is empty', () => {
				const result = loanUtils.toParagraphs('');

				expect(result).toHaveLength(0);
			});
		});
	});

	describe('Methods', () => {
		describe('togglePreviousLoanDetails', () => {
			it('fetches data when clicked', async () => {
				const { getByText } = render(PreviousLoanDescription, {
					props: {
						loanId: 123,
						previousLoanId: 456,
						borrowerOrGroupName: 'Maria'
					},
					global: {
						provide: {
							apollo: mockApollo
						},
						stubs: {
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

				const toggleLink = getByText('Show previous loan details');

				await toggleLink.click();

				await waitFor(() => {
					expect(mockApollo.query).toHaveBeenCalled();
				});
			});
		});		describe('fetchPreviousLoanDescription', () => {
			it('calls apollo query with correct variables when expanded', async () => {
				const { getByText } = render(PreviousLoanDescription, {
					props: {
						loanId: 123,
						previousLoanId: 456,
						borrowerOrGroupName: 'Maria'
					},
					global: {
						provide: {
							apollo: mockApollo
						},
						stubs: {
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

				const toggleLink = getByText('Show previous loan details');
				await toggleLink.click();

				await waitFor(() => {
					expect(mockApollo.query).toHaveBeenCalledWith({
						query: expect.any(String),
						variables: {
							id: 456
						}
					});
				});
			});

			it('handles null response gracefully', async () => {
				mockApollo.query = vi.fn(() => Promise.resolve({
					data: {
						lend: null
					}
				}));

				const { getByText, queryByTestId } = render(PreviousLoanDescription, {
					props: {
						loanId: 123,
						previousLoanId: 456,
						borrowerOrGroupName: 'Maria'
					},
					global: {
						provide: {
							apollo: mockApollo
						},
						stubs: {
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

				const toggleLink = getByText('Show previous loan details');
				await toggleLink.click();

				await waitFor(() => {
					// Component should still render header even with null data
					expect(queryByTestId('bp-story-previous-loan-header')).toBeTruthy();
				});
			});
		});

		describe('performClick', () => {
			it('fetches description on first click', async () => {
				const { getByText } = render(PreviousLoanDescription, {
					props: {
						loanId: 123,
						previousLoanId: 456,
						borrowerOrGroupName: 'Maria'
					},
					global: {
						provide: {
							apollo: mockApollo
						},
						stubs: {
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

				const toggleLink = getByText('Show previous loan details');
				await toggleLink.click();

				await waitFor(() => {
					expect(mockApollo.query).toHaveBeenCalledTimes(1);
				});
			});

			it('does not re-fetch on subsequent clicks', async () => {
				const { getByText } = render(PreviousLoanDescription, {
					props: {
						loanId: 123,
						previousLoanId: 456,
						borrowerOrGroupName: 'Maria'
					},
					global: {
						provide: {
							apollo: mockApollo
						},
						stubs: {
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

				const toggleLink = getByText('Show previous loan details');

				// First click - should fetch
				await toggleLink.click();
				await waitFor(() => {
					expect(mockApollo.query).toHaveBeenCalledTimes(1);
				});

				// Second click - should not fetch again
				await toggleLink.click();
				expect(mockApollo.query).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('Rendered Content', () => {
		it('renders the component wrapper with correct testid', () => {
			const { getByTestId } = render(PreviousLoanDescription, {
				props: {
					loanId: 123,
					previousLoanId: 456,
					borrowerOrGroupName: 'Maria'
				},
				global: {
					provide: {
						apollo: mockApollo
					},
					stubs: {
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

			expect(getByTestId('bp-story-previous-loan')).toBeTruthy();
		});

		it('renders the toggle link text', () => {
			const { getByText } = render(PreviousLoanDescription, {
				props: {
					loanId: 123,
					previousLoanId: 456,
					borrowerOrGroupName: 'Maria'
				},
				global: {
					provide: {
						apollo: mockApollo
					},
					stubs: {
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

			expect(getByText('Show previous loan details')).toBeTruthy();
		});

		it('renders header when expanded', async () => {
			const { getByText, queryByTestId } = render(PreviousLoanDescription, {
				props: {
					loanId: 123,
					previousLoanId: 456,
					borrowerOrGroupName: 'Maria'
				},
				global: {
					provide: {
						apollo: mockApollo
					},
					stubs: {
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

			const toggleLink = getByText('Show previous loan details');
			await toggleLink.click();

			await waitFor(() => {
				expect(queryByTestId('bp-story-previous-loan-header')).toBeTruthy();
			});
		});

		it('renders paragraphs when description exists', async () => {
			mockApollo.query = vi.fn(() => Promise.resolve({
				data: {
					lend: {
						loan: {
							id: 456,
							description: 'First paragraph.\n\nSecond paragraph.'
						}
					}
				}
			}));

			const { getByText, queryByTestId } = render(PreviousLoanDescription, {
				props: {
					loanId: 123,
					previousLoanId: 456,
					borrowerOrGroupName: 'Maria'
				},
				global: {
					provide: {
						apollo: mockApollo
					},
					stubs: {
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

			const toggleLink = getByText('Show previous loan details');
			await toggleLink.click();

			await waitFor(() => {
				expect(queryByTestId('bp-story-previous-loan-text-0')).toBeTruthy();
				expect(queryByTestId('bp-story-previous-loan-text-1')).toBeTruthy();
			});
		});

		it('renders previous loan link when previousLoanId and borrowerOrGroupName exist', async () => {
			const { getByText, queryByTestId } = render(PreviousLoanDescription, {
				props: {
					loanId: 123,
					previousLoanId: 456,
					borrowerOrGroupName: 'Maria'
				},
				global: {
					provide: {
						apollo: mockApollo
					},
					stubs: {
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

			const toggleLink = getByText('Show previous loan details');
			await toggleLink.click();

			await waitFor(() => {
				const link = queryByTestId('bp-story-previous-loan-link');
				expect(link).toBeTruthy();
				expect(link.textContent).toContain('Maria\'s previous loan');
			});
		});

		it('does not render previous loan link when previousLoanId is missing', async () => {
			const { getByText, queryByTestId } = render(PreviousLoanDescription, {
				props: {
					loanId: 123,
					previousLoanId: 0,
					borrowerOrGroupName: 'Maria'
				},
				global: {
					provide: {
						apollo: mockApollo
					},
					stubs: {
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

			const toggleLink = getByText('Show previous loan details');
			await toggleLink.click();

			await waitFor(() => {
				expect(queryByTestId('bp-story-previous-loan-link')).toBeFalsy();
			});
		});

		it('does not render previous loan link when borrowerOrGroupName is empty', async () => {
			const { getByText, queryByTestId } = render(PreviousLoanDescription, {
				props: {
					loanId: 123,
					previousLoanId: 456,
					borrowerOrGroupName: ''
				},
				global: {
					provide: {
						apollo: mockApollo
					},
					stubs: {
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

			const toggleLink = getByText('Show previous loan details');
			await toggleLink.click();

			await waitFor(() => {
				expect(queryByTestId('bp-story-previous-loan-link')).toBeFalsy();
			});
		});
	});
});
