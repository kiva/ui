<template>
	<router-link to="/gifts" class="gift-banner">
		<kv-icon name="kiva-card" class="kiva-card-icon"/>
		<div class="content">
			Light up a life this holiday season.<br class="so xxlu">
			<span class="call-to-action-text">Give a Kiva gift.</span>
		</div>
	</router-link>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
};
</script>

<style lang='scss'>
@import 'settings';

.gift-banner {
	display: block;
	color: $kiva-accent-green;
	background-color: $kiva-darkgreen;
	font-weight: bold;
	border-bottom: 1px solid $kiva-navdivider-green;

	&:hover,
	&:active {
		color: $kiva-accent-green;
	}

	.kiva-card-icon {
		height: rem-calc(30);
		width: rem-calc(40);
		transform: rotate(-10deg);
		margin-top: 0.1875rem;
		fill: $kiva-accent-green;
	}

	.content {
		display: inline-block;
		margin-left: 0.3125rem;

		@include breakpoint(medium) {
			transform: translateY(-26%);
		}

		@include breakpoint(xxlarge) {
			transform: inherit;
		}
	}

	@include breakpoint(xxlarge) {
		border: none;

		.message-wrapper {
			text-align: center;
		}

		.kiva-card-icon {
			fill: $kiva-darkgreen;
			margin-right: 0;
		}
	}
}

@include breakpoint(xxlarge) {
	.gift-banner {
		background-color: $kiva-green;
		margin-left: 1px;
	}
}
</style>
