<template>
	<div class="show-for-xxlarge header-lending-reward-large">
		<a href="#">
			<div class="content">
				<div>Make a Kiva loan</div>
				<div class="call-to-action-text">and receive a $25 free credit to lend again.</div>
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


.header-lending-reward-large {
	position: relative;
	top: rem-calc(-66);
	margin-top: .6875rem;

	a {
		text-decoration: none;
		color: $light-green;
	}

	.content {
		font-size: $small-font-size;
		font-weight: bold;
		color: $dark-green;
		text-align: center;
		line-height: 1.357rem; // I want to use $small-line-height here
		max-width: 95%;
		z-index: 10;

		.call-to-action-text {
			text-decoration: underline;
		}
	}
}
</style>
