import {
	checkAvifSupport, checkWebpSupport, preloadImage, optimizeContentfulUrl
} from '#src/util/imageUtils';
import logFormatter from '#src/util/logFormatter';

vi.mock('#src/util/logFormatter');

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

describe('optimizeContentfulUrl', () => {
	// The proxied host is what the UI actually receives: contentful-apollo-server rewrites
	// every asset URL in the GraphQL response before it reaches the client.
	const proxiedUrl = '//www.kiva.org/ctfassets/images/2F0fMUNds6qhAj6CyQ0kn4/360430aae7/image.jpg';

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns empty string without warning when baseUrl is falsy', () => {
		expect(optimizeContentfulUrl(null)).toBe('');
		expect(optimizeContentfulUrl(undefined)).toBe('');
		expect(optimizeContentfulUrl('')).toBe('');
		expect(logFormatter).not.toHaveBeenCalled();
	});

	it('returns optimized URL with width only', () => {
		const optimizedUrl = optimizeContentfulUrl(proxiedUrl, 336);

		const expectedParams = new URLSearchParams();
		expectedParams.set('w', '336');
		expectedParams.set('fm', 'webp');
		expectedParams.set('q', '80');

		expect(optimizedUrl).toBe(`${proxiedUrl}?${expectedParams.toString()}`);
	});

	it('returns optimized URL with height only', () => {
		const optimizedUrl = optimizeContentfulUrl(proxiedUrl, null, 200);

		const expectedParams = new URLSearchParams();
		expectedParams.set('h', '200');
		expectedParams.set('fm', 'webp');
		expectedParams.set('q', '80');

		expect(optimizedUrl).toBe(`${proxiedUrl}?${expectedParams.toString()}`);
	});

	it('returns optimized URL with both width and height', () => {
		const optimizedUrl = optimizeContentfulUrl(proxiedUrl, 336, 200);

		const expectedParams = new URLSearchParams();
		expectedParams.set('w', '336');
		expectedParams.set('h', '200');
		expectedParams.set('fm', 'webp');
		expectedParams.set('q', '80');

		expect(optimizedUrl).toBe(`${proxiedUrl}?${expectedParams.toString()}`);
	});

	it.each([
		['production proxied host', '//www.kiva.org/ctfassets/images/space/hash/image.jpg'],
		['development proxied host', '//www.development.kiva.org/ctfassets/images/space/hash/image.jpg'],
		['unproxied protocol-relative asset', '//images.ctfassets.net/j0p9a6ql0rn7/space/hash/image.jpg'],
		['unproxied absolute asset', 'https://images.ctfassets.net/j0p9a6ql0rn7/space/hash/image.jpg'],
		['management API asset', 'https://assets.contentful.com/space/image.jpg'],
	])('optimizes a %s without warning', (_, baseUrl) => {
		const optimizedUrl = optimizeContentfulUrl(baseUrl, 100);

		expect(optimizedUrl).toContain('w=100');
		expect(optimizedUrl).toContain('fm=webp');
		expect(logFormatter).not.toHaveBeenCalled();
	});

	it('optimizes a non-Contentful URL and warns about it', () => {
		const baseUrl = 'https://example.com/image.jpg';
		const optimizedUrl = optimizeContentfulUrl(baseUrl, 100, 100);

		expect(optimizedUrl).toContain('w=100');
		expect(optimizedUrl).toContain('h=100');
		expect(optimizedUrl).toContain('fm=webp');
		expect(logFormatter).toHaveBeenCalledWith(expect.stringContaining(baseUrl), 'warn');
	});

	it('handles URL with no dimensions', () => {
		const optimizedUrl = optimizeContentfulUrl(proxiedUrl);

		expect(optimizedUrl).toContain('fm=webp');
		expect(optimizedUrl).toContain('q=80');
		expect(optimizedUrl).not.toContain('w=');
		expect(optimizedUrl).not.toContain('h=');
	});

	it('handles zero width and height', () => {
		const optimizedUrl = optimizeContentfulUrl(proxiedUrl, 0, 0);

		// Zero is falsy, so should not include width/height params
		expect(optimizedUrl).toContain('fm=webp');
		expect(optimizedUrl).not.toContain('w=');
		expect(optimizedUrl).not.toContain('h=');
	});
});
