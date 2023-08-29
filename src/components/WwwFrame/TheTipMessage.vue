<template>
	<kv-toast
		ref="tip"
		@close="closeCurrentMessage"
		class="tw-fixed tw-top-9 md:tw-top-11 tw-left-0 tw-right-0 tw-z-banner"
	/>
</template>

<script>
import { captureException } from '@sentry/vue';
import { gql } from '@apollo/client';
import DOMPurify from 'dompurify';
import { TIP, WARNING, ERROR } from '@/api/fixtures/FlashMessageTypeEnum';
import tipMessageData from '@/graphql/query/tipMessage/tipMessageData.graphql';
import KvToast from '~/@kiva/kv-components/vue/KvToast';

// query for flash messages
const flashMessageQuery = gql`
	query flashMessage($visitorId: String!) {
		tips: flashMessages(messageType: tip, visitorId: $visitorId) {
			...flashMessage
		}
		warnings: flashMessages(messageType: warning, visitorId: $visitorId) {
			...flashMessage
		}
		errors: flashMessages(messageType: error, visitorId: $visitorId) {
			...flashMessage
		}
	}
	fragment flashMessage on FlashMessage {
		id
		messageType
		message
	}
`;

// graphql mutation to clear all flash messages
const clearFlashMessagesMutation = gql`
	mutation clearFlashMessages($visitorId: String!) {
		tips: clearFlashMessages(messageType: tip, visitorId: $visitorId)
		warnings: clearFlashMessages(messageType: warning, visitorId: $visitorId)
		errors: clearFlashMessages(messageType: error, visitorId: $visitorId)
	}
`;

// order of levels
const levels = [TIP, WARNING, ERROR];
// compare levels of message types to determine which is more important to display
const compareLevels = (a, b) => levels.indexOf(a) >= levels.indexOf(b);

export default {
	name: 'TheTipMessage',
	components: {
		KvToast,
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: tipMessageData,
		preFetch: true,
		result({ data }) {
			const showing = data?.tip?.visible ?? false;
			this.tipMessage = showing ? data?.tip ?? null : null;
		}
	},
	data() {
		return {
			initialPath: null,
			flashMessages: [],
			tipMessage: null,
		};
	},
	created() {
		this.initialPath = this.$route.path;
	},
	mounted() {
		// query for flash messages
		this.apollo.query({
			query: flashMessageQuery,
			variables: {
				visitorId: this.cookieStore.get('uiv'),
			},
		}).then(({ data }) => {
			const tips = data?.tips ?? [];
			const warnings = data?.warnings ?? [];
			const errors = data?.errors ?? [];
			this.flashMessages = [...errors, ...warnings, ...tips];
		}).then(() => {
			// clear all flash messages
			return this.apollo.mutate({
				mutation: clearFlashMessagesMutation,
				variables: {
					visitorId: this.cookieStore.get('uiv'),
				},
			});
		}).catch(err => {
			try {
				console.error(err);
				captureException(err);
			} catch (e) {
				// no-op
			}
		});
	},
	computed: {
		currentMessage() {
			// return tip message if it's level is higher than first flash message, otherwise return first flash message
			return this.tipMessage?.type && compareLevels(this.tipMessage.type, this.flashMessages[0]?.messageType)
				? this.tipMessage
				: this.flashMessages[0];
		},
		persist() {
			const type = this.currentMessage?.type ?? this.currentMessage?.messageType ?? '';
			return !!this.currentMessage?.persist || type === TIP || type === WARNING;
		},
	},
	methods: {
		showCurrentMessage() {
			const message = this.currentMessage?.message ?? '';
			const safeMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'] });
			const type = this.currentMessage?.type ?? this.currentMessage?.messageType ?? '';
			this.$refs.tip?.show(safeMessage, type, this.persist);
		},
		closeCurrentMessage() {
			if (this.currentMessage) {
				// close current message
				if (this.currentMessage === this.tipMessage) {
					this.$closeTipMsg();
				} else {
					this.flashMessages?.shift();
				}
				// show next message
				if (this.flashMessages?.length) {
					this.showCurrentMessage();
				}
			}
		},
	},
	watch: {
		// open and close the toast when the current message changes
		currentMessage: {
			handler(message) {
				if (message) {
					this.showCurrentMessage();
				} else {
					this.$refs.tip?.close();
				}
			},
			immediate: true,
		},
		/*
			Observe $route.path for changes
			- This enables us to hide the tip message when you navigate to another ui server page
			- Unless you pass the persist parameter in which case the tip message remains on ui server pages
			- The else if statement allows the message to show on subsequent visits rendering tip messages on a route
		*/
		// eslint-disable-next-line object-shorthand
		'$route.path'(to) {
			if (to !== this.initialPath && this.persist !== true) {
				this.$refs.tip?.close();
			} else if (to === this.initialPath) {
				this.showCurrentMessage();
			}
		},
	}

};
</script>
