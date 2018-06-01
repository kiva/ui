<template>
	<router-link to="/gifts" class="gift-banner">
		<div class="message-wrapper">
			<kv-icon name="kiva-card" class="kiva-card-icon"/>
			<div class="content">
				Light up a life this holiday season.<br>
				<span class="call-to-action-text">Give a Kiva gift.</span>
			</div>
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

	.message-wrapper {
		margin: 0 auto;
		max-width: 18rem;
		text-align: left;
	}

	.kiva-card-icon {
		height: rem-calc(45);
		width: rem-calc(45);
		transform: rotate(-10deg);
		float: left;
		margin-right: 0.75rem;
		fill: $kiva-accent-green;
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
	.gifts-banner {
		background-color: $kiva-green;
	}
}
</style>
