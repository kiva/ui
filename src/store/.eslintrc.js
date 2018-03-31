// http://eslint.org/docs/user-guide/configuring

module.exports = {
	rules: {
		// allow modifying the state in mutations
		'no-param-reassign': ['error', {
			'props': true,
			'ignorePropertyModificationsFor': ['state']
		}],
	}
}
