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
				showVerificationLightbox(_, args, context) {
					context.cache.writeQuery({
						query: showVerificationLightboxQuery,
						data: {
							verificationLightbox: {
								visible: true,
								__typename,
							},
						},
					});
					return true;
				},
				closeVerificationLightbox(_, args, context) {
					context.cache.writeQuery({
						query: closeVerificationLightboxQuery,
						data: {
							verificationLightbox: {
								visible: false,
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
