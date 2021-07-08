<template>
	<kv-tip-message ref="tip" @close="$closeTipMsg" />
</template>

<script>
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
				const showing = data?.tip?.visible ?? false;

				if (showing) {
					const message = data?.tip?.message ?? '';
					const safeMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'] });
					const messageType = data?.tip?.type ?? '';
					const persist = data?.tip?.persist ?? false;

					this.$refs.tip.show(safeMessage, messageType, persist);
				} else {
					this.$refs.tip.close();
				}
			}
		}
	},
};
</script>
