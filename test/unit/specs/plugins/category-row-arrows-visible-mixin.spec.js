import categoryRowArrowsVisibleMixin from '#src/plugins/category-row-arrows-visible-mixin';

describe('category-row-arrows-visible-mixin.js', () => {
	let context;
	let checkArrowsVisible;

	beforeEach(() => {
		context = {};

		// Helper to call mixin method
		checkArrowsVisible = () => {
			return categoryRowArrowsVisibleMixin.methods.categoryRowArrowsVisible.call(context);
		};
	});

	describe('categoryRowArrowsVisible', () => {
		it('should return true when window is undefined', () => {
			vi.stubGlobal('window', undefined);
			vi.stubGlobal('document', undefined);

			const result = checkArrowsVisible();

			expect(result).toBe(true);

			vi.unstubAllGlobals();
		});

		it('should return true when document is undefined', () => {
			vi.stubGlobal('window', {});
			vi.stubGlobal('document', undefined);

			const result = checkArrowsVisible();

			expect(result).toBe(true);

			vi.unstubAllGlobals();
		});

		it('should return true when arrow element is not found', () => {
			const mockDocument = {
				querySelector: vi.fn().mockReturnValue(null)
			};

			vi.stubGlobal('window', {});
			vi.stubGlobal('document', mockDocument);

			const result = checkArrowsVisible();

			expect(result).toBe(true);
			expect(mockDocument.querySelector).toHaveBeenCalledWith('.arrow.right-arrow');

			vi.unstubAllGlobals();
		});

		it('should return false when arrow display is none', () => {
			const mockElement = {};
			const mockGetComputedStyle = vi.fn().mockReturnValue({
				display: 'none'
			});
			const mockDocument = {
				querySelector: vi.fn().mockReturnValue(mockElement)
			};

			vi.stubGlobal('window', {
				getComputedStyle: mockGetComputedStyle
			});
			vi.stubGlobal('document', mockDocument);

			const result = checkArrowsVisible();

			expect(result).toBe(false);
			expect(mockDocument.querySelector).toHaveBeenCalledWith('.arrow.right-arrow');
			expect(mockGetComputedStyle).toHaveBeenCalledWith(mockElement);

			vi.unstubAllGlobals();
		});

		it('should return true when arrow display is not none', () => {
			const mockElement = {};
			const mockGetComputedStyle = vi.fn().mockReturnValue({
				display: 'block'
			});
			const mockDocument = {
				querySelector: vi.fn().mockReturnValue(mockElement)
			};

			vi.stubGlobal('window', {
				getComputedStyle: mockGetComputedStyle
			});
			vi.stubGlobal('document', mockDocument);

			const result = checkArrowsVisible();

			expect(result).toBe(true);
			expect(mockDocument.querySelector).toHaveBeenCalledWith('.arrow.right-arrow');
			expect(mockGetComputedStyle).toHaveBeenCalledWith(mockElement);

			vi.unstubAllGlobals();
		});

		it('should handle display value of inline', () => {
			const mockElement = {};
			const mockGetComputedStyle = vi.fn().mockReturnValue({
				display: 'inline'
			});
			const mockDocument = {
				querySelector: vi.fn().mockReturnValue(mockElement)
			};

			vi.stubGlobal('window', {
				getComputedStyle: mockGetComputedStyle
			});
			vi.stubGlobal('document', mockDocument);

			const result = checkArrowsVisible();

			expect(result).toBe(true);

			vi.unstubAllGlobals();
		});

		it('should handle display value of flex', () => {
			const mockElement = {};
			const mockGetComputedStyle = vi.fn().mockReturnValue({
				display: 'flex'
			});
			const mockDocument = {
				querySelector: vi.fn().mockReturnValue(mockElement)
			};

			vi.stubGlobal('window', {
				getComputedStyle: mockGetComputedStyle
			});
			vi.stubGlobal('document', mockDocument);

			const result = checkArrowsVisible();

			expect(result).toBe(true);

			vi.unstubAllGlobals();
		});

		it('should handle display value of inline-block', () => {
			const mockElement = {};
			const mockGetComputedStyle = vi.fn().mockReturnValue({
				display: 'inline-block'
			});
			const mockDocument = {
				querySelector: vi.fn().mockReturnValue(mockElement)
			};

			vi.stubGlobal('window', {
				getComputedStyle: mockGetComputedStyle
			});
			vi.stubGlobal('document', mockDocument);

			const result = checkArrowsVisible();

			expect(result).toBe(true);

			vi.unstubAllGlobals();
		});

		it('should use correct selector for arrow element', () => {
			const mockDocument = {
				querySelector: vi.fn().mockReturnValue(null)
			};

			vi.stubGlobal('window', {});
			vi.stubGlobal('document', mockDocument);

			checkArrowsVisible();

			expect(mockDocument.querySelector).toHaveBeenCalledWith('.arrow.right-arrow');

			vi.unstubAllGlobals();
		});
	});
});
