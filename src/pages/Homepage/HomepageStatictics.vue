<template>
	<div class="row stats-box">
		<!-- loans funded -->
		<div class="small-6 columns stats-box__group">
			<div class="stats-box__stat">
				### B
			</div>
			<p>loans funded</p>
		</div>
		<!-- # lenders  -->
		<div class="small-6 columns">
			<div class="stats-box__stat">
				### M
			</div>
			<p>lenders</p>
		</div>
		<!-- repayment rate -->
		<div class="small-6 columns stats-box__group">
			<div class="stats-box__stat">
				### %
			</div>
			<p>repayment rate</p>
		</div>
		<!-- # countries  -->
		<div class="small-6 columns">
			<div class="stats-box__stat">
				###
			</div>
			<p>countries</p>
		</div>
		<!-- # years -->
		<div class="small-12 columns">
			<div class="stats-box__stat">
				###
			</div>
			<p>years</p>
		</div>
	</div>
</template>

<script>

export default {
};
</script>

<style lang="scss" scoped>
@import 'settings';

.stats-box {
	// margin: 0 rem-calc(10);
	margin: 0 auto;
	border-radius: rem-calc(25);
	background-color: $kiva-accent-blue;
	color: $white;
	padding: 50px 0;

	&__group {
		margin-bottom: 40px;
		border-right: 3px solid rgba(0, 0, 0, 0.2);

		@include breakpoint(medium) {
			margin-bottom: 0;
		}
	}

	&__stat {
		@include featured-text();
	}
}
</style>
