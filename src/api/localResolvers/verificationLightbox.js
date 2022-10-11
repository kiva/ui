import showVerificationLightboxQuery from '@/graphql/mutation/checkout/showVerificationLightbox.graphql';
import closeVerificationLightboxQuery from '@/graphql/mutation/checkout/closeVerificationLightbox.graphql';
/*
 * VerificationLightbox resolvers
 */

// eslint-disable-next-line no-underscore-dangle
const __typename = 'VerificationLightbox';

export default () => {
	return {
		defaults: {
			verificationLightbox: {
				visible: false,
				__typename,
			},
		},
		resolvers: {
			Mutation: {
				showVerificationLightbox(_, { visible = true }, context) {
					context.cache.writeQuery({
						query: showVerificationLightboxQuery,
						data: {
							verificationLightbox: {
								visible,
								__typename,
							},
						},
					});
					return true;
				},
				closeVerificationLightbox(_, { visible = false }, context) {
					context.cache.writeQuery({
						query: closeVerificationLightboxQuery,
						data: {
							verificationLightbox: {
								visible,
								__typename,
							},
						},
					});
					return true;
				},
			},
		},
	};
};
