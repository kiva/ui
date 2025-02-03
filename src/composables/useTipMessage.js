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
		});
	};

	return {
		$showTipMsg,
	};
}
