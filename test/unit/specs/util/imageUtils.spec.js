import { checkAvifSupport, checkWebpSupport, preloadImage } from '#src/util/imageUtils';

describe('imageUtils.js', () => {
	let originalImage;

	beforeEach(() => {
		// Save original Image constructor
		originalImage = global.Image;
		// Create a mock Image constructor
		global.Image = vi.fn();
	});

	afterEach(() => {
		// Restore original Image constructor
		global.Image = originalImage;
		vi.clearAllMocks();
	});

	describe('checkWebpSupport', () => {
		it('resolves to true when webp image loads successfully with valid dimensions', async () => {
			const mockImg = {
				onload: null,
				onerror: null,
				width: 1,
				height: 1,
				src: ''
			};
			global.Image.mockImplementation(() => mockImg);

			const promise = checkWebpSupport();

			// Simulate successful load
			mockImg.onload();

			const result = await promise;
			expect(result).toBe(true);
			expect(mockImg.src).toContain('data:image/webp;base64,');
		});

		it('resolves to false when webp image loads but has invalid dimensions', async () => {
			const mockImg = {
				onload: null,
				onerror: null,
				width: 0,
				height: 0,
				src: ''
			};
			global.Image.mockImplementation(() => mockImg);

			const promise = checkWebpSupport();

			// Simulate load with invalid dimensions
			mockImg.onload();

			const result = await promise;
			expect(result).toBe(false);
		});

		it('resolves to false when webp image fails to load', async () => {
			const mockImg = {
				onload: null,
				onerror: null,
				width: 1,
				height: 1,
				src: ''
			};
			global.Image.mockImplementation(() => mockImg);

			const promise = checkWebpSupport();

			// Simulate error
			mockImg.onerror();

			const result = await promise;
			expect(result).toBe(false);
		});
	});

	describe('checkAvifSupport', () => {
		it('resolves to true when avif image loads successfully with valid dimensions', async () => {
			const mockImg = {
				onload: null,
				onerror: null,
				width: 1,
				height: 1,
				src: ''
			};
			global.Image.mockImplementation(() => mockImg);

			const promise = checkAvifSupport();

			// Simulate successful load
			mockImg.onload();

			const result = await promise;
			expect(result).toBe(true);
			expect(mockImg.src).toContain('data:image/avif;base64,');
		});

		it('resolves to false when avif image loads but has invalid dimensions', async () => {
			const mockImg = {
				onload: null,
				onerror: null,
				width: 0,
				height: 0,
				src: ''
			};
			global.Image.mockImplementation(() => mockImg);

			const promise = checkAvifSupport();

			// Simulate load with invalid dimensions
			mockImg.onload();

			const result = await promise;
			expect(result).toBe(false);
		});

		it('resolves to false when avif image fails to load', async () => {
			const mockImg = {
				onload: null,
				onerror: null,
				width: 1,
				height: 1,
				src: ''
			};
			global.Image.mockImplementation(() => mockImg);

			const promise = checkAvifSupport();

			// Simulate error
			mockImg.onerror();

			const result = await promise;
			expect(result).toBe(false);
		});
	});

	describe('preloadImage', () => {
		it('creates a new Image instance and sets the src', () => {
			const mockImg = {
				src: ''
			};
			global.Image.mockImplementation(() => mockImg);

			const testSrc = 'https://example.com/image.jpg';
			preloadImage(testSrc);

			expect(global.Image).toHaveBeenCalledTimes(1);
			expect(mockImg.src).toBe(testSrc);
		});
	});
});
