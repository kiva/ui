<template>
	<div class="works section text-center">
		<div class="row">
			<div class="works__heading-group small-12 columns">
				<h2 class="works__headline impact-text ">
					How Kiva Works
				</h2>
				<p>
					By lending as little as $25 on Kiva, you support<br>
					the causes you care about and make real person impact.
				</p>
			</div>
		</div>

		<div class="row text-center">
			<div class="works__step small-12 large-4 columns">
				<img
					class="works__step--img-choose"
					src="@/assets/images/15-years/how-kiva-works-choose.svg"
					loading="lazy"
				>
				<h4 class="works__step--text">
					Choose a borrower
				</h4>
				<div class="works__step--text">
					<p>Browse by category and find<br>an entrepeneur to support.</p>
				</div>
			</div>
			<div class="works__step small-12 large-4 columns">
				<img
					class="works__step--img-make"
					src="@/assets/images/15-years/how-kiva-works-make.svg"
					loading="lazy"
				>
				<h4>Make a loan</h4>
				<div class="works__step--text">
					<p>Help fund a loan with as little as $25.</p>
				</div>
			</div>
			<div class="works__step small-12 large-4 columns">
				<img
					class="works__step--img-repaid"
					src="@/assets/images/15-years/how-kiva-works-repaid.svg"
					loading="lazy"
				>
				<h4>Get repaid</h4>
				<div class="works__step--text">
					<p>Kiva borrowers have a 96% repayment<br>rate historically.</p>
				</div>
			</div>
			<div class="works__step small-12 columns">
				<img
					class="works__step--img-repeat"
					src="@/assets/images/15-years/how-kiva-works-repeat.svg"
					loading="lazy"
				>
				<h4>Repeat</h4>
				<div class="works__step--text">
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

	&__heading-group {
		margin: 6.25rem 0;
	}

	&__headline {
		margin-bottom: 2.5rem;
	}

	&__step {
		&--img-choose {
			width: 128px;
		}

		&--img-make {
			width: 113px;
		}

		&--img-repaid {
			width: 230px;
		}

		&--img-repeat {
			width: 140px;
		}

		&--img--text {
			white-space: nowrap;
		}
	}
}
</style>
