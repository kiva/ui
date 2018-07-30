<template>
	<transition name="kvfade">
		<div v-if="tipVisible" class="message-text text-center small-12" :class="typeClass">
			<span class="message-content">
				<div class="icon-wrapper">
					<kv-icon :name="iconName" />
				</div>
				<p class="message">{{ tipMsg }}</p>
			</span>
			<a @click.stop.prevent="$closeTipMsg" class="close-tip-message" aria-label="Close">
				<kv-icon name="x" />
			</a>
		</div>
	</transition>
</template>

<script>
import _get from 'lodash/get';
import tipMessageData from '@/graphql/query/tipMessageData.graphql';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	inject: ['apollo'],
	data() {
		return {
			tipVisible: false,
			tipPersist: false,
			tipInitUrl: '',
			tipMsg: '',
			tipMsgType: ''
		};
	},
	computed: {
		typeClass() {
			// Valid options are 'warning' + 'error' otherwise use confirmation as default
			if (this.tipMsgType === 'warning' || this.tipMsgType === 'error') {
				return `message-text-${this.tipMsgType}`;
			}
			return 'message-text-confirmation';
		},
		iconName() {
			// warning icon-info, error icon-error
			if (this.tipMsgType === 'warning') {
				return 'info';
			} else if (this.tipMsgType === 'error') {
				return 'error';
			}
			// default icon-confirmation
			return 'confirmation';
		}
	},
	apollo: {
		query: tipMessageData,
		preFetch: true,
		result({ data }) {
			// set/update our local data
			this.tipMsg = _get(data, 'tipMsg');
			this.tipMsgType = _get(data, 'tipMsgType');
			this.tipVisible = _get(data, 'tipVisible');
			this.tipPersist = _get(data, 'tipPersist');
			this.tipInitUrl = _get(data, 'tipInitUrl');
		}
	},
	watch: {
		/*
			Observe $route.path for changes
			- This enables us to hide the tip message when you navigate to another ui server page
			- Unless you pass the tipPersist parameter in which case the tip message remains on ui server pages
			- The else if statement allows the message to show on subsequent visits rendering tip messages on a route
		*/
		// eslint-disable-next-line object-shorthand
		'$route.path'(to) {
			if (to !== this.tipInitUrl && this.tipPersist !== true) {
				this.tipVisible = false;
			} else if (to === this.tipInitUrl) {
				this.tipVisible = true;
			}
		}
	},
};
</script>

<style lang="scss">
@import 'settings';
@import 'global/transitions';

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
		line-height: $small-text-line-height;

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
		top: rem-calc(9);
		right: rem-calc(6);

		.icon.icon-x {
			stroke: $kiva-text-dark;
			height: rem-calc(30);
			width: rem-calc(30);
			margin-top: rem-calc(2);
		}
	}

	//Custom styles for the 3 types of messages (default/Confirmation, Warning & Error messages)
	&.message-text-confirmation {
		background-color: $kiva-bg-lightgray;
		border-bottom: 1px solid $kiva-text-dark;

		.icon.icon-confirmation {
			fill: $kiva-green;
		}
	}

	&.message-text-warning {
		background-color: $kiva-alert-yellow;

		.icon.icon-warning {
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
