import { gql } from '@apollo/client';

/*
 * VerificationLightbox resolvers
 */

function writeVerificationLightboxData({ cache, visible = false }) {
	cache.writeQuery({
		query: gql`query verificationLightboxData {
			verificationLightbox @client {
				id
				visible
			}
		}`,
		data: {
			verificationLightbox: {
				id: 0,
				visible,
				__typename: 'VerificationLightbox',
			}
		}
	});
}

export default () => {
	return {
		defaults(cache) {
			writeVerificationLightboxData({ cache, visible: false });
		},
		typePolicies: {
			Mutation: {
				showVerificationLightbox(_, args, { cache }) {
					writeVerificationLightboxData({ cache, visible: true });
					return true;
				},
				closeVerificationLightbox(_, args, { cache }) {
					writeVerificationLightboxData({ cache, visible: false });
					return true;
				},
			},
		},
	};
};
