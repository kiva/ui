// @vitest-environment node
import sharp from 'sharp';
import fetch from '#server/util/fetch';
import { processAdImage } from '#server/util/live-loan/ads/ad-image';

// mock the HTTP fetch so no real request is made; sharp runs for real against fixture bytes
vi.mock('#server/util/fetch');

// mock out the argv module so command line arguments aren't read by the code under test
vi.mock('#server/util/argv', () => ({ default: {} }));

// mock logging so warnings/errors don't print during the test run
vi.mock('#server/util/log', () => ({
	warn: vi.fn(),
	error: vi.fn(),
}));

// a tiny valid source JPEG with no ICC profile, mirroring Kiva's stored originals
async function sourceJpeg() {
	return sharp({
		create: {
			width: 8, height: 8, channels: 3, background: { r: 10, g: 20, b: 30 }
		}
	})
		.jpeg()
		.toBuffer();
}

function mockFetchOk(buf) {
	fetch.mockResolvedValue({ ok: true, arrayBuffer: async () => buf });
}

describe('ad-image', () => {
	beforeEach(() => {
		fetch.mockReset();
	});

	it('returns a JPEG buffer with an embedded ICC profile', async () => {
		mockFetchOk(await sourceJpeg());

		const out = await processAdImage('abc123');

		expect(Buffer.isBuffer(out)).toBe(true);
		const meta = await sharp(out).metadata();
		expect(meta.format).toEqual('jpeg');
		expect(meta.space).toEqual('srgb');
		expect(!!meta.icc).toBe(true);
	});

	it('requests the public orig JPEG for the given hash', async () => {
		mockFetchOk(await sourceJpeg());

		await processAdImage('deadbeef');

		expect(fetch).toHaveBeenCalledWith('https://www.kiva.org/img/orig/deadbeef.jpg');
	});

	it('returns null for an invalid hash without fetching', async () => {
		const out = await processAdImage('../etc/passwd');

		expect(out).toBeNull();
		expect(fetch).not.toHaveBeenCalled();
	});

	it('returns null when the source fetch is not ok', async () => {
		fetch.mockResolvedValue({ ok: false, status: 404 });

		expect(await processAdImage('abc123')).toBeNull();
	});

	it('returns null when the source fetch throws', async () => {
		fetch.mockRejectedValue(new Error('network down'));

		expect(await processAdImage('abc123')).toBeNull();
	});

	it('returns null when the source bytes are not a decodable image', async () => {
		mockFetchOk(Buffer.from('this is not an image'));

		expect(await processAdImage('abc123')).toBeNull();
	});
});
