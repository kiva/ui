/*
	Global Tip Message Mixin
	- REQUIRES: inject: ['apollo'] to manage global tip message state
	- Exposes the following two methods for use on any component instance
	- Call from component javascript using this.$showTipMsg or template using $showTipMsg
	- See TheTipMessage.vue for internal implementation
*/
import checkApolloInject from '@/util/apolloInjectCheck';
import closeTipMessage from '@/graphql/mutation/tipMessage/closeTipMessage.graphql';
import showTipMessage from '@/graphql/mutation/tipMessage/showTipMessage.graphql';

export default {
	methods: {
		/*
			Show global tip message
			@param String tipmsg
			@param Optional String tipMsgType (pass null or 'info' if using tipPersist param)
			@param Optional Boolean tipPersist
		*/
		$showTipMsg(tipMsg, tipMsgType = '', tipPersist = false) {
			checkApolloInject(this);

			this.apollo.mutate({
				mutation: showTipMessage,
				variables: {
					message: tipMsg,
					type: tipMsgType,
					persist: tipPersist,
				},
			});
		},
		/*
			Close global tip message
			- Calling from component clears tip message contents and type, sets tipPersist to false
		*/
		$closeTipMsg() {
			checkApolloInject(this);

			this.apollo.mutate({
				mutation: closeTipMessage,
			});
		}
	}
};
