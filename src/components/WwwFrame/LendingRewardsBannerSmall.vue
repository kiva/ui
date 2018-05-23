<template>
	<div class="hide-for-xxlarge header-lending-reward-small">
		<a href="#">
			<div class="content">
				<span>Make a Kiva loan</span>
				<span class="call-to-action-text">and receive a $25 free credit to lend again.</span>
			</div>
		</a>
	</div>
</template>
<script>

export default {
	components: {
	},
	data() {
		return {
			// Need to hook this up to settings Manager
			isLendingRewardActive: true
		};
	},
	methods: {
	}
};
</script>
<style lang='scss'>
@import 'settings';

.header-lending-reward-small {
	text-align: center;
	background: $dark-green;
	font-size: $small-font-size;

	a {
		color: $kiva-accent-green;
	}

	.call-to-action-text {
		text-decoration: underline;
	}
}
</style>
