import categoryRowArrowsVisibleMixin from '#src/plugins/category-row-arrows-visible-mixin';

describe('category-row-arrows-visible-mixin.js', () => {
	/**
	 * Test helper to set up the DOM environment and run the mixin method
	 * @param {Object} options - Configuration for the test environment
	 * @param {boolean} options.hasWindow - Whether window should exist
	 * @param {boolean} options.hasDocument - Whether document should exist
	 * @param {boolean} options.hasElement - Whether the arrow element should be found
	 * @param {string} options.displayValue - The display CSS value to return
	 * @returns {Object} Test result with result value and mock functions
	 */
	const runTest = ({
		hasWindow = true,
		hasDocument = true,
		hasElement = true,
		displayValue = 'block'
	} = {}) => {
		const mockElement = {};
		const mockGetComputedStyle = vi.fn().mockReturnValue({ display: displayValue });
		const mockDocument = {
			querySelector: vi.fn().mockReturnValue(hasElement ? mockElement : null)
		};

		vi.stubGlobal('window', hasWindow ? { getComputedStyle: mockGetComputedStyle } : undefined);
		vi.stubGlobal('document', hasDocument ? mockDocument : undefined);

		const result = categoryRowArrowsVisibleMixin.methods.categoryRowArrowsVisible.call({});

		vi.unstubAllGlobals();

		return {
			result, mockDocument, mockGetComputedStyle, mockElement
		};
	};

	describe('categoryRowArrowsVisible', () => {
		it('should return true when window is undefined', () => {
			const { result } = runTest({ hasWindow: false, hasDocument: false });

			expect(result).toBe(true);
		});

		it('should return true when document is undefined', () => {
			const { result } = runTest({ hasDocument: false });

			expect(result).toBe(true);
		});

		it('should return true when arrow element is not found', () => {
			const { result, mockDocument } = runTest({ hasElement: false });

			expect(result).toBe(true);
			expect(mockDocument.querySelector).toHaveBeenCalledWith('.arrow.right-arrow');
		});

		it('should return false when arrow display is none', () => {
			const {
				result, mockDocument, mockGetComputedStyle, mockElement
			} = runTest({
				displayValue: 'none'
			});

			expect(result).toBe(false);
			expect(mockDocument.querySelector).toHaveBeenCalledWith('.arrow.right-arrow');
			expect(mockGetComputedStyle).toHaveBeenCalledWith(mockElement);
		});

		it('should return true when arrow display is not none', () => {
			const {
				result, mockDocument, mockGetComputedStyle, mockElement
			} = runTest({
				displayValue: 'block'
			});

			expect(result).toBe(true);
			expect(mockDocument.querySelector).toHaveBeenCalledWith('.arrow.right-arrow');
			expect(mockGetComputedStyle).toHaveBeenCalledWith(mockElement);
		});

		it('should handle display value of inline', () => {
			const { result } = runTest({ displayValue: 'inline' });

			expect(result).toBe(true);
		});

		it('should handle display value of flex', () => {
			const { result } = runTest({ displayValue: 'flex' });

			expect(result).toBe(true);
		});

		it('should handle display value of inline-block', () => {
			const { result } = runTest({ displayValue: 'inline-block' });

			expect(result).toBe(true);
		});

		it('should use correct selector for arrow element', () => {
			const { mockDocument } = runTest({ hasElement: false });

			expect(mockDocument.querySelector).toHaveBeenCalledWith('.arrow.right-arrow');
		});
	});
});
