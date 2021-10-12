export default () => {
	return {
		resolvers: {
			Query: {
				isKivaAppReferral(obj, args) {
					// Takes an argument of the query param value
					// and returns a boolean if it is present and equal to true
					return args?.kivaAppReferralQueryParam === 'true';
				},
			}
		},
	};
};
