<template>
	<div class="wrapper">
		<!-- Image -->
		<loan-card-image />

		<div>
			<!-- Name in small-text -->
			<div class="small-text name">Name</div>

			<!-- loan meter	 -->

			<!-- Country -->

			<!-- Sector -->

			<!-- Add to basket text -->

		</div>
	</div>
</template>
<script>
import LoanCardImage from '@/components/LoanCards/LoanCardImage';

export default {
	components: {
		LoanCardImage,
	},
};

</script>
<style lang="scss" scoped>
@import 'settings';

.wrapper {
	width: rem-calc(180);
	height: rem-calc(280);
	border: 1px solid $kiva-stroke-gray;
}

.name {
	font-weight: 400;
	color: $kiva-text-dark;
}

</style>
