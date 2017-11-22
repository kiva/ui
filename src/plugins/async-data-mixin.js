export default {
	beforeRouteUpdate(to, from, next) {
		const { asyncData } = this.$options;
		if (asyncData) {
			asyncData({
				store: this.$store,
				route: to,
			}).then(next).catch(next);
		} else {
			next();
		}
	},
};
