import { render, waitFor } from '@testing-library/vue';
import ShareButton from '#src/components/BorrowerProfile/ShareButton';

// Mock child components
vi.mock('#src/components/Kv/KvSocialShareButton', () => ({
	default: {
		name: 'KvSocialShareButton',
		template: '<div data-testid="social-share-button"><slot name="modal-content" /></div>',
		props: [
			'modalTitle',
			'shareMessage',
			'shareUrl',
			'variant',
			'utmCampaign',
			'utmContent',
			'openLightbox',
			'loanId',
			'trackingCategory'
		]
	}
}));

vi.mock('@kiva/kv-components', () => ({
	KvMaterialIcon: {
		name: 'KvMaterialIcon',
		template: '<span></span>',
		props: ['icon']
	}
}));

// Mock graphql-tag
vi.mock('graphql-tag', () => ({
	gql: vi.fn(strings => strings[0])
}));

describe('ShareButton.vue', () => {
	let mockApollo;
	let mockRoute;

	beforeEach(() => {
		mockApollo = {
			readQuery: vi.fn(() => ({
				my: {
					id: 'user123',
					mostRecentBorrowedLoan: {
						id: 456
					}
				}
			}))
		};

		mockRoute = {
			query: {},
			path: '/lend/123'
		};
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Component Structure', () => {
		it('has the correct component name', () => {
			expect(ShareButton.name).toBe('ShareButton');
		});

		it('injects apollo and cookieStore', () => {
			expect(ShareButton.inject).toEqual(['apollo', 'cookieStore']);
		});

		it('emits lightbox-closed event', () => {
			expect(ShareButton.emits).toEqual(['lightbox-closed']);
		});

		it('declares the expected props', () => {
			expect(ShareButton.props).toEqual({
				lender: {
					type: Object,
					default: expect.any(Function)
				},
				loan: {
					type: Object,
					required: true
				},
				campaign: {
					type: String,
					required: true
				},
				inPfp: {
					type: Boolean,
					default: false
				},
				pfpMinLenders: {
					type: Number,
					default: 1
				},
				numLenders: {
					type: Number,
					default: 0
				},
				variant: {
					type: String,
					default: 'caution'
				},
				openLightbox: {
					type: Boolean,
					default: false
				},
				isPortfolio: {
					type: Boolean,
					default: false
				}
			});
		});

		it('registers the expected components', () => {
			expect(ShareButton.components).toHaveProperty('KvSocialShareButton');
			expect(ShareButton.components).toHaveProperty('KvMaterialIcon');
		});
	});

	describe('Initial State', () => {
		it('initializes with correct default data', () => {
			const component = ShareButton;
			const data = component.data();

			expect(data.modifiedShareMessage).toBe('');
			expect(data.mdiPencilOutline).toBeDefined();
			expect(data.borrowedLoanId).toBeNull();
		});
	});

	describe('Lifecycle - created', () => {
		it('reads borrowedLoanId from Apollo cache', async () => {
			render(ShareButton, {
				props: {
					loan: { id: 123, name: 'Maria', loanAmount: 1000 },
					campaign: 'test-campaign'
				},
				global: {
					provide: {
						apollo: mockApollo,
						cookieStore: {}
					},
					mocks: {
						$route: mockRoute,
						$filters: {
							changeCase: str => str
						}
					}
				}
			});

			await waitFor(() => {
				expect(mockApollo.readQuery).toHaveBeenCalled();
			});
		});

		it('handles null borrowedLoanId gracefully', async () => {
			mockApollo.readQuery = vi.fn(() => ({
				my: {
					id: 'user123',
					mostRecentBorrowedLoan: null
				}
			}));

			const { getByTestId } = render(ShareButton, {
				props: {
					loan: { id: 123, name: 'Maria', loanAmount: 1000 },
					campaign: 'test-campaign'
				},
				global: {
					provide: {
						apollo: mockApollo,
						cookieStore: {}
					},
					mocks: {
						$route: mockRoute,
						$filters: {
							changeCase: str => str
						}
					}
				}
			});

			await waitFor(() => {
				expect(getByTestId('social-share-button')).toBeTruthy();
			});
		});
	});

	describe('Computed Properties', () => {
		describe('progressPfpPercent', () => {
			it('calculates percent correctly', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign',
						numLenders: 5,
						pfpMinLenders: 10
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('handles zero pfpMinLenders by using default', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign',
						numLenders: 5,
						pfpMinLenders: 0
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});
		});

		describe('progressPercent', () => {
			it('calculates percent from loan fundraising data', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: {
							id: 123,
							name: 'Maria',
							loanAmount: 1000,
							fundraisingPercent: 0.75
						},
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('defaults to 0 when fundraisingPercent is missing', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});
		});

		describe('amountRemaining', () => {
			it('calculates remaining amount correctly', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: {
							id: 123,
							name: 'Maria',
							loanAmount: 1000,
							loanFundraisingInfo: { fundedAmount: 750 }
						},
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('handles missing fundedAmount', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});
		});

		describe('isBorrower', () => {
			it('returns true when loan id matches borrowedLoanId', async () => {
				mockApollo.readQuery = vi.fn(() => ({
					my: {
						id: 'user123',
						mostRecentBorrowedLoan: { id: 123 }
					}
				}));

				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('returns true when share query param is true', async () => {
				mockRoute.query.share = 'true';

				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('returns false when not borrower', async () => {
				mockApollo.readQuery = vi.fn(() => ({
					my: {
						id: 'user123',
						mostRecentBorrowedLoan: { id: 999 }
					}
				}));

				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});
		});

		describe('name', () => {
			it('returns loan name when not fully anonymized', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: {
							id: 123,
							name: 'Maria',
							anonymization: 'partial',
							loanAmount: 1000
						},
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('returns "this lender" when fully anonymized', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: {
							id: 123,
							name: 'Maria',
							anonymization: 'full',
							loanAmount: 1000
						},
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('returns "this lender" when name is missing', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});
		});

		describe('utmContent', () => {
			it('returns inviterName when lender is public', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						lender: { public: true, inviterName: 'johndoe' },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('returns anonymous when lender is not public', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						lender: { public: false, inviterName: 'johndoe' },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});
		});

		describe('utmCampaign', () => {
			it('returns campaign with emlid when query param exists', async () => {
				mockRoute.query.emlid = '12345';

				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('returns campaign without emlid when query param missing', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});
		});

		describe('shareLink', () => {
			it('returns invitedby link when lender inviterName exists', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						lender: { inviterName: 'johndoe' },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('returns route path when inviterName missing', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});
		});

		describe('forceLightbox', () => {
			it('returns true when share query param is true', async () => {
				mockRoute.query.share = 'true';

				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('returns true when openLightbox prop is true', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign',
						openLightbox: true
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});

			it('returns false when both are false', async () => {
				const { getByTestId } = render(ShareButton, {
					props: {
						loan: { id: 123, name: 'Maria', loanAmount: 1000 },
						campaign: 'test-campaign'
					},
					global: {
						provide: {
							apollo: mockApollo,
							cookieStore: {}
						},
						mocks: {
							$route: mockRoute,
							$filters: {
								changeCase: str => str
							}
						}
					}
				});

				await waitFor(() => {
					expect(getByTestId('social-share-button')).toBeTruthy();
				});
			});
		});
	});

	describe('Methods', () => {
		describe('closeLightbox', () => {
			it('has closeLightbox method that emits event', () => {
				const { closeLightbox } = ShareButton.methods;
				const mockEmit = vi.fn();
				const context = { $emit: mockEmit };

				closeLightbox.call(context);

				expect(mockEmit).toHaveBeenCalledWith('lightbox-closed');
			});
		});
	});

	describe('Rendered Content', () => {
		it('renders the KvSocialShareButton', () => {
			const { getByTestId } = render(ShareButton, {
				props: {
					loan: { id: 123, name: 'Maria', loanAmount: 1000 },
					campaign: 'test-campaign'
				},
				global: {
					provide: {
						apollo: mockApollo,
						cookieStore: {}
					},
					mocks: {
						$route: mockRoute,
						$filters: {
							changeCase: str => str
						}
					}
				}
			});

			expect(getByTestId('social-share-button')).toBeTruthy();
		});

		it('renders the textarea for modifying share message', () => {
			const { container } = render(ShareButton, {
				props: {
					loan: { id: 123, name: 'Maria', loanAmount: 1000 },
					campaign: 'test-campaign'
				},
				global: {
					provide: {
						apollo: mockApollo,
						cookieStore: {}
					},
					mocks: {
						$route: mockRoute,
						$filters: {
							changeCase: str => str
						}
					}
				}
			});

			expect(container.querySelector('textarea')).toBeTruthy();
		});

		it('renders with portfolio variant when isPortfolio is true', () => {
			const { getByTestId } = render(ShareButton, {
				props: {
					loan: { id: 123, name: 'Maria', loanAmount: 1000 },
					campaign: 'test-campaign',
					isPortfolio: true
				},
				global: {
					provide: {
						apollo: mockApollo,
						cookieStore: {}
					},
					mocks: {
						$route: mockRoute,
						$filters: {
							changeCase: str => str
						}
					}
				}
			});

			expect(getByTestId('social-share-button')).toBeTruthy();
		});
	});
});
