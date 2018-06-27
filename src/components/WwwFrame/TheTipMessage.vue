<template>
	<div v-if="tipVisible" class="message-text message-text-confirmation text-center small-12">
		<span class="message-content">
			<div class="icon-wrapper">
				<kv-icon name="info" />
			</div>
			<p class="message">{{ tipMsg }} {{ tipMsgType }}</p>
		</span>
		<a @click="close" class="close-tip-message" aria-label="Close">
			<kv-icon name="x" />
		</a>
	</div>
</template>

<script>
import _get from 'lodash/get';
import tipMessageData from '@/graphql/query/tipMessageData.graphql';
import updateTipMessage from '@/graphql/mutation/updateTipMessage.graphql';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	inject: ['apollo'],
	data() {
		return {
			tipVisible: false,
			tipMsg: '',
			tipMsgType: 'info'
		};
	},
	methods: {
		close() {
			console.log('close tip message');
			this.apollo.mutate({
				mutation: updateTipMessage,
				variables: {
					tipMsg: this.tipMsg,
					tipMsgType: this.tipMsgType,
					tipVisible: false
				}
			});
		}
	},
	// apollo: {
	// 	query: tipMessageData,
	// 	// preFetch: true,
	// 	result({ data }) {
	// 		// eslint-disable-next-line no-console
	// 		console.log(`tip message queried: ${JSON.stringify(data)}`);
	// 		this.tipMsg = _get(data, 'tipMsg');
	// 		this.tipMsgType = _get(data, 'tipMsgType');
	// 		this.showTipOnLoad = _get(data, 'showTipOnLoad');

	// 		this.show();
	// 	},
	// },
	mounted() {
		this.apollo.watchQuery({ query: tipMessageData }).subscribe({
			next: ({ data }) => {
				// eslint-disable-next-line no-console
				console.log(`tip message queried: ${JSON.stringify(data)}`);

				this.tipMsg = _get(data, 'tipMsg');
				this.tipMsgType = _get(data, 'tipMsgType');
				this.tipVisible = _get(data, 'tipVisible');
			}
		});
	}
};
</script>

<style lang="scss">
@import 'settings';

.message-text {
	display: block;
	width: 100%;
	overflow: hidden;
	position: fixed;
	top: 0;
	z-index: 10000;

	.icon-wrapper {
		display: inline-block;
		vertical-align: middle;
		margin-left: rem-calc(-40);
		padding-top: rem-calc(9);
		padding-bottom: rem-calc(9);

		.icon {
			margin-right: rem-calc(10);
			margin-top: rem-calc(2);
			height: rem-calc(30);
			width: rem-calc(30);
		}
	}

	.message {
		display: inline-block;
		margin: auto;
		vertical-align: middle;
		max-width: 60%;
		padding-top: rem-calc(9);
		padding-bottom: rem-calc(9);
	}

	.close-tip-message {
		position: absolute;
		top: rem-calc(2);
		right: rem-calc(2);

		.icon.icon-x {
			stroke: $kiva-text-dark;
			height: rem-calc(30);
			width: rem-calc(30);
			margin-top: rem-calc(2);
		}
	}

	//Custom styles for the 3 types of messages (Confirmation, Warning & Error messages)
	&.message-text-confirmation {
		background-color: $kiva-bg-lightgray;
		border-bottom: 1px solid $kiva-text-dark;

		.icon.icon-confirmation {
			fill: $kiva-green;
		}
	}

	&.message-text-warning,
	&.message-text-info {
		background-color: $kiva-alert-yellow;

		.icon.icon-warning,
		.icon.icon-info {
			fill: $kiva-text-dark;
		}
	}

	&.message-text-error {
		background-color: $kiva-accent-red;

		.icon.icon-error {
			fill: $white;
		}

		.message {
			color: $white;
		}

		.icon.icon-x {
			stroke: $white;
		}
	}
}
</style>
