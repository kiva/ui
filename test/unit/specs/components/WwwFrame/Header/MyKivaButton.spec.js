import { render } from '@testing-library/vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import MyKivaButton from '#src/components/WwwFrame/Header/MyKivaButton';

// Mock kv-components
vi.mock('@kiva/kv-components', () => ({
	isLegacyPlaceholderAvatar: vi.fn(id => id === '' || id === '0'),
	KvLoadingPlaceholder: { template: '<div data-testid="loading-placeholder"></div>' },
	KvMaterialIcon: { template: '<span data-testid="material-icon"></span>', props: ['icon', 'style'] }
}));

// Create a simple router for testing
const router = createRouter({
	history: createMemoryHistory(),
	routes: [
		{ path: '/portfolio', name: 'portfolio', component: { template: '<div>Portfolio</div>' } }
	]
});

describe('MyKivaButton', () => {
	const mockFilters = {
		numeral: (val, format) => {
			if (format === '$0') return `$${Math.floor(val)}`;
			return String(val);
		}
	};

	it('should display balance', async () => {
		const { getByText } = render(MyKivaButton, {
			props: {
				balance: 50
			},
			global: {
				plugins: [router],
				mocks: {
					$filters: mockFilters
				}
			}
		});

		getByText('$50');
	});

	it('should show loading placeholder when user data is loading', () => {
		const { getByTestId } = render(MyKivaButton, {
			props: {
				isUserDataLoading: true,
				balance: 25
			},
			global: {
				plugins: [router],
				mocks: { $filters: mockFilters }
			}
		});

		getByTestId('loading-placeholder');
	});

	it('should show default profile icon when profilePicId is default', () => {
		const { getByTestId } = render(MyKivaButton, {
			props: {
				profilePicId: '0',
				profilePic: ''
			},
			global: {
				plugins: [router],
				mocks: { $filters: mockFilters }
			}
		});

		const icon = getByTestId('material-icon');
		expect(icon).toBeTruthy();
	});

	it('should show custom profile picture when not default', () => {
		const { container } = render(MyKivaButton, {
			props: {
				profilePicId: '12345',
				profilePic: 'https://example.com/profile.jpg'
			},
			global: {
				plugins: [router],
				mocks: { $filters: mockFilters }
			}
		});

		const img = container.querySelector('img');
		expect(img?.src).toBe('https://example.com/profile.jpg');
	});

	it('should handle zero balance', () => {
		const { getByText } = render(MyKivaButton, {
			props: {
				balance: 0
			},
			global: {
				plugins: [router],
				mocks: { $filters: mockFilters }
			}
		});

		getByText('$0');
	});

	it('should handle string balance', () => {
		const { getByText } = render(MyKivaButton, {
			props: {
				balance: '100'
			},
			global: {
				plugins: [router],
				mocks: { $filters: mockFilters }
			}
		});

		getByText('$100');
	});

	it('should show loading state with custom profile pic set', () => {
		const { getByTestId } = render(MyKivaButton, {
			props: {
				isUserDataLoading: true,
				profilePicId: '12345',
				profilePic: 'https://example.com/profile.jpg'
			},
			global: {
				plugins: [router],
				mocks: { $filters: mockFilters }
			}
		});

		// Should show loading placeholder, not the profile pic
		getByTestId('loading-placeholder');
	});
});
