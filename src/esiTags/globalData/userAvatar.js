import { gql } from 'graphql-tag';
import { isLegacyPlaceholderAvatar } from '#src/util/imageUtils';

export const userAvatarFragment = gql`fragment UserAvatar on My {
	id
	lender {
		id
		image {
			id
			url( presetSize:lender_default )
		}
	}
}`;

/**
 * Set data to be used as CSS variables for the user avatar.
 * @param {Object} data - The user data from the GraphQL query with the userAvatarFragment.
 */
export function userAvatarData(data) {
	// Set CSS variables for the user avatar
	const userData = {};
	const userAvatar = data?.my?.lender?.image?.url ?? '';
	const isLegacyAvatar = isLegacyPlaceholderAvatar(data?.my?.lender?.image?.id);
	userData['user-avatar'] = `url("${userAvatar}") / "My portfolio"`;

	// Set the display visibility of the avatar and avatar placeholder.
	// These are only set when they should not be displayed, allowing the display value to
	// be set in CSS using the fallback argument of var().
	if (isLegacyAvatar) {
		userData['user-avatar-display'] = 'none';
	} else {
		userData['user-avatar-legacy-display'] = 'none';
	}

	return userData;
}
