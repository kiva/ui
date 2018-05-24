<template>
	<a href="#">
		<div class="content">
			<span>Make a Kiva loan</span>
			<span class="call-to-action-text">and receive a $25 free credit to lend again.</span>
		</div>
	</a>
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
