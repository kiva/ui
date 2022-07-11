<template>
	<div class="partners">
		<div class="row">
			<div class="columns">
				<section>
					<fifteen-years-section-header class="partners__header">
						<template #header>
							Strategic Partners
						</template>
						<template #subhead>
							Individuals and organizations <br class="smo"><br class="xxlu"> making a difference
						</template>
					</fifteen-years-section-header>
				</section>
				<section class="strategic-partners">
					<ul class="strategic-partners__list row collapse">
						<li
							class="strategic-partners__li small-12 medium-6 large-4 columns"
							v-observe-visibility="{
								callback: animateTotalImpact,
								once: true,
							}"
						>
							<div class="strategic-partners__total-impact">
								<h3
									class="strategic-partners__total-impact-headline"
								>
									Our<br>
									strategic<br>
									partners’<br>
									total<br>
									impact:
								</h3>
								<ul
									class="strategic-partners__stats strategic-partners__stats--total-impact shown"
								>
									<li class="row align-bottom collapse">
										<h3 class="shrink column">
											${{ totalImpactDonations }}M
										</h3>
										<h5 class="column">
											In donations
										</h5>
									</li>
									<li class="row align-bottom collapse">
										<h3 class="shrink column">
											${{ totalImpactDisbursed }}M
										</h3>
										<h5 class="column">
											disbursed to borrowers
										</h5>
									</li>
									<li class="row align-bottom collapse">
										<h3 class="shrink column">
											{{ totalImpactBorrowersFunded }}M
										</h3>
										<h5 class="column">
											Borrowers funded
										</h5>
									</li>
								</ul>
							</div>
						</li>
						<li
							class="strategic-partners__li small-12 medium-6 large-4 columns"
							v-for="partner in strategicPartners"
							:key="partner.key"
						>
							<div class="strategic-partners__partner">
								<div class="strategic-partners__logo-wrapper">
									<img
										:class="`strategic-partners__logo strategic-partners__logo--${partner.key}`"
										:src="partner.logo"
										:alt="partner.alt"
										loading="lazy"
									>
								</div>
								<ul class="strategic-partners__stats" :class="{'shown': partner.showStats}">
									<li
										class="row align-bottom collapse"
										v-for="(partnerStats, index) in partner.stats"
										:key="index"
									>
										<h3 class="shrink column">
											{{ partnerStats[0] }}
										</h3>
										<h5 class="column">
											{{ partnerStats[1] }}
										</h5>
									</li>
								</ul>
								<p :class="{'expanded': !partner.showStats}" :ref="partner.key">
									{{ partner.text }}
								</p>
								<div class="fade"></div>
								<fifteen-years-button
									variant="black"
									@click="togglePartner(partner.key)"
								>
									{{ partner.showStats ? 'read more' : 'back to stats' }}
								</fifteen-years-button>
							</div>
						</li>
					</ul>
				</section>
				<fifteen-years-supporting-partners />
			</div>
		</div>
	</div>
</template>

<script>
import gsap from 'gsap';

import FifteenYearsButton from './15YearsButton';
import FifteenYearsSectionHeader from './15YearsSectionHeader';
import FifteenYearsSupportingPartners from './15YearsSupportingPartners';

const imgRequire = require.context('@/assets/images/15-years/partners/', true);

export default {
	name: '15YearsPartners',
	components: {
		FifteenYearsButton,
		FifteenYearsSectionHeader,
		FifteenYearsSupportingPartners,
	},
	data() {
		return {
			totalImpactDonations: 101,
			totalImpactDisbursed: 130,
			totalImpactBorrowersFunded: 1.5,
			strategicPartners: [
				{
					key: 'paypal',
					showStats: true,
					alt: 'PayPal',
					logo: imgRequire('./Partner-paypal.svg'),
					stats: [
						['15', 'Years of partnership'],
						['$1.45B', 'Loans Through kiva.org'],
						['$2.2M', 'From 38k+ customers and employees'],
					],
					// eslint-disable-next-line max-len
					text: 'Kiva and PayPal have a unique and deep collaboration, unified by a shared purpose of empowering entrepreneurs around the world by democratizing financial services. The connection is not surprising: Kiva was co-founded by Premal Shah, a former PayPal employee, and has been powered from the beginning with free payment processing from PayPal, ensuring that 100% of every dollar goes to fund loans on Kiva.org, which has resulted in over $1.45 billion in loans to support entrepreneurs from around the world. In addition to this, PayPal engages customers and employees to lend on Kiva.org every year.'
				},
				{
					key: 'mastercard',
					showStats: true,
					alt: 'Mastercard Foundation',
					logo: imgRequire('./Partner-mastercard.svg'),
					stats: [
						['4', 'Years of partnership'],
						['52', 'New loan products'],
						['400k', 'Borrowers'],
					],
					// eslint-disable-next-line max-len
					text: 'Kiva and the Mastercard Foundation have partnered to test, develop, and scale high-impact loans serving the unique needs of smallholder farmers and rural populations across Africa. The Mastercard Foundation is supporting the Kiva Labs approach to push the boundaries of microcredit and deepen our commitment to impact measurement and management. As part of this partnership, Kiva has been able to bring together over 50 of our partners at the Kiva Labs Innovation Conference, design and deploy technical assistance to over 30 lending partners, and deepen our commitment to impact measurement and management.'
				},
				{
					key: 'ebay',
					showStats: true,
					alt: 'Ebay',
					logo: imgRequire('./Partner-ebay.svg'),
					stats: [
						['3', 'Years of partnership'],
						['1k+', 'Employees engaged'],
						['$1M', 'Lent'],
					],
					// eslint-disable-next-line max-len
					text: 'Kiva and eBay share a belief that the internet can be an empowering force that helps create opportunities for people across the globe. The partnership advances eBay Foundation’s mission to unleash the power of entrepreneurship to build economically vibrant and sustainable communities and connects eBay’s employees to direct impact in the lives of others. Through four employee lending campaigns, as well as matching funds on Kiva.org, the eBay Foundation has lent $1M to nearly 30,000 entrepreneurs across 70 countries. Additionally, the San Jose, California-based company has funded 250 small businesses locally through grants to Kiva, driving sustainable local economic growth.'
				},
				{
					key: 'visa',
					showStats: true,
					alt: 'Visa',
					logo: imgRequire('./Partner-visa.svg'),
					stats: [
						['1', 'Year of partnership'],
						['67%', 'of global employees are lenders'],
						['$700k', 'In loans'],
					],
					// eslint-disable-next-line max-len
					text: 'At the heart of the Visa Foundation’s mission is the belief that small businesses are the backbone of the global economy. In support of this mission, Visa Foundation granted $1M to Kiva to increase financial access for underserved small businesses around the globe. Through this 5 year program, Visa employees around the globe help direct loans with a long-term goal to help more than 50,000 small businesses. Visa’s recent launch of the Rebuilding Matters program in the US deepened the partnership: Kiva is one of 5 nonprofits to whom Visa will donate when cardholders make an eligible transaction at small businesses.'
				},
				{
					key: 'skoll',
					showStats: true,
					alt: 'Skoll + DFC',
					logo: imgRequire('./Partner-skoll.svg'),
					stats: [
						['99k', 'Loans'],
						['211k+', 'Borrowers (81% women)'],
						['30+', 'Countries'],
					],
					// eslint-disable-next-line max-len
					text: 'In 2017, Kiva embarked on an innovative collaboration to accelerate Kiva.org lending. Grant funding from Skoll Foundation and a loan loss commitment from Kiva.org lender enabled Kiva to secure $10M in funding from U.S. International Development Finance Corporation (DFC, then the Overseas Private Investment Corporation OPIC). With this collaboration, Kiva deployed $26.8M of funds from the $10M DFC loan and $49.9M from over 1M Kiva.org lenders. This translated to 99,000 loans to 211,000 borrowers across 30 countries and demonstrated the significant impact that can be achieved when different forms of capital are blended together.'
				},
			],
		};
	},
	methods: {
		togglePartner(partnerKey) {
			const targetPartner = this.strategicPartners.find(partner => partner.key === partnerKey);

			if (!targetPartner.showStats) {
				// if showStats is false, scroll partner information before shrinking
				this.$refs[partnerKey][0].scrollTop = 0;
			} else {
				// on click 'read more' fire analytics event
				this.$kvTrackEvent('Kiva15', `click-strategic-partners-${partnerKey}-CTA`, 'Read More');
			}
			// toggle showStats
			targetPartner.showStats = !targetPartner.showStats;
		},
		animateTotalImpact(isVisible) {
			if (isVisible) {
				const vm = this;
				const donations = { val: 0 };
				const disbursed = { val: 0 };
				const funded = { val: 0 };

				// totalImpactDonations
				gsap.to(donations, 3, {
					val: 101,
					roundProps: 'val',
					onUpdate() {
						vm.totalImpactDonations = donations.val;
					}
				});

				// totalImpactDisbursed
				gsap.to(disbursed, 3, {
					val: 130,
					roundProps: 'val',
					onUpdate() {
						vm.totalImpactDisbursed = disbursed.val;
					}
				});

				// totalImpactBorrowersFunded
				gsap.to(funded, 3, {
					val: 1.5,
					onUpdate() {
						vm.totalImpactBorrowersFunded = funded.val.toFixed(1);
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "components/15-years/15-years";

.partners {
	background-color: $offwhite;
	padding: rem-calc(105) 0;

	&__header {
		--section-header-line-color: #{$twilight};

		margin-bottom: 2rem;

		@include breakpoint('xxlarge') {
			margin-bottom: 7.5rem;
		}
	}
}

.strategic-partners {
	&__list {
		list-style: none;
	}

	&__li {
		margin-bottom: 2rem;

		@include breakpoint(large) {
			margin-bottom: 0;
		}
	}

	&__total-impact {
		background-color: $twilight;
		padding: rem-calc(24);
		margin-right: rem-calc(12);
	}

	&__total-impact,
	&__partner {
		border-radius: 1.25rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	&__logo {
		display: block;

		&--mastercard {
			width: rem-calc(77);

			@include breakpoint(xlarge) {
				width: rem-calc(99);
			}
		}

		&--paypal {
			width: rem-calc(185);

			@include breakpoint(xlarge) {
				width: rem-calc(236);
			}
		}

		&--visa {
			width: rem-calc(152);

			@include breakpoint(xlarge) {
				width: rem-calc(195);
			}
		}

		&--ebay {
			width: rem-calc(157);

			@include breakpoint(xlarge) {
				width: rem-calc(213);
			}
		}

		&--skoll {
			width: rem-calc(261);

			@include breakpoint(xlarge) {
				width: rem-calc(338);
			}
		}
	}

	&__logo-wrapper {
		height: rem-calc(70);
		display: flex;
		align-items: center;

		@include breakpoint(xlarge) {
			height: rem-calc(150);
		}
	}

	&__stats {
		padding: 0 0 0 1rem;
		color: $twilight;
		border-left: 1px solid $twilight;
		margin: 0;
		transition: max-height 0.5s linear 0.4s;
		max-height: rem-calc(0);
		overflow: hidden;
		height: 0;

		&.shown {
			transition: max-height 0.5s linear 0.4s;
			max-height: rem-calc(350);
			height: auto;
		}

		h3 {
			line-height: 1;
			margin-right: 0.5rem;
		}

		h5 {
			padding-bottom: 0.2rem;
			min-width: rem-calc(125);
		}

		&--total-impact {
			color: $offwhite;
			border-left: 1px solid $offwhite;
			margin-bottom: 0.5rem;
		}

		li {
			margin-bottom: rem-calc(24);

			&:last-child {
				margin-bottom: rem-calc(0);
			}
		}
	}

	&__total-impact-headline {
		color: $offwhite;
		letter-spacing: -0.15rem;
		line-height: 1.15em;
		margin-bottom: 1.5rem;
	}

	&__partner {
		padding: rem-calc(12);
		height: 100%;

		p {
			@include breakpoint('large') {
				font-size: rem-calc(18);
			}

			margin-top: 1.5rem;
			position: relative;
			transition: max-height 0.5s linear;
			overflow: hidden;
			max-height: rem-calc(69);
			padding: 0 0.75rem rem-calc(40) 0; // room for fade element and scroll bars
		}

		p.expanded {
			transition: max-height 0.5s linear;
			max-height: rem-calc(260);
			height: auto;
			overflow: scroll;
			margin-top: 0;
		}

		.fade {
			background: linear-gradient(to bottom, rgba($offwhite, 0), rgba($offwhite, 1));
			height: rem-calc(70);
			position: relative;
			width: 100%;
			margin-top: rem-calc(-80);
		}
	}
}
</style>
