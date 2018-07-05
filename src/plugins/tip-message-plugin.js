import updateTipMessage from '@/graphql/mutation/updateTipMessage.graphql';

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
