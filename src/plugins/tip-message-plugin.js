import updateTipMessage from '@/graphql/mutation/updateTipMessage.graphql';

// export default Vue => {
// 	/*
// 	- Global vue instance method for showing a tipMsg
// 	- @param Object methodOptions {apolloClient, tipMsg, tipMsgType, showTipOnLoad}
// 	- Usage this.@tipMsg({apolloClient, tipMsg: 'some text', tipMsgType: 'type', showTipOnLoad: false})
// 	*/
// 	// eslint-disable-next-line no-param-reassign
// 	Vue.prototype.$tipMsg = methodOptions => {
// 		// eslint-disable-next-line no-console
// 		console.log(methodOptions);

// 		methodOptions.apolloClient.mutate({
// 			mutation: updateTipMessage,
// 			variables: {
// 				tipMsg: methodOptions.tipMsg,
// 				tipMsgType: methodOptions.tipMsgType,
// 				showTipOnLoad: methodOptions.showTipOnLoad
// 			}
// 		});
// 	};
// };

export default {
	methods: {
		$showTipMsg(tipMsg, tipMsgType) {
			if (!this.$options.inject || !this.$options.inject.apollo) {
				throw new Error('No apollo client provided! Add "inject: [\'apollo\']" to this component definition.');
			}

			this.apollo.mutate({
				mutation: updateTipMessage,
				variables: {
					tipMsg,
					tipMsgType,
					tipVisible: true
				}
			});
		}
	}
};
