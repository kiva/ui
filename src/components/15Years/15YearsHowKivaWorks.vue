<template>
	<div class="works section text-center">
		<div class="row">
			<div class="columns small-12">
				<h2 class="impact-text">
					How Kiva Works
				</h2>
				<p>
					By lending as little as $25 on Kiva, you support<br>
					the causes you care about and make real person impact.
				</p>
			</div>
		</div>

		<div class="row text-center">
			<div class="small-12 large-4 columns">
				<img
					src="@/assets/images/15-years/how-kiva-works-choose.svg"
					loading="lazy"
				>
				<h4 class="no-wrap">
					Choose a borrower
				</h4>
				<div class="description-text">
					<p>Browse by category and find<br>an entrepeneur to support.</p>
				</div>
			</div>
			<div class="small-12 large-4 columns">
				<img
					src="@/assets/images/15-years/how-kiva-works-make.svg"
					loading="lazy"
				>
				<h4>Make a loan</h4>
				<div class="description-text">
					<p>Help fund a loan with as little as $25.</p>
				</div>
			</div>
			<div class="small-12 large-4 columns">
				<img
					src="@/assets/images/15-years/how-kiva-works-repaid.svg"
					loading="lazy"
				>
				<h4>Get repaid</h4>
				<div class="description-text">
					<p>Kiva borrowers have a 96% repayment<br>rate historically.</p>
				</div>
			</div>
			<div class="small-12 columns">
				<img
					src="@/assets/images/15-years/how-kiva-works-repeat.svg"
					loading="lazy"
				>
				<h4>Repeat</h4>
				<div class="description-text">
					<p>Relend your money or withdraw your<br>funds.</p>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="columns">
				<h2>
					Join over 1.9 million fellow <br>changemakers
				</h2>
				<img
					src="@/assets/images/15-years/change-maker-dots.svg"
					loading="lazy"
				>
			</div>
		</div>
		<img
			src="@/assets/images/15-years/footer-background.svg"
			loading="lazy"
		>
	</div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.works {
	background: #fff;

	.no-wrap {
		white-space: nowrap;
	}
}
</style>
