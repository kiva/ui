<template>
	<kv-tip-message ref="tip" @close="$closeTipMsg" />
</template>

<script>
import _get from 'lodash/get';
import tipMessageData from '@/graphql/query/tipMessageData.graphql';
import KvTipMessage from '@/components/Kv/KvTipMessage';

export default {
	components: {
		KvTipMessage,
	},
	inject: ['apollo'],
	apollo: {
		query: tipMessageData,
		preFetch: true,
		result({ data }) {
			if (this.$refs.tip) {
				const showing = _get(data, 'tipVisible');

				if (showing) {
					const message = _get(data, 'tipMsg');
					const messageType = _get(data, 'tipMsgType');
					const persist = _get(data, 'tipPersist');

					this.$refs.tip.show(message, messageType, persist);
				} else {
					this.$refs.tip.close();
				}
			}
		}
	},
};
</script>
