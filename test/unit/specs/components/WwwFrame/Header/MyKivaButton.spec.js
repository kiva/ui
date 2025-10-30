import { render } from '@testing-library/vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import MyKivaButton from '#src/components/WwwFrame/Header/MyKivaButton';

// Mock isLegacyPlaceholderAvatar utility function - keep this as it's a utility, not a component
// Use importOriginal to get actual components from the module
vi.mock('@kiva/kv-components', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		isLegacyPlaceholderAvatar: vi.fn(id => id === '' || id === '0')
	};
});

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

	const renderComponent = (props = {}) => {
		return render(MyKivaButton, {
			props,
			global: {
				plugins: [router],
				mocks: {
					$filters: mockFilters
				}
			}
		});
	};

	it('should display balance', async () => {
		const { getByText } = renderComponent({ balance: 50 });
		getByText('$50');
	});

	it('should show loading placeholder when user data is loading', () => {
		const { container } = renderComponent({
			isUserDataLoading: true,
			balance: 25
		});
		// The loading placeholder should be visible
		const placeholder = container.querySelector('.loading-placeholder');
		expect(placeholder).toBeTruthy();
	});

	it('should show default profile icon when profilePicId is default', () => {
		const { container } = renderComponent({
			profilePicId: '0',
			profilePic: ''
		});
		// KvMaterialIcon renders as an SVG
		const icon = container.querySelector('svg');
		expect(icon).toBeTruthy();
		// Icon should be visible (not display: none)
		const iconWrapper = icon?.parentElement;
		expect(iconWrapper?.style.display).not.toBe('none');
	});

	it('should show custom profile picture when not default', () => {
		const { container } = renderComponent({
			profilePicId: '12345',
			profilePic: 'https://example.com/profile.jpg'
		});
		const img = container.querySelector('img');
		expect(img?.src).toBe('https://example.com/profile.jpg');
	});

	it('should handle zero balance', () => {
		const { getByText } = renderComponent({ balance: 0 });
		getByText('$0');
	});

	it('should handle string balance', () => {
		const { getByText } = renderComponent({ balance: '100' });
		getByText('$100');
	});

	it('should show loading state with custom profile pic set', () => {
		const { container } = renderComponent({
			isUserDataLoading: true,
			profilePicId: '12345',
			profilePic: 'https://example.com/profile.jpg'
		});
		// Should show loading placeholder, not the profile pic
		const placeholder = container.querySelector('.loading-placeholder');
		expect(placeholder).toBeTruthy();
	});
});
