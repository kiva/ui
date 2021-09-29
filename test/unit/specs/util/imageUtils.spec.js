import { getKivaImageUrl } from '@/util/imageUtils';

describe('imageUtils.js', () => {
	describe('getKivaImageUrl()', () => {
		it('Returns the url for a Kiva image passed on the passed-in options', () => {
			expect(getKivaImageUrl({
				width: 40,
				hash: '123abc',
			})).toBe(
				'/w40/123abc.jpg'
			);
			expect(getKivaImageUrl({
				square: 40,
				hash: '123abc',
			})).toBe(
				'/s40/123abc.jpg'
			);
			expect(getKivaImageUrl({
				width: 50,
				height: 20,
				hash: 'abc123',
			})).toBe(
				'/w50h20/abc123.jpg'
			);
			expect(getKivaImageUrl({
				width: 30,
				height: 10,
				faceZoom: 50,
				hash: '1a2b3c'
			})).toBe(
				'/w30h10fz50/1a2b3c.jpg'
			);
			expect(getKivaImageUrl({
				square: 100,
				faceZoom: 35,
				hash: '123abc',
			})).toBe(
				'/s100fz35/123abc.jpg'
			);
			expect(getKivaImageUrl({
				base: 'https://www.kiva.org/img/',
				width: 30,
				height: 10,
				faceZoom: 60,
				hash: 'a1b2c3'
			})).toBe(
				'https://www.kiva.org/img/w30h10fz60/a1b2c3.jpg'
			);
		});

		it('Returns an empty string if any required options are missing', () => {
			expect(getKivaImageUrl({ width: 40 })).toBe('');
			expect(getKivaImageUrl({ height: 40 })).toBe('');
			expect(getKivaImageUrl({ faceZoom: 40 })).toBe('');
			expect(getKivaImageUrl({ hash: '123abc' })).toBe('');
			expect(getKivaImageUrl({})).toBe('');
		});
	});
});
