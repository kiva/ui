/*
	Ui Experiments Mixin
	- Bootstrap a component with data & methods for determining which version of an experiment to show

	Usage: Import the mixin, Add to component -> mixins: [UiExpMixin]
*/

// Experiment Data Queries + Mutations
// import updateExpCookieData from '@/graphql/mutation/updateExpCookieData.graphql';
import expCookieData from '@/graphql/query/expCookieData.graphql';
import checkApolloInject from '@/util/apolloInjectCheck';
import expActions from '@/util/experimentActions';

/* eslint-disable */
export default {
	data() {
		return {
			experimentVersion: '',
			experimentSettings: [],
			activeUserExperiments: []
		};
	},
	/*
		On Created, determine if the visitor has already seen a version of your targeted experiment
		- Check for an existing 'uiab' experiment cookie
		- If they HAVE it...
		- - We need to retrieve the stored value
		- If they DO NOT HAVE it...
		- - We need to assign them a new version
		- Next, we Persist the assigned version to State
		- Then Set the data in your component
		- Component now has information to show a specific version

		* This flow must operate on the Server + the Client to ensure a server rendered App with synced state.
 	*/
	created() {
		// SERVER: Attempt to get an existing uiab cookie
		if (this.$isServer) {
			console.log('server: > > > > >');
			// check for existing cookies here
			if (this.$ssrContext.cookies && this.$ssrContext.cookies.uiab) {
				// if we find uiab cookie
				console.log('server: uiab cookie already exist');
				// extract experiments array from the cookie if not present in state
				console.log(`activeUserExperiments.length: ${this.activeUserExperiments.length}`);
				if (this.activeUserExperiments.length === 0) {
					// No experiments were initated in Default Client State, Set them now
					console.log('No experiments were initated in Default Client State, Set them now...');
					this.activeUserExperiments = expActions.setActiveExperimentsFromCookie(this.$ssrContext.cookies.uiab);
				}

				// TODO: match the current experiment with active experiment
				// TODO: if apollo is instantiated ensure activeExperiments are in the client store

			} else {
				// TODO: Fix this flow - Setting New Experiment Version on Server
				// Currently fails to set newly assigned data in state ( i think due to async nature of mutations )
				console.log(`server: no uiab cookie found ${JSON.stringify(this.experimentSettings)}`);
				// No cookie was found, but we are targeting an experiment for this session
				if (this.experimentSettings.length > 0) {
					// Assign an experiment version
					// TODO: Make this process handle an array of experimentSettings, extrading data for each item
					this.experimentVersion = expActions.assignExperimentVersion(this.experimentSettings[0]);
					console.log(`Server Set Exp Version: ${this.experimentVersion}`);
					console.log(`Active Exps Length: ${this.activeUserExperiments.length}`);
				}

				// TODO: Set newly assigned experiment data in Client State
				if (checkApolloInject(this)) {
					console.log('Adding new experiment version to client state');

					// Persist Experiment data/version in state so client can set in cookie

					// Tried to do a mutation (async so it's not done in time)
					// -> Mutation Resolver has formatting in place
					// this.apollo.mutate({
					// 	mutation: updateExpCookieData,
					// 	variables: {
					// 		userExperiment: this.experimentSettings,
					// 		assignedVersion: this.experimentVersion
					// 	}
					// }).then(({ data }) => {
					// 	console.log(`testing stored return data: ${JSON.stringify(data)}`);
					// });


					// Try to write directly to the cache
					// Format our New Experiment for the Client Store
					const newExp = {
						id: this.experimentSettings[0].key,
						key: this.experimentSettings[0].key,
						version: parseInt(this.experimentVersion, 10),
						__typename: 'UserExperiment'
					};
					// The following throws an error:
					// -> Error in created hook: "TypeError: Cannot read property 'selections' of null"
					// this.apollo.writeData({ userExperiments: [newExp], id: 'UserExperiments' });

					this.apollo.writeQuery({ query: expCookieData, data: { userExperiments: [newExp] }});

					// Attempt to update server side state for server rendering NEW experiment setting
					this.activeUserExperiments.push(newExp);
				}
			}
		} else {
			// On the client, if the experimentVersion is not set,
			// we should set or update the cookie with the exp version
			console.log('client: > > > > >');
			// TODO: Update to set NEW experiment on existing experiment cookie
			if (this.activeUserExperiments.length === 0) {
				console.log('client: experiment data is not yet set');
				// We can try to retrieve userExperiments from the cookie
				if (expActions.expCookieExists()) {
					console.log('client: uiab cookie already exist, StateLink should be populating data');
					// this.activeUserExperiments = this.setActiveExperimentsFromCookie(expActions.getClientExperimentCookie());
					// console.log(`client activeUserExperiments set: ${JSON.stringify(this.activeUserExperiments)}`);
				} else {
					console.log('client: uiab cookie does not exist');
					// return experimentVersion from newly initialized experiment session
					// TODO: Make this process handle an array of experimentSettings
					const newExpVersion = expActions.assignExperimentVersion(this.experimentSettings[0]);
					console.log(`Client Set Exp Version: ${newExpVersion}`);
					// create activeExperiments object so exp data is available
					this.activeUserExperiments = expActions.setActiveExperimentsFromCookie(expActions.getClientExperimentCookie());
				}
			} else {
				console.log('client: experiment version is set');
				// make sure the cookie gets set
				// -> We don't currently have a way to initially set the cookie on the server
				// -> We can however update it on the next page load if it does not match stored experiment state
				if (!expActions.expCookieExists()) {
					console.log('client: experimentVersion is set, cookie is not');
				}
			}
		}
	},
	methods: {
		// Aliased Methods for Use in Components
		parseExperimentData(experiment) {
			return expActions.parseExperimentData(experiment);
		},
	}
};
