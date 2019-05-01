<template functional>
	<div class="kv-message message-text text-center message-text-confirmation">
		<div class="kv-message-row">
			<img class="kv-message-image" src="~@/assets/images/beta-icon.svg">
			<div class="kv-message-message">
				<p class="message">
					<slot></slot>
				</p>
			</div>
		</div>
	</div>
</template>

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
		user-select: none;

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
