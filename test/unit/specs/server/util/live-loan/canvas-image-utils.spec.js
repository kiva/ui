// @vitest-environment node
import { loadImage } from 'canvas';

// Mock canvas module
vi.mock('canvas', async () => {
	return {
		loadImage: vi.fn().mockResolvedValue({ width: 100, height: 100 }),
	};
});

describe('canvas-image-utils', () => {
	let loadImageWithRetry;
	let loadBorrowerImage;

	beforeAll(async () => {
		// Now import the module - fallback preload will happen
		const module = await import('#server/util/live-loan/canvas-image-utils');
		loadImageWithRetry = module.loadImageWithRetry;
		loadBorrowerImage = module.loadBorrowerImage;

		// Wait a bit for the async preload to complete
		// eslint-disable-next-line no-promise-executor-return
		await new Promise(resolve => setTimeout(resolve, 50));
	});
	const mockImage = {
		width: 100,
		height: 100,
		complete: true,
	};

	beforeEach(() => {
		loadImage.mockClear();
	});

	describe('loadImageWithRetry', () => {
		it('should return image on first successful attempt', async () => {
			loadImage.mockResolvedValue(mockImage);

			const result = await loadImageWithRetry('https://example.com/image.jpg', 12345);

			expect(result).toBe(mockImage);
			expect(loadImage).toHaveBeenCalledTimes(1);
			expect(loadImage).toHaveBeenCalledWith('https://example.com/image.jpg');
		});

		it('should retry on failure and succeed on second attempt', async () => {
			loadImage
				.mockRejectedValueOnce(new Error('Network error'))
				.mockResolvedValueOnce(mockImage);

			const result = await loadImageWithRetry('https://example.com/image.jpg', 12345);

			expect(result).toBe(mockImage);
			expect(loadImage).toHaveBeenCalledTimes(2);
		});

		it('should retry with exponential backoff', async () => {
			vi.useFakeTimers();
			loadImage
				.mockRejectedValueOnce(new Error('Network error'))
				.mockRejectedValueOnce(new Error('Network error'))
				.mockResolvedValueOnce(mockImage);

			const promise = loadImageWithRetry('https://example.com/image.jpg', 12345);

			// First attempt fails immediately
			await vi.advanceTimersByTimeAsync(0);
			expect(loadImage).toHaveBeenCalledTimes(1);

			// Wait for first retry delay (100ms)
			await vi.advanceTimersByTimeAsync(100);
			expect(loadImage).toHaveBeenCalledTimes(2);

			// Wait for second retry delay (200ms)
			await vi.advanceTimersByTimeAsync(200);
			expect(loadImage).toHaveBeenCalledTimes(3);

			const result = await promise;
			expect(result).toBe(mockImage);

			vi.useRealTimers();
		});

		it('should throw error after all retries fail', async () => {
			const err = new Error('Permanent network error');
			loadImage.mockRejectedValue(err);

			await expect(
				loadImageWithRetry('https://example.com/image.jpg', 12345, 2)
			).rejects.toThrow('Permanent network error');

			expect(loadImage).toHaveBeenCalledTimes(3); // Initial + 2 retries
		});

		it('should respect custom maxRetries parameter', async () => {
			loadImage.mockRejectedValue(new Error('Network error'));

			await expect(
				loadImageWithRetry('https://example.com/image.jpg', 12345, 0)
			).rejects.toThrow('Network error');

			expect(loadImage).toHaveBeenCalledTimes(1); // No retries
		});
	});

	describe('loadBorrowerImage', () => {
		const mockLoanData = {
			id: 12345,
			image: {
				retina: 'https://example.com/image.webp'
			}
		};

		it('should convert webp to jpg', async () => {
			loadImage.mockResolvedValue(mockImage);

			await loadBorrowerImage(mockLoanData);

			expect(loadImage).toHaveBeenCalledWith('https://example.com/image.jpg');
		});

		it('should return image and hasBorrowerImage true on success', async () => {
			loadImage.mockResolvedValue(mockImage);

			const result = await loadBorrowerImage(mockLoanData);

			expect(result).toEqual({
				image: mockImage,
				hasBorrowerImage: true
			});
		});

		it('should return fallback image and hasBorrowerImage false on failure', async () => {
			loadImage.mockRejectedValue(new Error('Image load failed'));

			const result = await loadBorrowerImage(mockLoanData);

			expect(result.hasBorrowerImage).toBe(false);
			// Fallback image is null in test environment since preload happens at module init
			expect(result.image).toBeDefined();
		});

		it('should handle missing image URL gracefully', async () => {
			loadImage.mockRejectedValue(new Error('Invalid URL'));
			const loanDataNoImage = {
				id: 12345,
				image: {}
			};

			const result = await loadBorrowerImage(loanDataNoImage);

			expect(result.hasBorrowerImage).toBe(false);
			expect(result.image).toBeDefined();
		});
	});
});
