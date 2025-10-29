import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvSocialShareButton from '../../../../../src/components/Kv/KvSocialShareButton';

describe('KvSocialShareButton.vue', () => {
	const defaultProps = {
		utmCampaign: 'test-campaign',
		shareUrl: '/lend/1234',
		shareMessage: 'Check this out!'
	};

	const mockApollo = {
		query: vi.fn()
	};

	const mockAppConfig = {
		host: 'www.kiva.org'
	};

	const mockRoute = {
		hash: '',
		query: {}
	};

	it('renders a share button by default', () => {
		const { container } = render(KvSocialShareButton, {
			props: defaultProps,
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		const button = container.querySelector('[data-testid="bp-share-cta-button"]');
		expect(button).toBeTruthy();
	});

	it('renders default slot content', () => {
		const { getByText } = render(KvSocialShareButton, {
			props: defaultProps,
			slots: {
				default: 'Share This'
			},
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		expect(getByText('Share This')).toBeTruthy();
	});

	it('renders default text "Share" when no slot provided', () => {
		const { getByText } = render(KvSocialShareButton, {
			props: defaultProps,
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		expect(getByText('Share')).toBeTruthy();
	});

	it('does not render button when variant is hidden', () => {
		const { container } = render(KvSocialShareButton, {
			props: {
				...defaultProps,
				variant: 'hidden'
			},
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		const button = container.querySelector('[data-testid="bp-share-cta-button"]');
		expect(button).toBeFalsy();
	});

	it('opens lightbox when share button is clicked', async () => {
		const user = userEvent.setup();
		const { container } = render(KvSocialShareButton, {
			props: defaultProps,
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		const button = container.querySelector('[data-testid="bp-share-cta-button"]');
		await user.click(button);

		// After clicking, the component's isLightboxVisible should be true
		// We can verify the lightbox-related functionality works by checking
		// that the share buttons are present (which only render when lightbox is open)
		const facebookButton = container.querySelector('[data-testid="share-facebook-button"]');
		expect(facebookButton).toBeTruthy();
	});

	it('renders social share buttons in lightbox', () => {
		const { container } = render(KvSocialShareButton, {
			props: {
				...defaultProps,
				openLightbox: true
			},
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		expect(container.querySelector('[data-testid="share-facebook-button"]')).toBeTruthy();
		expect(container.querySelector('[data-testid="share-bluesky-button"]')).toBeTruthy();
		expect(container.querySelector('[data-testid="share-linkedin-button"]')).toBeTruthy();
		expect(container.querySelector('[data-testid="share-copy-link-button"]')).toBeTruthy();
	});

	it('renders custom modal title', () => {
		const { getByText } = render(KvSocialShareButton, {
			props: {
				...defaultProps,
				modalTitle: 'Custom Share Title',
				openLightbox: true
			},
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		expect(getByText('Custom Share Title')).toBeTruthy();
	});

	it('renders default modal title when not provided', () => {
		const { getByText } = render(KvSocialShareButton, {
			props: {
				...defaultProps,
				openLightbox: true
			},
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		expect(getByText('Help spread the word')).toBeTruthy();
	});

	it('renders Facebook share button', () => {
		const { getByText } = render(KvSocialShareButton, {
			props: {
				...defaultProps,
				openLightbox: true
			},
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		expect(getByText('Facebook')).toBeTruthy();
	});

	it('renders LinkedIn share button', () => {
		const { getByText } = render(KvSocialShareButton, {
			props: {
				...defaultProps,
				openLightbox: true
			},
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		expect(getByText('LinkedIn')).toBeTruthy();
	});

	it('renders Bluesky share button', () => {
		const { getByText } = render(KvSocialShareButton, {
			props: {
				...defaultProps,
				openLightbox: true
			},
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$appConfig: mockAppConfig,
					$route: mockRoute
				},
				directives: {
					'kv-track-event': {}
				}
			}
		});

		expect(getByText('Bluesky')).toBeTruthy();
	});
});
