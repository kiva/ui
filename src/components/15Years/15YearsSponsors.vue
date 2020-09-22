<template>
	<div class="sponsors section">
		<div class="row">
			<div class="columns">
				<section>
					<fifteen-years-section-header class="sponsors__header">
						<template v-slot:header>
							Strategic Partners
						</template>
						<template v-slot:subhead>
							Individuals and Organizations <br class="smo"><br class="xxlu"> making a difference
						</template>
					</fifteen-years-section-header>
				</section>
				<section>
					<h3>Our Selected Partners</h3>
					<fifteen-years-button variant="black">
						button
					</fifteen-years-button>
					<p>Below taken from IWD homepage</p>
					<div class="sponsors__selected">
						<ul class="sponsors__list row">
							<li class="sponsors__li small-6 large-4 columns">
								<img
									class="sponsors__logo"
									src="@/assets/images/iwd/partner-fossil.svg"
									alt="Fossil Foundation"
									loading="lazy"
								>
							</li>
							<li class="sponsors__li small-6 large-4 columns">
								<img
									class="sponsors__logo sponsors__logo--ebay"
									src="@/assets/images/iwd/partner-ebay.svg"
									alt="eBay"
									loading="lazy"
								>
							</li>
							<li class="sponsors__li small-6 large-4 columns">
								<img
									class="sponsors__logo"
									src="@/assets/images/iwd/partner-boa.svg"
									alt="Bank of America"
									loading="lazy"
								>
							</li>
							<li class="sponsors__li small-6 large-4 columns">
								<img
									class="sponsors__logo"
									src="@/assets/images/iwd/partner-wage.svg"
									alt="Women and Girls Empowered"
									loading="lazy"
								>
							</li>
							<li class="sponsors__li small-6 large-4 columns">
								<img
									class="sponsors__logo sponsors__logo--visa"
									src="@/assets/images/iwd/partner-visa.png"
									alt="Visa Foundation"
									loading="lazy"
								>
							</li>
							<li class="sponsors__li small-6 large-4 columns">
								<img
									class="sponsors__logo"
									src="@/assets/images/iwd/partner-cartier.svg"
									alt="Cartier"
									loading="lazy"
								>
							</li>
							<li class="sponsors__li small-6 large-4 columns">
								<img
									class="sponsors__logo"
									src="@/assets/images/iwd/partner-sp-global.svg"
									alt="S&amp;P Global Foundation"
									loading="lazy"
								>
							</li>
							<li class="sponsors__li small-6 large-4 columns">
								<img
									class="sponsors__logo"
									src="@/assets/images/iwd/partner-grameen.svg"
									alt="Grameen Foundation"
									loading="lazy"
								>
							</li>
							<li class="sponsors__li small-6 large-4 columns">
								<img
									class="sponsors__logo"
									src="@/assets/images/iwd/partner-principle.svg"
									alt="Principle Foundation"
									loading="lazy"
								>
							</li>
						</ul>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script>
import FifteenYearsButton from './15YearsButton';
import FifteenYearsSectionHeader from './15YearsSectionHeader';

export default {
	components: {
		FifteenYearsButton,
		FifteenYearsSectionHeader
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.sponsors {
	background-color: $offwhite;

	&__header {
		--section-header-line-color: #{$twighlight};
	}

	&__selected {
		max-width: 30rem;
		margin: 0 auto;
	}

	&__list {
		list-style: none;
		margin-bottom: 2rem;
		filter: grayscale(100%); // TODO: If we're positive we're grayscaling all the logos we should do so in SVG
	}

	&__li {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 1rem;
		padding-bottom: 1rem;

		@include breakpoint('large') {
			&:nth-of-type(3n + 1) { // first column
				justify-content: flex-start;
			}

			&:nth-of-type(3n + 3) { // last column
				justify-content: flex-end;
			}
		}
	}

	&__logo {
		width: 66%;
		height: auto;

		&--ebay {
			width: 50%;
		}

		&--visa {
			width: 45%;
			opacity: 0.7;
		}
	}
}
</style>
