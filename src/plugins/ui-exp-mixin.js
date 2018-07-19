// import updateExpCookieData from '@/graphql/mutation/updateExpCookieData.graphql';
import expCookieData from '@/graphql/query/expCookieData.graphql';
import checkApolloInject from '@/util/apolloInjectCheck';

/* eslint-disable */

export default {
	data() {
		return {
			experimentVersion: '',
			activeUserExperiments: []
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
				// console.log(this.$ssrContext.cookies.uiab);
				console.log(JSON.stringify(this.experimentData));
				// extract experiments array from the cookie
				// this.activeUserExperiments = this.$setActiveExperiments(this.$ssrContext.cookies.uiab);
				this.activeUserExperiments = this.getExperimentsFromCookie();
				console.log(`server activeUserExperiments set: ${JSON.stringify(this.activeUserExperiments)}`);
				// if apollo is instantiated set activeExperiments in the client store
				// this.storeUserCookieData();
				// extract the version from the cookie
				// this.experimentVersion = this.$extractAssignedVersion(this.$ssrContext.cookies.uiab, this.experimentData.key);
				// console.log(`Server Extracted Exp Version: ${this.experimentVersion}`);
				// this.experimentVersion = this.$getUiExpVersion(this.experimentData);
			} else {
				console.log('server: no uiab cookie found');
			}
		} else {
			// On the client, if the experimentVersion is not set,
			// we should set or update the cookie with the exp version
			console.log('client: > > > > >');
			if (this.activeUserExperiments.length === 0) {
				console.log('client: experiment data is not yet set');
				if (this.$expCookieExists()) {
					console.log('client: uiab cookie already exist');
					this.activeUserExperiments = this.getExperimentsFromCookie();
					console.log(`client activeUserExperiments set: ${JSON.stringify(this.activeUserExperiments)}`);
					// this.experimentVersion = this.$getUiExpVersion(this.experimentData);
					// console.log(`Client Extracted Exp Version: ${this.experimentVersion}`);
				} else {
					console.log('client: uiab cookie does not exist');
					// return experimentVersion from newly initialized experiment session
					this.experimentVersion = this.$assignExperimentVersion(this.experimentData);
					console.log(`Client Set Exp Version: ${this.experimentVersion}`);
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

			// if (this.experimentVersion === '') {
			// 	console.log('client: experiment data is not yet set');
			// 	if (this.$expCookieExists()) {
			// 		console.log('client: uiab cookie already exist');
			// 		this.experimentVersion = this.$getUiExpVersion(this.experimentData);
			// 		console.log(`Client Extracted Exp Version: ${this.experimentVersion}`);
			// 	} else {
			// 		console.log('client: uiab cookie does not exist');
			// 		// return experimentVersion from newly initialized experiment session
			// 		this.experimentVersion = this.$assignExperimentVersion(this.experimentData);
			// 		console.log(`Client Set Exp Version: ${this.experimentVersion}`);
			// 	}
			// } else {
			// 	console.log('client: experiment version is set');
			// 	// make sure the cookie gets set
			// 	// -> We don't currently have a way to initially set the cookie on the server
			// 	// -> We can however update it on the next page load if it does not match stored experiment state
			// 	if (!this.$expCookieExists()) {
			// 		console.log('client: experimentVersion is set, cookie is not');
			// 	}
			// }
		}
	},
	methods: {
		getExperimentsFromCookie() {
			this.apollo.query({ query: expCookieData }).then(({ data }) => {
				console.log(`testing stored query data: ${JSON.stringify(data.userExperiments)}`);
				return data.userExperiments;
			});
		},
		storeUserCookieData() {
			console.log('Storing active user exps in client state');
			checkApolloInject(this);
			console.log(JSON.stringify(this.activeUserExperiments));

			// for (let i = 0; i < this.activeUserExperiments.length; i++) {
			// 	console.log(`looping exps: ${JSON.stringify(this.activeUserExperiments[i])}`);
			// 	this.apollo.mutate({
			// 		mutation: updateExpCookieData,
			// 		variables: {
			// 			userExperiment: this.activeUserExperiments[i]
			// 		}
			// 	}).then(({ data }) => {
			// 		console.log(`testing stored return data: ${JSON.stringify(data)}`);
			// 	});
			// }
			// this.apollo.query({ query: expCookieData }).then(({ data }) => {
			// 	console.log(`testing stored query data: ${JSON.stringify(data)}`);
			// });

			// this.apollo.mutate({
			// 	mutation: updateExpCookieData,
			// 	variables: {
			// 		userExperiments: this.activeUserExperiments || []
			// 	}
			// });
		}
	}
};
