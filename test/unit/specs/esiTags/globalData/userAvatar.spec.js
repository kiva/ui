import { userAvatarData } from '#src/esiTags/globalData/userAvatar';
import { isLegacyPlaceholderAvatar } from '@kiva/kv-components';

// Mock isLegacyPlaceholderAvatar
vi.mock('@kiva/kv-components', async () => {
	const actual = await vi.importActual('@kiva/kv-components');
	return {
		...actual,
		isLegacyPlaceholderAvatar: vi.fn()
	};
});

const realAvatar = {
	my: {
		id: 42,
		lender: {
			image: {
				id: 'img123',
				url: 'https://www.kiva.org/img.jpg'
			}
		}
	}
};

describe('userAvatarData', () => {
	it('shows the real avatar and hides the avatar icon for a usable image', () => {
		isLegacyPlaceholderAvatar.mockReturnValue(false);

		const result = userAvatarData(realAvatar);

		expect(result['user-avatar']).toBe('url("https://www.kiva.org/img.jpg") / "My portfolio"');
		expect(result['user-avatar-legacy-display']).toBe('none');
		expect(result).not.toHaveProperty('user-avatar-display');
	});

	it('hides the real avatar when the stored image is a default avatar image', () => {
		isLegacyPlaceholderAvatar.mockReturnValue(true);
		const data = {
			my: {
				id: 42,
				lender: {
					image: {
						id: '726677',
						url: 'https://www.kiva.org/726677.jpg'
					}
				}
			}
		};

		const result = userAvatarData(data);

		expect(result['user-avatar-display']).toBe('none');
		expect(result).not.toHaveProperty('user-avatar-legacy-display');
	});

	// A url-less image, a lender with no image, and a null `my` all mean the same thing to the
	// header: there is nothing to paint, so the avatar icon has to carry the state. Emitting
	// `user-avatar` here would leave the real-avatar element shown with an empty image.
	it.each([
		['the image has no url', { my: { id: 42, lender: { image: { id: 'img123' } } } }],
		['the lender has no image', { my: { id: 42, lender: {} } }],
		['there is no lender', { my: { id: 42 } }],
		['there is no user', {}],
	])('hides the real avatar and emits no url when %s', (_, data) => {
		isLegacyPlaceholderAvatar.mockReturnValue(false);

		const result = userAvatarData(data);

		expect(result).not.toHaveProperty('user-avatar');
		expect(result['user-avatar-display']).toBe('none');
		expect(result).not.toHaveProperty('user-avatar-legacy-display');
	});

	it('signals logged out when there is no user', () => {
		isLegacyPlaceholderAvatar.mockReturnValue(false);

		const result = userAvatarData({ my: null });

		expect(result['user-loading-display']).toBe('none');
	});

	it('does not signal logged out for a real user', () => {
		isLegacyPlaceholderAvatar.mockReturnValue(false);

		const result = userAvatarData(realAvatar);

		expect(result).not.toHaveProperty('user-loading-display');
	});
});
