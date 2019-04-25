<template>
	<footer class="www-footer">
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
		<nav class="large-footer show-for-large row">
			<div class="groups">
				<div class="narrow">
					<h2>Borrow</h2>
					<p>Loans for entrepreneurs doing amazing things.</p>
					<ul>
						<li><router-link :to="applyUrl">Apply now</router-link></li>
					</ul>
				</div>
				<div class="narrow">
					<h2>Explore</h2>
					<ul>
						<li v-if="isProtocolLive"><router-link to="/protocol">Protocol</router-link></li>
						<li><router-link to="/gifts">Gifts</router-link></li>
						<li><router-link to="/live">Happening now</router-link></li>
						<li><router-link :to="sitemapUrl">Site map</router-link></li>
						<li><router-link to="/build">Developer API</router-link></li>
						<li><router-link :to="privacyUrl">Privacy policy</router-link></li>
						<li><router-link :to="termsUrl">Terms of use</router-link></li>
					</ul>
				</div>
				<div class="narrow">
					<h2>Get to know us</h2>
					<ul>
						<li><router-link :to="aboutUrl">About us</router-link></li>
						<li><router-link to="/about/how">How Kiva works</router-link></li>
						<li><router-link to="/about/how#faq-hkw-section">FAQs</router-link></li>
						<li><router-link to="/about/where-kiva-works">Where Kiva works</router-link></li>
						<li><router-link to="/blog">Blog</router-link></li>
						<li><router-link to="/partner-with-us">Partner with us</router-link></li>
						<li><router-link to="/help/contact-us">Contact us</router-link></li>
						<li><router-link :to="helpUrl">Help</router-link></li>
					</ul>
				</div>
				<div class="narrow">
					<h2>Community</h2>
					<ul>
						<li><router-link to="/teams">Teams</router-link></li>
						<li><router-link to="/kivau/intro">Students and educators</router-link></li>
					</ul>
				</div>
				<div class="wide">
					<div>
						Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
						Founded in 2005, and based in San Francisco, with offices in Bangkok, Nairobi,
						Portland and staff around the globe.
					</div>
					<ul class="siteFooter-links">
						<li><router-link to="/donate/supportus">Donate to Kiva here.</router-link></li>
					</ul>
				</div>
				<div class="work-with-us wide">
					<h2>Work with us</h2>
					<ul>
						<li><router-link :to="careersUrl">Careers</router-link></li>
						<li><router-link to="/work-with-us/internvolunteers">Volunteer internships</router-link></li>
						<li><router-link to="/work-with-us/fellows">Kiva fellows</router-link></li>
						<li><router-link to="/work-with-us/reviewers">Review and translation</router-link></li>
						<li><router-link to="/trustees">Trustees</router-link></li>
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
	</footer>
</template>

<script>
import { getYear } from 'date-fns';
import _get from 'lodash/get';
import protocolUiPageQuery from '@/graphql/query/protocolUiPage.graphql';

export default {
	inject: ['apollo'],
	apollo: {
		query: protocolUiPageQuery,
		preFetch: true,
		result({ data }) {
			this.isProtocolLive = _get(data, 'general.protocol.value') === 'true' || false;
		},
	},
	name: 'TheFooter',
	// serverCacheKey: () => 'footer',
	data() {
		return {
			isProtocolLive: false,
			year: getYear(new Date()),
			applyUrl: '/borrow',
			aboutUrl: '/about',
			helpUrl: '/help',
			careersUrl: '/work-with-us/careers',
			sitemapUrl: '/sitemap',
			privacyUrl: '/legal/privacy',
			termsUrl: '/legal/terms'
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
	font-weight: normal;
	text-align: center;
	padding: 1rem;
	min-height: 17.5rem;

	@include breakpoint(medium) {
		padding: rem-calc(40);
	}

	@include breakpoint(large) {
		padding: rem-calc(40) 1rem;
		min-height: 25rem;
	}

	ul {
		list-style: none;
		margin: 0;
	}

	p {
		margin-bottom: 0;
		line-height: $small-text-line-height;
	}

	a {
		color: $dark-green;

		&:visited,
		&:active {
			color: $dark-green;
		}
	}

	h2 {
		font-size: 0.875rem;
		font-weight: $global-weight-bold;
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
			width: 100%;
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
