<template>
	<kv-tip-message ref="tip" @close="$closeTipMsg" />
</template>

<script>
import _get from 'lodash/get';
import DOMPurify from 'dompurify';
import tipMessageData from '@/graphql/query/tipMessage/tipMessageData.graphql';
import KvTipMessage from '@/components/Kv/KvTipMessage';

export default {
	components: {
		KvTipMessage,
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: tipMessageData,
		preFetch: true,
		result({ data }) {
			if (this.$refs.tip) {
				const showing = _get(data, 'tip.visible');

				if (showing) {
					const message = _get(data, 'tip.message');
					const safeMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'] });
					const messageType = _get(data, 'tip.type');
					const persist = _get(data, 'tip.persist');

					this.$refs.tip.show(safeMessage, messageType, persist);
				} else {
					this.$refs.tip.close();
				}
			}
		}
	},
};
</script>
