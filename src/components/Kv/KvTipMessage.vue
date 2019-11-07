<template>
	<transition name="kvfade">
		<div v-if="visible" class="message-text text-center small-12" :class="typeClass">
			<span class="message-content">
				<div class="icon-wrapper">
					<kv-icon :name="iconName" />
				</div>
				<p class="message" v-html="safeMessage"></p>
			</span>
			<button @click="close" class="close-tip-message" aria-label="Close">
				<kv-icon name="x" />
			</button>
		</div>
	</transition>
</template>

<script>
import sanitize from 'sanitize-html';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	data() {
		return {
			visible: false,
			persist: false,
			initialPath: '',
			message: '',
			messageType: ''
		};
	},
	computed: {
		typeClass() {
			// Valid options are 'warning' + 'error' otherwise use confirmation as default
			if (this.messageType === 'warning' || this.messageType === 'error') {
				return `message-text-${this.messageType}`;
			}
			return 'message-text-confirmation';
		},
		iconName() {
			// warning icon-info, error icon-error
			if (this.messageType === 'warning') {
				return 'info';
			}
			if (this.messageType === 'error') {
				return 'error';
			}
			// default icon-confirmation
			return 'confirmation';
		},
		safeMessage() {
			return sanitize(this.message, {
				allowedTags: ['b', 'i', 'em', 'strong', 'a'],
				allowedAttributes: {
					a: ['href'],
				},
			});
		}
	},
	methods: {
		show(message, type, persist) {
			this.initialPath = this.$route.path;
			this.visible = true;
			this.message = typeof message === 'string' ? message : '';
			this.messageType = typeof type === 'string' ? type : '';
			this.persist = !!persist;
		},
		close() {
			this.visible = false;
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
				this.visible = false;
			} else if (to === this.initialPath) {
				this.visible = true;
			}
		},
		visible(visible) {
			if (!visible) {
				this.$emit('close');
			}
		},
	},
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
	left: 0;
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
