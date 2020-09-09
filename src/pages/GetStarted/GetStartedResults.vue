<template>
	<div>
		<kv-progress-bar value="100" max="100" />
		<div class="row column page-content">
			<h1>Here are X people you can support!</h1>
			<p>
				In fact, we found X people that we think you’ll love to lend to.
				<!-- <router-link>View all loans</router-link> -->
			</p>
			<div>loans here</div>

			<section>
				<h2>Looking for different loans?</h2>
			</section>

			<section class="how-it-works section text-center">
				<h2 class="how-it-works__header">
					Here's how it works
				</h2>
				<div class="how-it-works__line show-for-large">
					<div class="how-it-works__circle"></div>
					<div class="how-it-works__circle"></div>
					<div class="how-it-works__circle"></div>
				</div>
				<ol class="how-it-works__list row align-justify">
					<li class="how-it-works__li small-12 large-4 columns">
						<kv-responsive-image
							class="how-it-works__img how-it-works__img--loan show-for-large"
							:images="howItWorksImgs.loan"
							loading="lazy"
							alt=""
						/>
						<h3 class="how-it-works__subtitle">
							Support a loan<br class="xxlu"> today!
						</h3>
						<p>
							Make an impact with as<br class="xxlu"> little as $25.
						</p>
					</li>
					<li class="how-it-works__li small-12 large-4 columns">
						<kv-responsive-image
							class="how-it-works__img how-it-works__img--people show-for-large"
							:images="howItWorksImgs.people"
							loading="lazy"
							alt=""
						/>
						<h3 class="how-it-works__subtitle">
							Lenders around the world<br class="xxlu"> help fund the loan
						</h3>
						<p>This takes up to thirty days.</p>
					</li>
					<li class="how-it-works__li small-12 large-4 columns">
						<kv-responsive-image
							class="how-it-works__img how-it-works__img--repaid show-for-large"
							:images="howItWorksImgs.repaid"
							loading="lazy"
							alt=""
						/>
						<h3 class="how-it-works__subtitle">
							Get repaid after your<br class="xxlu"> borrower uses their loan
						</h3>
						<p>You can use the repayments to support more borrowers or withdraw it.</p>
					</li>
				</ol>
			</section>

			<section class="section">
				<frequently-asked-questions />
				<kv-responsive-image
					class="faq__flourish"
					:images="flourishImgs.greenLeft"
					loading="lazy"
					alt=""
				/>
			</section>
		</div>
	</div>
</template>

<script>
import FrequentlyAskedQuestions from '@/components/GetStarted/FrequentlyAskedQuestions';
import KvProgressBar from '@/components/Kv/KvProgressBar';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const imgRequire = require.context('@/assets/images/lend-by-category-homepage/', true);

export default {
	components: {
		FrequentlyAskedQuestions,
		KvProgressBar,
		KvResponsiveImage,
	},
	data() {
		return {
			howItWorksImgs: {
				loan: [
					['small', imgRequire('./how-it-works-loan.png')],
					['small retina', imgRequire('./how-it-works-loan_2x.png')],
				],
				repaid: [
					['small', imgRequire('./how-it-works-repaid.png')],
					['small retina', imgRequire('./how-it-works-repaid_2x.png')],
				],
				people: [
					['small', imgRequire('./loan-not-donation.png')],
					['small retina', imgRequire('./loan-not-donation_2x.png')],
				],
			},
			flourishImgs: {
				greenLeft: [
					['small', imgRequire('./flourish-green-left.png')],
					['large', imgRequire('./flourish-green-left.png')],
					['large retina', imgRequire('./flourish-green-left_2x.png')],
				],
			},
		};
	},
	metaInfo: {
		title: 'Results - Get Started'
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding-top: 6rem;
}

// utils
.section {
	padding: 2.5rem 0;

	@include breakpoint(large) {
		padding: 5rem 0;
	}
}

.faq__flourish {
	position: absolute;
	width: 20%;
	max-width: 17rem;
	top: auto;
	left: -7%;
	pointer-events: none;
	bottom: 0%;

	@include breakpoint(large) {
		height: rem-calc(470);
		overflow: hidden;
	}
}

.how-it-works {
	position: relative;

	&__header {
		font-weight: bold;
		margin-bottom: 2.5rem;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	&__list {
		list-style: none;
		margin-top: 1rem;
		margin-bottom: 0;
		text-align: left;
		position: relative;

		&::before {
			content: "";
			display: inline-block;
			height: 58%;
			width: 1px;
			background: $kiva-stroke-gray;
			position: absolute;
			top: rem-calc(6);
			left: rem-calc(-1.5);
			min-height: rem-calc(155);
		}

		@include breakpoint(large) {
			text-align: center;

			&::before {
				content: none;
			}
		}

		@include breakpoint(medium down) {
			padding-left: rem-calc(10);
			margin-left: rem-calc(15);
		}
	}

	&__li {
		margin-bottom: 1rem;
		position: relative;

		&::before {
			content: '';
			display: inline-block;
			height: rem-calc(17);
			width: rem-calc(17);
			background: $white;
			border-radius: 50%;
			border: 1px solid $kiva-stroke-gray;
			position: absolute;
			top: 0;
			left: rem-calc(-20);
		}

		@include breakpoint(large) {
			&::before {
				content: none;
			}
		}
	}

	&__img {
		margin: 0 auto 4rem;

		&--loan {
			width: rem-calc(96);
			height: rem-calc(78);
		}

		&--repaid {
			width: rem-calc(68);
			height: rem-calc(78);
		}

		&--people {
			width: rem-calc(67);
			height: rem-calc(78);
		}
	}

	&__subtitle {
		font-weight: bold;
		margin-bottom: 0.25rem;
		line-height: 1.25rem;

		@include breakpoint(large) {
			@include medium-text();

			margin-bottom: 0.85rem;
		}
	}

	&__line {
		border-bottom: 1px solid $kiva-stroke-gray;
		position: absolute;
		top: rem-calc(280);
		width: 70%;
		left: 50%;
		margin-left: -35%;
	}

	&__circle {
		height: rem-calc(17);
		width: rem-calc(17);
		border-radius: 50%;
		border: 1px solid $kiva-stroke-gray;
		background-color: $white;
		position: absolute;
		top: -8.5px;
		left: 50%;
		margin-left: -8.5px;

		&:first-child {
			left: 0;
		}

		&:last-child {
			right: -8.5px;
			left: auto;
		}
	}

	p {
		line-height: 1rem;
	}
}
</style>
