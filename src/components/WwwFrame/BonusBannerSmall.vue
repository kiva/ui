<template>
	<div class="hide-for-xxlarge header-bonus-small">
		<a href="#">
			<div class="content">
				<span>Select a borrower to</span>
				<span class="call-to-action-text" href="#">lend your</span>
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
			isBonusActive: true
		};
	},
	methods: {
		onPageShow() {

		}
	}
};
</script>

<style lang='scss'>
@import 'settings';

.header-bonus-small {
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
