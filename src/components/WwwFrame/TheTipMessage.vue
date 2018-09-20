<template>
	<kv-tip-message ref="tip" @close="$closeTipMsg" />
</template>

<script>
import _get from 'lodash/get';
import tipMessageData from '@/graphql/query/tipMessage/tipMessageData.graphql';
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
				const showing = _get(data, 'tip.visible');

				if (showing) {
					const message = _get(data, 'tip.message');
					const messageType = _get(data, 'tip.type');
					const persist = _get(data, 'tip.persist');

					this.$refs.tip.show(message, messageType, persist);
				} else {
					this.$refs.tip.close();
				}
			}
		}
	},
};
</script>
