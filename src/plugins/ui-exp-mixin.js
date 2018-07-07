/* eslint-disable */
export default {
	data() {
		return {
			experimentVersion: ''
		};
	},
	created() {
		// Attempt to get an existing uiab cookie
		if (this.$isServer) {
			console.log('server created');
			// check for existing cookies here
			if (this.$ssrContext.cookies && this.$ssrContext.cookies.uiab) {
				// if we find uiab check for the current experiment within
				console.log(this.$ssrContext.cookies.uiab);
			}
		} else {
			// we should set or update the cookie with the exp version
			console.log('client created');
			// console.log(this);
		}
		this.experimentVersion = this.$getUiExpVersion(this.experimentData);
	}
};
