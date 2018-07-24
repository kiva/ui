import { withClientState } from 'apollo-link-state';
// import expCookieData from '@/graphql/query/expCookieData.graphql';
import expActions from '@/util/experimentActions';

function formatUserExperimentDefaults(cookie) {
	console.log('StateLink: formatUserExperimentDefaults');
	if (!cookie || cookie.indexOf('uiab') === -1) {
		return [];
	}
	console.log('- - - - - - Test cookie');
	console.log(cookie);
	const uiabCookie = decodeURI(expActions.getExpCookieForClientState(cookie));
	console.log(uiabCookie);
	const expArray = expActions.setActiveExperiments(uiabCookie);
	console.log(expArray);
	const formattedExps = expActions.formatExpDefaultClientState(expArray);
	console.log(formattedExps);
	console.log('- - - - - - Test cookie END');
	return formattedExps;
}

export default ({ cache, cookie }) => {
	return withClientState({
		cache,
		defaults: {
			usingTouch: false,
			tipMsg: '',
			tipMsgType: 'info',
			tipVisible: false,
			tipPersist: false,
			tipInitUrl: '',
			// userExperiments: [],
			userExperiments: formatUserExperimentDefaults(cookie)
			// {
			// 	id: 'test.it',
			// 	key: 'test.it',
			// 	version: '2',
			// 	__typename: 'UserExperiment'
			// }
		},
		resolvers: {
			Mutation: {
				updateUsingTouch(_, { usingTouch }, context) {
					context.cache.writeData({
						data: { usingTouch }
					});
					return null;
				},
				updateExpCookieData(_, { userExperiment, assignedVersion }, context) {
					console.log(`exp passed to mutation: ${JSON.stringify(userExperiment)}`);

					// let previousExps;
					// cache.readQuery({ expCookieData }).then(previous => {
					// 	console.log(`previous cache query: ${JSON.stringify(previous)}`);
					// 	previousExps = previous;

					// 	const newExp = {
					// 		id: userExperiment.id,
					// 		key: userExperiment.id,
					// 		version: parseInt(userExperiment.version, 10),
					// 		__typename: 'UserExperiment'
					// 	};

					// 	const data = {
					// 		userExperiments: previousExps.userExperiments.concat([newExp]),
					// 	};
					// 	console.log(`new UserExperiment Array: ${JSON.stringify(data)}`);
					// 	context.cache.writeData({ data }).then(storedExp => {
					// 		return storedExp;
					// 	});
					// });

					console.log(assignedVersion);

					const newExp = {
						id: userExperiment.key,
						key: userExperiment.key,
						version: parseInt(assignedVersion, 10),
						__typename: 'UserExperiment'
					};

					console.log(`new UserExperiment Array: ${[JSON.stringify(newExp)]}`);

					context.cache.writeData({
						userExperiments: [newExp]
					}).then(storedExp => {
						return storedExp;
					});

					return null;
				},
				updateTipMessage(_, {
					tipMsg,
					tipMsgType,
					tipVisible,
					tipPersist,
					tipInitUrl
				}, context) {
					context.cache.writeData({
						data: {
							tipMsg,
							tipMsgType,
							tipVisible,
							tipPersist,
							tipInitUrl
						}
					});
					return null;
				}
			},
			// Query: {
			// 	userExperiments: () => {
			// 		try {
			// 			return {
			// 				userExperiments: formatUserExperimentDefaults(cookie),
			// 				id: 'UserExperiments',
			// 				__typename: 'UserExperiments'
			// 			};
			// 		} catch (e) {
			// 			console.log(e);
			// 			return null;
			// 		}
			// 	}
			// }
		},
	});
};
