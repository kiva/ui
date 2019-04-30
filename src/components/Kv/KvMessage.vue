<template>
	<div class="kv-message message-text text-center message-text-confirmation" v-if="safeMessage">
		<div class="kv-message-row">
			<img class="kv-message-image" src="~@/assets/images/beta-icon.svg">
			<div class="kv-message-message">
				<p class="message" v-html="safeMessage"></p>
			</div>
		</div>
	</div>
</template>

<script>
import sanitize from 'sanitize-html';

export default {
	props: {
		message: {
			type: String,
			default: '',
		},
	},
	computed: {
		safeMessage() {
			return sanitize(this.message, {
				allowedTags: ['b', 'i', 'em', 'strong', 'a', 'v-kv-track-event'],
				allowedAttributes: {
					a: ['href'],
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-message {
	top: auto;
	z-index: 1;
	position: relative;

	.kv-message-row {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-right: 0.625rem;
		padding-left: 0.625rem;

		.kv-message-image {
			width: 53px;
			margin-right: 0.5rem;
			display: inline-block;
			flex-shrink: 0;
		}

		p.message {
			max-width: 100%;
		}

		@include breakpoint(medium) {
			padding-right: 0.9375rem;
			padding-left: 0.9375rem;
		}
	}
}
</style>
