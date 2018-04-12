<template>
	<footer class="www-footer">
		<div class="footer-row row">
			<nav class="small-footer hide-for-large">
				<ul>
					<li><router-link :to="applyUrl">Borrow</router-link></li>
					<li><router-link :to="aboutUrl">About</router-link></li>
					<li><router-link :to="helpUrl">Help</router-link></li>
					<li><router-link :to="careersUrl">Careers</router-link></li>
					<li><router-link :to="sitemapUrl">Site map</router-link></li>
				</ul>
				<div>
					<router-link :to="privacyUrl">Privacy policy</router-link> |
					<router-link :to="termsUrl">Terms of use</router-link>
				</div>
				<p>
					Lending through Kiva involves risk of principal loss.
					Kiva does not guarantee repayment or offer a financial return on your loan.
					<br><br>
					&copy; {{ year }} Kiva. All rights reserved.
				</p>
			</nav>
			<nav class="large-footer show-for-large">
				<div class="groups">
					<div class="narrow">
						<h1>Borrow</h1>
						<p>Loans for entrepreneurs doing amazing things.</p>
						<ul>
							<li><router-link :to="applyUrl">Apply now</router-link></li>
						</ul>
					</div>
					<div class="narrow">
						<h1>Explore</h1>
						<ul>
							<li><router-link :to="giftsUrl">Gifts</router-link></li>
							<li><router-link :to="happeningNowUrl">Happening now</router-link></li>
							<li><router-link :to="sitemapUrl">Site map</router-link></li>
							<li><router-link :to="developerUrl">Developer API</router-link></li>
							<li><router-link :to="privacyUrl">Privacy policy</router-link></li>
							<li><router-link :to="termsUrl">Terms of use</router-link></li>
						</ul>
					</div>
					<div class="narrow">
						<h1>Get to know us</h1>
						<ul>
							<li><router-link :to="aboutUrl">About us</router-link></li>
							<li><router-link :to="howKivaUrl">How Kiva works</router-link></li>
							<li><router-link :to="faqUrl">FAQs</router-link></li>
							<li><router-link :to="whereUrl">Where Kiva works</router-link></li>
							<li><router-link :to="blogUrl">Blog</router-link></li>
							<li><router-link :to="partnerWithUrl">Partner with us</router-link></li>
							<li><router-link :to="contactUrl">Contact us</router-link></li>
							<li><router-link :to="helpUrl">Help</router-link></li>
						</ul>
					</div>
					<div class="narrow">
						<h1>Community</h1>
						<ul>
							<li><router-link :to="teamsUrl">Teams</router-link></li>
							<li><router-link :to="studentsUrl">Students and educators</router-link></li>
						</ul>
					</div>
					<div class="wide">
						<p>
							Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
							Founded in 2005, and based in San Francisco,
							with offices in Nairobi and staff around the globe.
							<router-link :to="donateUrl">Donate to our operating expenses.</router-link>
						</p>
					</div>
					<div class="work-with-us wide">
						<h1>Work with us</h1>
						<ul>
							<li><router-link :to="careersUrl">Careers</router-link></li>
							<li><router-link :to="volunteerInternUrl">Volunteer internships</router-link></li>
							<li><router-link :to="fellowsUrl">Kiva fellows</router-link></li>
							<li><router-link :to="reviewTranslateUrl">Review and translation</router-link></li>
							<li><router-link :to="trusteesUrl">Trustees</router-link></li>
						</ul>
					</div>
					<div class="wide">
						<p>
							Lending through Kiva involves risk of principal loss.
							Kiva does not guarantee repayment or offer a financial return on your loan.
							<br><br>
							&copy; {{ year }} Kiva. All rights reserved.
						</p>
					</div>
				</div>
			</nav>
		</div>
	</footer>
</template>

<script>
import { getYear } from 'date-fns';

export default {
	data() {
		return {
			year: getYear(new Date()),
			applyUrl: '/borrow',
			giftsUrl: '/gifts',
			happeningNowUrl: '/live',
			sitemapUrl: '/sitemap',
			developerUrl: 'https://build.kiva.org',
			privacyUrl: '/legal/privacy',
			termsUrl: '/legal/terms',
			aboutUrl: '/about',
			howKivaUrl: '/about/how',
			faqUrl: '/about/how#faq-hkw-section',
			whereUrl: '/about/where-kiva-works',
			blogUrl: '/blog',
			partnerWithUrl: '/partner-with-us',
			contactUrl: '/help/contact-us',
			helpUrl: '/help',
			teamsUrl: '/teams',
			studentsUrl: '/kivau/intro',
			donateUrl: '/donate/supportus',
			careersUrl: '/work-with-us/careers',
			volunteerInternUrl: '/work-with-us/internvolunteers',
			fellowsUrl: '/work-with-us/fellows',
			reviewTranslateUrl: '/work-with-us/reviewers',
			trusteesUrl: '/trustees'
		};
	},
};
</script>

<style lang="scss">
@import 'settings';

$footer-link-separator-color: $light-green;

.www-footer {
	background-color: $kiva-green;
	color: $white;
	font-size: rem-calc(14);
	font-weight: 400;
	text-align: center;
	padding: 1rem;
	min-height: 17.5rem;

	@include breakpoint(medium) {
		padding: rem-calc(40);
	}

	@include breakpoint(large) {
		padding: rem-calc(40) 1rem;
	}

	ul {
		list-style: none;
		margin: 0;
	}

	p {
		margin-bottom: 0;
		font-weight: normal;
		line-height: $small-text-line-height;
	}

	a {
		color: $dark-green;

		&:visited,
		&:active {
			color: $dark-green;
		}
	}

	h1 {
		font-size: 0.875rem;
		margin: 0;
	}

	.small-footer {
		ul {
			display: flex;
			justify-content: space-between;
			margin-bottom: 1rem;
			border-bottom: 1px solid $footer-link-separator-color;

			@include breakpoint(medium only) {
				font-size: rem-calc(16);
			}

			li {
				margin: 0.125rem 0 0.9rem;
			}
		}

		div {
			margin-bottom: 0.25rem;
			color: $footer-link-separator-color;

			a {
				margin: 0 0.875rem;
			}
		}
	}

	.large-footer {
		.groups {
			display: flex;
			flex-flow: column wrap;
			justify-content: space-between;
			height: rem-calc(330);
			text-align: left;
			font-size: 0.875rem;

			.narrow {
				width: 25%;
				padding: 0 0.9375rem;
			}

			.wide {
				width: 50%;
				padding: 0 0.9375rem;
			}

			ul {
				li {
					line-height: 1.6rem;
				}
			}
		}

		.work-with-us {
			$spacing: 0.5rem;

			ul {
				overflow: hidden;
				width: calc(100% + #{$spacing * 2} + 1px);

				li {
					display: inline-block;
					float: left;
					transform: translate3d(calc(-#{$spacing * 2} - 1px), 0, 0);

					a {
						padding-left: $spacing;
						border-left: 1px solid $footer-link-separator-color;
						margin-left: $spacing;
						white-space: nowrap;
					}
				}
			}
		}
	}
}
</style>
