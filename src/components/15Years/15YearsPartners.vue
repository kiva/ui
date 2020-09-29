<template>
	<div class="partners">
		<div class="row">
			<div class="columns">
				<section>
					<fifteen-years-section-header class="partners__header">
						<template v-slot:header>
							Strategic Partners
						</template>
						<template v-slot:subhead>
							Individuals and Organizations <br class="smo"><br class="xxlu"> making a difference
						</template>
					</fifteen-years-section-header>
				</section>
				<section class="strategic-partners">
					<ul class="strategic-partners__list row collapse">
						<li
							class="strategic-partners__li small-12 medium-6 large-4 columns"
						>
							<div class="strategic-partners__total-impact">
								<h3
									class="strategic-partners__total-impact-headline"
								>
									Our strategic partners’ total impact:
								</h3>
								<ul
									class="strategic-partners__stats strategic-partners__stats--total-impact"
								>
									<li>
										<h3>
											$101M
										</h3>
										<span>In donations</span>
									</li>
									<li>
										<h3>
											$130M
										</h3>
										<span>disbursed <br class="xlu">to borrowers</span>
									</li>
									<li>
										<h3>
											2.5M
										</h3>
										<span>Borrowers funded</span>
									</li>
								</ul>
							</div>
						</li>
						<li
							class="strategic-partners__li small-12 medium-6 large-4 columns"
						>
							<div class="strategic-partners__partner">
								<div class="strategic-partners__logo-wrapper">
									<img
										class="strategic-partners__logo strategic-partners__logo--paypal"
										src="@/assets/images/15-years/partners/Partner-paypal.svg"
										alt="PayPal"
										loading="lazy"
									>
								</div>
								<ul class="strategic-partners__stats" v-if="paypal.showStats">
									<li>
										<h3>
											15
										</h3>
										<span>Years of <br class="xlu">partnership</span>
									</li>
									<li>
										<h3>
											$1.45B
										</h3>
										<span>Loans Through <br class="xlu">kiva.org</span>
									</li>
									<li>
										<h3>
											$2.2M
										</h3>
										<span>From 38k+ customers <br class="xlu">and employees</span>
									</li>
								</ul>
								<p :class="{'expanded': !paypal.showStats}">
									<!-- eslint-disable-next-line max-len -->
									Kiva and PayPal have a unique and deep collaboration, unified by a shared purpose of empowering entrepreneurs around the world by democratizing financial services. The connection is not surprising: Kiva was co-founded by Premal Shah, a former PayPal employee, and has been powered from the beginning with free payment processing from PayPal, ensuring that 100% of every dollar goes to fund loans on Kiva.org, which has resulted in over $1.45 billion in loans to support entrepreneurs from around the world. In addition to this, PayPal engages customers and employees to lend on Kiva.org every year.
								</p>
								<fifteen-years-button variant="black" @click="togglePartner('paypal')">
									{{ paypal.showStats ? 'read more' : 'back to stats' }}
								</fifteen-years-button>
							</div>
						</li>
						<li
							class="strategic-partners__li small-12 medium-6 large-4 columns"
						>
							<div class="strategic-partners__partner">
								<div class="strategic-partners__logo-wrapper">
									<img
										class="strategic-partners__logo strategic-partners__logo--mastercard"
										src="@/assets/images/15-years/partners/Partner-mastercard.svg"
										alt="Mastercard Foundation"
										loading="lazy"
									>
								</div>
								<ul class="strategic-partners__stats" v-if="mastercard.showStats">
									<li>
										<h3>
											4
										</h3>
										<span>Years of <br class="xlu">partnership</span>
									</li>
									<li>
										<h3>
											52
										</h3>
										<span>New loan <br class="xlu">products</span>
									</li>
									<li>
										<h3>
											400k
										</h3>
										<span>Borrowers</span>
									</li>
								</ul>
								<p :class="{'expanded': !mastercard.showStats}">
									<!-- eslint-disable-next-line max-len -->
									Kiva and the Mastercard Foundation have partnered to test, develop, and scale high-impact loans serving the unique needs of smallholder farmers and rural populations across Africa. The Mastercard Foundation is supporting the Kiva Labs approach to push the boundaries of microcredit and deepen our commitment to impact measurement and management. As part of this partnership, Kiva has been able to bring together over 50 of our partners at the Kiva Labs Innovation Conference, design and deploy technical assistance to over 30 lending partners, and deepen our commitment to impact measurement and management.
								</p>
								<fifteen-years-button variant="black" @click="togglePartner('mastercard')">
									{{ mastercard.showStats ? 'read more' : 'back to stats' }}
								</fifteen-years-button>
							</div>
						</li>
						<li
							class="strategic-partners__li small-12 medium-6 large-4 columns"
						>
							<div class="strategic-partners__partner">
								<div class="strategic-partners__logo-wrapper">
									<img
										class="strategic-partners__logo strategic-partners__logo--ebay"
										src="@/assets/images/15-years/partners/Partner-ebay.svg"
										alt="Ebay"
										loading="lazy"
									>
								</div>
								<ul class="strategic-partners__stats" v-if="ebay.showStats">
									<li>
										<h3>
											3
										</h3>
										<span>Years of <br class="xlu">partnership</span>
									</li>
									<li>
										<h3>
											1k+
										</h3>
										<span>Employees engaged</span>
									</li>
									<li>
										<h3>
											$1M
										</h3>
										<span>Lent</span>
									</li>
								</ul>
								<p :class="{'expanded': !ebay.showStats}">
									<!-- eslint-disable-next-line max-len -->
									Kiva and eBay share a belief that the internet can be an empowering force that helps create opportunities for people across the globe. The partnership advances eBay Foundation’s mission to unleash the power of entrepreneurship to build economically vibrant and sustainable communities and connects eBay’s employees to direct impact in the lives of others. Through four employee lending campaigns, as well as matching funds on Kiva.org, the eBay Foundation has lent $1M to nearly 30,000 entrepreneurs across 70 countries. Additionally, the San Jose, California-based company has funded 250 small businesses locally through grants to Kiva, driving sustainable local economic growth.
								</p>
								<fifteen-years-button variant="black" @click="togglePartner('ebay')">
									{{ ebay.showStats ? 'read more' : 'back to stats' }}
								</fifteen-years-button>
							</div>
						</li>
						<li
							class="strategic-partners__li small-12 medium-6 large-4 columns"
						>
							<div class="strategic-partners__partner">
								<div class="strategic-partners__logo-wrapper">
									<img
										class="strategic-partners__logo strategic-partners__logo--visa"
										src="@/assets/images/15-years/partners/Partner-visa.svg"
										alt="Visa"
										loading="lazy"
									>
								</div>
								<ul class="strategic-partners__stats" v-if="visa.showStats">
									<li>
										<h3>
											1
										</h3>
										<span>Year of <br class="xlu">partnership</span>
									</li>
									<li>
										<h3>
											67%
										</h3>
										<span>of global employees <br class="xlu">are lenders</span>
									</li>
									<li>
										<h3>
											700k
										</h3>
										<span>In loans</span>
									</li>
								</ul>
								<p :class="{'expanded': !visa.showStats}">
									<!-- eslint-disable-next-line max-len -->
									At the heart of the Visa Foundation’s mission is the belief that small businesses are the backbone of the global economy. In support of this mission, Visa Foundation granted $1M to Kiva to increase financial access for underserved small businesses around the globe. Through this 5 year program, Visa employees around the globe help direct loans with a long-term goal to help more than 50,000 small businesses. Visa’s recent launch of the Rebuilding Matters program in the US deepened the partnership: Kiva is one of 5 nonprofits to whom Visa will donate when cardholders make an eligible transaction at small businesses.
								</p>
								<fifteen-years-button variant="black" @click="togglePartner('visa')">
									{{ visa.showStats ? 'read more' : 'back to stats' }}
								</fifteen-years-button>
							</div>
						</li>
						<li
							class="strategic-partners__li small-12 medium-6 large-4 columns"
						>
							<div class="strategic-partners__partner">
								<div class="strategic-partners__logo-wrapper">
									<img
										class="strategic-partners__logo strategic-partners__logo--skoll"
										src="@/assets/images/15-years/partners/Partner-skoll.svg"
										alt="Skoll + DFC"
										loading="lazy"
									>
								</div>
								<ul class="strategic-partners__stats" v-if="skoll.showStats">
									<li>
										<h3>
											99k
										</h3>
										<span>Loans</span>
									</li>
									<li>
										<h3>
											211k+
										</h3>
										<span>Borrowers <br class="xlu">(81% women)</span>
									</li>
									<li>
										<h3>
											30+
										</h3>
										<span>Countries</span>
									</li>
								</ul>
								<p :class="{'expanded': !skoll.showStats}">
									<!-- eslint-disable-next-line max-len -->
									In 2017, Kiva embarked on an innovative collaboration to accelerate Kiva.org lending. Grant funding from Skoll Foundation and a loan loss commitment from Kiva.org lender enabled Kiva to secure $10M in funding from U.S. International Development Finance Corporation (DFC, then the Overseas Private Investment Corporation OPIC). With this collaboration, Kiva deployed $26.8M of funds from the $10M DFC loan and $49.9M from over 1M Kiva.org lenders. This translated to 99,000 loans to 211,000 borrowers across 30 countries and demonstrated the significant impact that can be achieved when different forms of capital are blended together.
								</p>
								<fifteen-years-button variant="black" @click="togglePartner('skoll')">
									{{ skoll.showStats ? 'read more' : 'back to stats' }}
								</fifteen-years-button>
							</div>
						</li>
					</ul>
				</section>
				<section class="matching-partners text-center">
					<div class="matching-partners__selected">
						<h4>
							Strategic partners supporting this celebration
						</h4>
						<ul class="matching-partners__list row align-center">
							<li
								class="matching-partners__li small-6 large-4 columns"
							>
								<img
									class="matching-partners__logo matching-partners__logo--chess"
									src="@/assets/images/15-years/partners/Partner-chess24.svg"
									alt="Chess24"
									loading="lazy"
								>
							</li>
							<li
								class="matching-partners__li small-6 large-4 columns"
							>
								<img
									class="matching-partners__logo matching-partners__logo--cisco"
									src="@/assets/images/15-years/partners/Partner-cisco.svg"
									alt="Cisco"
									loading="lazy"
								>
							</li>
							<li
								class="matching-partners__li small-6 large-4 columns"
							>
								<img
									class="matching-partners__logo matching-partners__logo--paypal"
									src="@/assets/images/15-years/partners/Partner-paypal-bw.svg"
									alt="Paypal"
									loading="lazy"
								>
							</li>
							<li
								class="matching-partners__li small-6 large-4 columns"
							>
								<img
									class="matching-partners__logo matching-partners__logo--women"
									src="@/assets/images/15-years/partners/Partner-women.svg"
									alt="Women and Girls Empowered"
									loading="lazy"
								>
							</li>
						</ul>
						<fifteen-years-button href="https://kiva.global/partner-with-us/">
							Partner with us
						</fifteen-years-button>
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
	},
	data() {
		return {
			paypal: {
				showStats: true
			},
			mastercard: {
				showStats: true
			},
			ebay: {
				showStats: true
			},
			visa: {
				showStats: true
			},
			skoll: {
				showStats: true
			}

		};
	},
	methods: {
		togglePartner(partner) {
			console.log(partner, this[partner].showStats);
			this[partner].showStats = !this[partner].showStats;
		}
	},
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "components/15-years/15-years";

.partners {
	background-color: $offwhite;
	padding: rem-calc(105) 0;
}

.strategic-partners,
.matching-partners {
	margin-top: rem-calc(12);

	@include breakpoint(large) {
		margin-top: rem-calc(24);
	}

	@include breakpoint(xlarge) {
		margin-top: rem-calc(53);
	}
}

.strategic-partners {
	h2 {
		color: black;
	}

	&__list {
		list-style: none;
		margin-bottom: 2rem;
	}

	&__li {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 1rem;
		padding-bottom: 1rem;

		@include breakpoint("large") {
			&:nth-of-type(3n + 1) {
				// first column
				justify-content: flex-start;
			}

			&:nth-of-type(3n + 3) {
				// last column
				justify-content: flex-end;
			}
		}
	}

	&__total-impact {
		background-color: $twilight;
	}

	&__total-impact,
	&__partner {
		width: 100%;
		border-radius: 1.25rem;
		padding: rem-calc(24);
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
		margin: 2.5rem 0 0 0;
		padding-left: 1rem;
		color: $twilight;
		border-left: 1px solid $twilight;
		margin-top: 1rem;

		h3 {
			line-height: 1;
			margin-right: 0.5rem;
		}

		span {
			text-transform: uppercase;
			line-height: 1.25;
			padding-bottom: 0.2rem;
			font-size: $small-text-font-size;
		}

		&--total-impact {
			color: $offwhite;
			border-left: 1px solid $offwhite;
		}

		li {
			display: flex;
			align-items: flex-end;
			margin-bottom: rem-calc(24);
			flex-wrap: wrap;

			&:last-child {
				margin-bottom: rem-calc(0);
			}
		}
	}

	&__total-impact-headline {
		max-width: rem-calc(228);
		color: $offwhite;
		letter-spacing: -0.15rem;
		line-height: 3.5rem;
		margin-bottom: 1.5rem;
	}

	&__partner {
		height: 100%;

		p {
			margin-top: 1.5rem;
			position: relative;
			// font-size: $medium-text-font-size;
			// line-height: $medium-text-line-height;
			transition: max-height 0.5s ease-out;
			overflow: hidden;
			max-height: rem-calc(108);

			&::before {
				content: '';
				position: absolute;
				height: rem-calc(200);
				bottom: 0;
				width: 100%;
				background: linear-gradient(to bottom, rgba($offwhite, 0) 62%, rgba($offwhite, 1) 100%);
				opacity: 1;
			}
		}

		p.expanded {
			transition: max-height 0.5s ease-out;
			max-height: rem-calc(800); // just used for animation since we can't animate to height auto.
			height: auto;

			&::before {
				transition: opacity 0.5s ease-out;
				opacity: 0;
				content: none;
			}
		}
	}
}

.matching-partners {
	h4 {
		margin-top: 7rem;
	}

	&__selected {
		max-width: 30rem;
		margin: 0 auto;
	}

	&__list {
		list-style: none;
		margin: 5rem 0 3.5rem 0;
	}

	&__li {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 1rem 3rem 1rem;
	}

	&__logo {
		width: 100%;
		height: auto;

		&--women {
			width: rem-calc(112);
		}

		&--cisco {
			width: rem-calc(112);
		}

		&--paypal {
			width: rem-calc(140);
		}

		&--chess {
			width: rem-calc(141);
		}
	}
}

.partners__header {
	::v-deep .section-header__line {
		background-color: $twilight;
	}
}
</style>
