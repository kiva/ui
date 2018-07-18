import { withClientState } from 'apollo-link-state';
import expCookieData from '@/graphql/query/expCookieData.graphql';

export default ({ cache }) => {
	return withClientState({
		cache,
		defaults: {
			usingTouch: false,
			tipMsg: '',
			tipMsgType: 'info',
			tipVisible: false,
			tipPersist: false,
			tipInitUrl: '',
			userExperiments: []
		},
		resolvers: {
			Mutation: {
				updateUsingTouch(_, { usingTouch }, context) {
					context.cache.writeData({
						data: { usingTouch }
					});
					return null;
				},
				updateExpCookieData(_, { userExperiment }, context) {
					const previous = cache.readQuery({ expCookieData });
					console.log(previous);
					const newExp = {
						id: Date.now(),
						key: userExperiment.key,
						version: userExperiment.version,
						__typename: 'UserExperiment'
					};
					const data = {
						userExperiments: previous.userExperiments.concat([newExp]),
					};
					context.cache.writeData({ data });
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
			}
		},
	});
};
