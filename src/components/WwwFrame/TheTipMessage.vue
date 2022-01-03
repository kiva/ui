<template>
	<kv-toast
		ref="tip"
		@close="$closeTipMsg"
		class="tw-fixed tw-top-9 md:tw-top-11 tw-left-0 tw-right-0 tw-z-banner"
	/>
</template>

<script>
import DOMPurify from 'dompurify';
import tipMessageData from '@/graphql/query/tipMessage/tipMessageData.graphql';
import KvToast from '~/@kiva/kv-components/vue/KvToast';

export default {
	components: {
		KvToast,
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
					this.safeMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'] });
					this.messageType = data?.tip?.type ?? '';
					this.persist = data?.tip?.persist ?? false;

					this.$refs.tip.show(this.safeMessage, this.messageType, this.preventAutoDismiss);
					this.initialPath = this.$route.path;
				} else {
					this.$refs.tip.close();
				}
			}
		}
	},
	data() {
		return {
			safeMessage: '',
			messageType: '',
			persist: false,
			initialPath: null
		};
	},
	computed: {
		preventAutoDismiss() {
			return this.persist || this.messageType === 'error' || this.messageType === 'warning';
		}
	},
	watch: {
		/*
			Observe $route.path for changes
			- This enables us to hide the tip message when you navigate to another ui server page
			- Unless you pass the persist parameter in which case the tip message remains on ui server pages
			- The else if statement allows the message to show on subsequent visits rendering tip messages on a route
		*/
		// eslint-disable-next-line object-shorthand
		'$route.path'(to) {
			if (to !== this.initialPath && this.persist !== true) {
				this.$refs.tip.close();
			} else if (to === this.initialPath) {
				this.$refs.tip.show(this.safeMessage, this.messageType, this.preventAutoDismiss);
			}
		},
	}

};
</script>
