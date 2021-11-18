<template>
	<www-page-minimal>
		<div class="page-wrap">
			<router-view />
		</div>
	</www-page-minimal>
</template>

<script>
import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';

export default {
	components: {
		WwwPageMinimal,
	},
	metaInfo: {
		title: 'Get Started'
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-wrap {
	position: relative;
	overflow: hidden;

	@include breakpoint(large) {
		background: $kiva-bg-lightgray;
	}
}
</style>
