<template>
	<a href="#">
		<div class="content">
			<span>Select a borrower to</span>
			<span class="call-to-action-text" href="#">lend your {{ bonusBalance | numeral('$0') }}</span>
		</div>
	</a>
</template>

<script>
export default {
	components: {
	},
	data() {
		return {
			bonusBalance: 40
		};
	},
};
</script>
