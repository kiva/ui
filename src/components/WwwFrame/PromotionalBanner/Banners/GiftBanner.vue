<template>
	<router-link to="/gifts" class="gift-banner">
		<kv-icon name="kiva-card" class="kiva-card-icon show-for-xxlarge"/>
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
	margin: 0 auto;

	@include breakpoint(xxlarge) {
		max-width: 18rem;
	}

	.kiva-card-icon {
		height: rem-calc(45);
		width: rem-calc(45);
		transform: rotate(-10deg);
		float: left;
		fill: $kiva-darkgreen;
	}
}
</style>
