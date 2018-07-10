/*
	Global Tip Message Mixin
	- REQUIRES: inject: ['apollo'] to manage global tip message state
	- Exposes the following two methods for use on any component instance
	- Call from component javascript using this.$showTipMsg or template using $showTipMessage
	- See TheTipMessage.vue for internal implementation
*/
import updateTipMessage from '@/graphql/mutation/updateTipMessage.graphql';
import checkApolloInject from '@/util/apolloInjectCheck';

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
				mutation: updateTipMessage,
				variables: {
					tipMsg,
					tipMsgType,
					tipPersist,
					tipInitUrl: this.$route.path || ''
				}
			});
		},
		/*
			Close global tip message
			- Calling from component clears tip message contents and type, sets tipPersist to false
		*/
		$closeTipMsg() {
			checkApolloInject(this);

			this.apollo.mutate({
				mutation: updateTipMessage,
				variables: {
					tipVisible: false
				}
			});
		}
	}
};
