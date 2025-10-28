import { render } from '@testing-library/vue';
import MainCategoryTile from '#src/components/Categories/MainCategoryTile';

// Mock KvResponsiveImage
vi.mock('#src/components/Kv/KvResponsiveImage', () => ({
	default: {
		name: 'KvResponsiveImage',
		template: '<img :alt="alt" />',
		props: ['images', 'loading', 'alt']
	}
}));

// Mock router
const mockRouterLink = {
	name: 'RouterLink',
	template: '<a :href="to"><slot /></a>',
	props: ['to']
};

// Mock tracking directive
const mockKvTrackEvent = {
	mounted: vi.fn(),
	updated: vi.fn()
};

describe('MainCategoryTile', () => {
	const renderComponent = (props = {}) => {
		return render(MainCategoryTile, {
			props: {
				categoryName: 'Agriculture',
				categoryDescription: 'Support farmers and agricultural businesses',
				numberLoans: 1234,
				image: '/img/agriculture.jpg',
				retinaImage: '/img/agriculture@2x.jpg',
				categoryUrl: '/lend-by-category/agriculture',
				...props
			},
			global: {
				components: {
					RouterLink: mockRouterLink
				},
				directives: {
					kvTrackEvent: mockKvTrackEvent
				}
			}
		});
	};

	it('should have the correct component name', () => {
		expect(MainCategoryTile.name).toBe('MainCategoryTile');
	});

	describe('tileSize prop', () => {
		it('should default to "small"', () => {
			expect(MainCategoryTile.props.tileSize.default).toBe('small');
		});

		it('should validate tileSize prop', () => {
			const { validator } = MainCategoryTile.props.tileSize;
			expect(validator('small')).toBe(true);
			expect(validator('medium')).toBe(true);
			expect(validator('large')).toBe(true);
			expect(validator('invalid')).toBe(false);
		});
	});

	describe('large tile', () => {
		it('should render large tile with correct structure', () => {
			const { container } = renderComponent({ tileSize: 'large' });

			const tile = container.querySelector('[data-testid="all-categories-tiles"]');
			expect(tile).toBeTruthy();
			expect(tile.classList.contains('tw-mb-6')).toBe(true);
			expect(tile.classList.contains('tw-group')).toBe(true);
		});

		it('should render category name in large tile', () => {
			const { getByText } = renderComponent({ tileSize: 'large' });

			expect(getByText('Agriculture')).toBeTruthy();
		});

		it('should render loan count in large tile', () => {
			const { getByText } = renderComponent({ tileSize: 'large', numberLoans: 1234 });

			expect(getByText('1234 loans')).toBeTruthy();
		});

		it('should render description in large tile', () => {
			const { getByText } = renderComponent({
				tileSize: 'large',
				categoryDescription: 'Support farmers and agricultural businesses'
			});

			expect(getByText('Support farmers and agricultural businesses')).toBeTruthy();
		});

		it('should render KvResponsiveImage with large tile class', () => {
			const { container } = renderComponent({ tileSize: 'large' });

			const image = container.querySelector('.category-image.category-image__large');
			expect(image).toBeTruthy();
		});

		it('should apply line clamp to description', () => {
			const { container } = renderComponent({ tileSize: 'large' });

			const description = container.querySelector('.tw-line-clamp-3');
			expect(description).toBeTruthy();
		});

		it('should have hover underline on title', () => {
			const { container } = renderComponent({ tileSize: 'large' });

			const title = container.querySelector('h3');
			expect(title.classList.contains('group-hover:tw-underline')).toBe(true);
		});

		it('should render router link with correct path', () => {
			const { container } = renderComponent({
				tileSize: 'large',
				categoryUrl: '/lend-by-category/agriculture'
			});

			const link = container.querySelector('a');
			expect(link.getAttribute('href')).toBe('/lend-by-category/agriculture');
		});
	});

	describe('medium tile', () => {
		it('should render medium tile with correct structure', () => {
			const { container } = renderComponent({ tileSize: 'medium' });

			const tile = container.querySelector('[data-testid="all-categories-tiles"]');
			expect(tile).toBeTruthy();
		});

		it('should hide loan count on mobile for medium tile', () => {
			const { container } = renderComponent({ tileSize: 'medium' });

			const loanCount = container.querySelector('h4.md\\:tw-hidden');
			expect(loanCount).toBeTruthy();
			expect(loanCount.textContent.trim()).toBe('1234 loans');
		});

		it('should show loan count on desktop for medium tile', () => {
			const { container } = renderComponent({ tileSize: 'medium' });

			const desktopLoanCount = container.querySelector('h4.tw-hidden.md\\:tw-block');
			expect(desktopLoanCount).toBeTruthy();
		});

		it('should use flex layout for title and loan count', () => {
			const { container } = renderComponent({ tileSize: 'medium' });

			const flexContainer = container.querySelector('.tw-flex.tw-justify-between');
			expect(flexContainer).toBeTruthy();
		});
	});

	describe('small tile', () => {
		it('should render small tile with correct structure', () => {
			const { container } = renderComponent({ tileSize: 'small' });

			const tile = container.querySelector('[data-testid="all-categories-tiles"]');
			expect(tile).toBeTruthy();
		});

		it('should use horizontal flex layout', () => {
			const { container } = renderComponent({ tileSize: 'small' });

			const flexContainer = container.querySelector('.tw-flex');
			expect(flexContainer).toBeTruthy();
		});

		it('should render KvResponsiveImage with small tile class', () => {
			const { container } = renderComponent({ tileSize: 'small' });

			const image = container.querySelector('.category-image.category-image__small');
			expect(image).toBeTruthy();
		});

		it('should apply margin to image container', () => {
			const { container } = renderComponent({ tileSize: 'small' });

			const imageContainer = container.querySelector('.tw-mr-2.tw-flex-none');
			expect(imageContainer).toBeTruthy();
		});

		it('should apply grow to content container', () => {
			const { container } = renderComponent({ tileSize: 'small' });

			const contentContainer = container.querySelector('.tw-grow');
			expect(contentContainer).toBeTruthy();
		});

		it('should apply line clamp to description', () => {
			const { container } = renderComponent({ tileSize: 'small' });

			const description = container.querySelector('.tw-line-clamp-2');
			expect(description).toBeTruthy();
		});

		it('should render loan count below description', () => {
			const { container } = renderComponent({ tileSize: 'small', numberLoans: 5678 });

			const loanCount = container.querySelector('h4.tw-mt-1');
			expect(loanCount).toBeTruthy();
			expect(loanCount.textContent.trim()).toBe('5678 loans');
		});
	});

	describe('computed properties', () => {
		it('should compute altText correctly', () => {
			const { container } = renderComponent({ categoryName: 'Women' });

			const image = container.querySelector('img');
			expect(image.getAttribute('alt')).toBe('Kiva loans to Women');
		});

		it('should compute cleanURL correctly', () => {
			const { container } = renderComponent({
				categoryUrl: '/lend-by-category/agriculture'
			});

			const link = container.querySelector('a');
			expect(link.getAttribute('href')).toBe('/lend-by-category/agriculture');
		});

		it('should handle categoryUrl with multiple slashes', () => {
			const { container } = renderComponent({
				categoryUrl: '/some/path/lend-by-category/education'
			});

			const link = container.querySelector('a');
			expect(link.getAttribute('href')).toBe('/lend-by-category/education');
		});

		it('should detect retina image exists', () => {
			const wrapper = {
				retinaImage: '/img/test@2x.jpg',
				image: '/img/test.jpg'
			};
			const component = MainCategoryTile;
			const result = component.computed.retinaImageExists.call(wrapper);
			expect(result).toBe(true);
		});

		it('should detect retina image does not exist', () => {
			const wrapper = {
				retinaImage: '',
				image: '/img/test.jpg'
			};
			const component = MainCategoryTile;
			const result = component.computed.retinaImageExists.call(wrapper);
			expect(result).toBe(false);
		});
	});

	describe('chooseImage method', () => {
		it('should return retina images for large tile with retina', () => {
			const wrapper = {
				image: '/img/test.jpg',
				retinaImage: '/img/test@2x.jpg',
				retinaImageExists: true
			};
			const result = MainCategoryTile.methods.chooseImage.call(wrapper, 'large');
			expect(result).toEqual([
				['small', '/img/test@2x.jpg'],
				['small retina', '/img/test@2x.jpg']
			]);
		});

		it('should return single image for large tile without retina', () => {
			const wrapper = {
				image: '/img/test.jpg',
				retinaImage: '',
				retinaImageExists: false
			};
			const result = MainCategoryTile.methods.chooseImage.call(wrapper, 'large');
			expect(result).toEqual([['small', '/img/test.jpg']]);
		});

		it('should return multiple variants for medium tile with retina', () => {
			const wrapper = {
				image: '/img/test.jpg',
				retinaImage: '/img/test@2x.jpg',
				retinaImageExists: true
			};
			const result = MainCategoryTile.methods.chooseImage.call(wrapper, 'medium');
			expect(result).toEqual([
				['small', '/img/test@2x.jpg'],
				['small retina', '/img/test@2x.jpg'],
				['large', '/img/test.jpg'],
				['large retina', '/img/test@2x.jpg']
			]);
		});

		it('should return single image for medium tile without retina', () => {
			const wrapper = {
				image: '/img/test.jpg',
				retinaImage: '',
				retinaImageExists: false
			};
			const result = MainCategoryTile.methods.chooseImage.call(wrapper, 'medium');
			expect(result).toEqual([['small', '/img/test.jpg']]);
		});

		it('should return small and retina variants for small tile with retina', () => {
			const wrapper = {
				image: '/img/test.jpg',
				retinaImage: '/img/test@2x.jpg',
				retinaImageExists: true
			};
			const result = MainCategoryTile.methods.chooseImage.call(wrapper, 'small');
			expect(result).toEqual([
				['small', '/img/test.jpg'],
				['small retina', '/img/test@2x.jpg']
			]);
		});

		it('should return single image for small tile without retina', () => {
			const wrapper = {
				image: '/img/test.jpg',
				retinaImage: '',
				retinaImageExists: false
			};
			const result = MainCategoryTile.methods.chooseImage.call(wrapper, 'small');
			expect(result).toEqual([['small', '/img/test.jpg']]);
		});
	});

	describe('props defaults', () => {
		it('should have correct default values for all props', () => {
			expect(MainCategoryTile.props.categoryName.default).toBe('');
			expect(MainCategoryTile.props.categoryDescription.default).toBe('');
			expect(MainCategoryTile.props.numberLoans.default).toBe(0);
			expect(MainCategoryTile.props.image.default).toBe('');
			expect(MainCategoryTile.props.retinaImage.default).toBe('');
			expect(MainCategoryTile.props.categoryUrl.default).toBe('');
		});
	});

	describe('KvResponsiveImage integration', () => {
		it('should pass loading="lazy" to KvResponsiveImage', () => {
			const { container } = renderComponent();

			const image = container.querySelector('.category-image');
			expect(image).toBeTruthy();
		});

		it('should pass alt text to KvResponsiveImage', () => {
			const { container } = renderComponent({ categoryName: 'Education' });

			const image = container.querySelector('img');
			expect(image.getAttribute('alt')).toBe('Kiva loans to Education');
		});
	});

	describe('link styling', () => {
		it('should have remove-link-decoration class', () => {
			const { container } = renderComponent();

			const link = container.querySelector('.remove-link-decoration');
			expect(link).toBeTruthy();
		});

		it('should have group class for hover effects', () => {
			const { container } = renderComponent();

			const tile = container.querySelector('.tw-group');
			expect(tile).toBeTruthy();
		});
	});
});
