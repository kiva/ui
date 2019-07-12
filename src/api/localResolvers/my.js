import _get from 'lodash/get';

export default ({ kvAuth0 }) => {
	return {
		resolvers: {
			My: {
				lastLoginTimestamp() {
					const lastLoginKey = 'https://www.kiva.org/last_login';
					return _get(kvAuth0, `user["${lastLoginKey}"]`)
						|| _get(kvAuth0, `user._json["${lastLoginKey}"]`)
						|| 0;
				}
			},
		},
	};
};
