import { userAvatarData } from '../../../../../src/esiTags/globalData/userAvatar';
import { isLegacyPlaceholderAvatar } from '@kiva/kv-components';

// Mock isLegacyPlaceholderAvatar
vi.mock('@kiva/kv-components', async () => {
	const actual = await vi.importActual('@kiva/kv-components');
	return {
		...actual,
		isLegacyPlaceholderAvatar: vi.fn()
	};
});

describe('userAvatarData', () => {
	it('returns correct CSS vars for normal avatar', () => {
		isLegacyPlaceholderAvatar.mockReturnValue(false);
		const data = {
			my: {
				lender: {
					image: {
						id: 'img123',
						url: 'https://www.kiva.org/img.jpg'
					}
				}
			}
		};
		const result = userAvatarData(data);
		expect(result['user-avatar']).toBe('url("https://www.kiva.org/img.jpg") / "My portfolio"');
		expect(result['user-avatar-legacy-display']).toBe('none');
		expect(result).not.toHaveProperty('user-avatar-display');
	});

	it('returns correct CSS vars for legacy avatar', () => {
		isLegacyPlaceholderAvatar.mockReturnValue(true);
		const data = {
			my: {
				lender: {
					image: {
						id: '726677',
						url: 'https://www.kiva.org/726677.jpg'
					}
				}
			}
		};
		const result = userAvatarData(data);
		expect(result['user-avatar']).toBe('url("https://www.kiva.org/726677.jpg") / "My portfolio"');
		expect(result['user-avatar-display']).toBe('none');
		expect(result).not.toHaveProperty('user-avatar-legacy-display');
	});

	it('handles missing image url gracefully', () => {
		const data = { my: { lender: { image: { id: 'img123' } } } };
		const result = userAvatarData(data);
		expect(result['user-avatar']).toBe('url("") / "My portfolio"');
	});

	it('handles missing image object gracefully', () => {
		const data = { my: { lender: {} } };
		const result = userAvatarData(data);
		expect(result['user-avatar']).toBe('url("") / "My portfolio"');
	});

	it('handles missing lender gracefully', () => {
		const data = { my: {} };
		const result = userAvatarData(data);
		expect(result['user-avatar']).toBe('url("") / "My portfolio"');
	});

	it('handles missing my gracefully', () => {
		const data = {};
		const result = userAvatarData(data);
		expect(result['user-avatar']).toBe('url("") / "My portfolio"');
	});
});
