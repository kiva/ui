<template>
	<a href="#" class="gift-banner">
		<kv-icon name="kiva-card" class="kiva-card-icon show-for-xxlarge"/>
		<div class="content">
			<div>Make spirits bright this holiday season.</div>
			<div class="call-to-action-text">Give a Kiva gift.</div>
		</div>
	</a>
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
	.kiva-card-icon {
		height: rem-calc(45);
		width: rem-calc(45);
		transform: rotate(-10deg);
		float: left;
		margin-left: rem-calc(50);
	}
}
</style>
