<template functional>
	<div class="reservation-info small-text">
		Reserved for {{ props.expiryTime }} ## {{ props.isEndingSoon }}more minutes
	</div>
</template>

<script>
export default {
	props: {
		expiryTime: {
			type: String,
			default: ''
		},
		isEndingSoon: {
			type: Boolean,
			default: false
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.reservation-info {
	color: $kiva-text-light;
}
</style>
