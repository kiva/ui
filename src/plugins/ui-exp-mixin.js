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
			console.log('server: > > > > >');
			// check for existing cookies here
			if (this.$ssrContext.cookies && this.$ssrContext.cookies.uiab) {
				// if we find uiab check for the current experiment within
				console.log('server: uiab cookie already exist');
				console.log(this.$ssrContext.cookies.uiab);
				console.log(JSON.stringify(this.experimentData));
				// extract the version from the cookie
				this.experimentVersion = this.$extractAssignedVersion(this.$ssrContext.cookies.uiab, this.experimentData.key);
				// this.experimentVersion = this.$getUiExpVersion(this.experimentData);
			} else {
				console.log('server: no uiab cookie found');
			}
		} else {
			// On the client, if the experimentVersion is not set,
			// we should set or update the cookie with the exp version
			console.log('client: > > > > >');
			if (this.experimentVersion === '') {
				console.log('client: experiment data is not yet set');
				if (this.$expCookieExists()) {
					console.log('client: uiab cookie already exist');
					this.experimentVersion = this.$getUiExpVersion(this.experimentData);
				} else {
					console.log('client: uiab cookie does not exist');
					// return experimentVersion from newly initialized experiment session
					this.experimentVersion = this.$assignExperimentVersion(this.experimentData);
				}
			} else {
				console.log('client: experiment version is set');
				// make sure the cookie gets set
				// -> We don't currently have a way to initially set the cookie on the server
				// -> We can however update it on the next page load if it does not match stored experiment state
				if (!this.$expCookieExists()) {
					console.log('client: experimentVersion is set, cookie is not');
				}
			}
		}
	}
};
