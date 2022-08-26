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
