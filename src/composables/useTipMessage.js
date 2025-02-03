import logFormatter from '#src/util/logFormatter';
import showTipMessage from '#src/graphql/mutation/tipMessage/showTipMessage.graphql';

export default function useTipMessage(apollo) {
	const $showTipMsg = (tipMsg, tipMsgType = '', tipPersist = false) => {
		apollo.mutate({
			mutation: showTipMessage,
			variables: {
				message: tipMsg,
				type: tipMsgType,
				persist: tipPersist,
			},
		}).catch(e => {
			logFormatter(e, 'error');
		});
	};

	return {
		$showTipMsg,
	};
}
