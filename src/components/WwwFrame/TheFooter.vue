<template>
	<footer class="www-footer" :style="cssVars">
		<nav class="small-footer hide-for-large" aria-label="Footer navigation">
			<ul class="hide-for-print">
				<li>
					<router-link :to="applyUrl">
						Borrow
					</router-link>
				</li>
				<li>
					<router-link :to="aboutUrl">
						About
					</router-link>
				</li>
				<li>
					<router-link :to="helpUrl">
						Help
					</router-link>
				</li>
				<li>
					<a :href="careersUrl" target="_blank">
						Careers
					</a>
				</li>
				<li>
					<router-link :to="sitemapUrl">
						Site map
					</router-link>
				</li>
			</ul>
			<div class="hide-for-print">
				<router-link :to="privacyUrl">
					Privacy policy
				</router-link> |
				<router-link :to="termsUrl">
					Terms of use
				</router-link>
			</div>
			<ul class="hide-for-print download-app-icons">
				<li>
					<a :href="appStoreUrl" target="_blank" rel="noopener">
						<img
							src="@/assets/icons/app-store.svg"
							loading="lazy"
							alt="Check out our new app on the App Store"
						>
					</a>
				</li>
				<li>
					<a :href="playStoreUrl" target="_blank" rel="noopener">
						<img
							src="@/assets/icons/play-store.svg"
							loading="lazy"
							alt="Check out our new app on the Play Store"
						>
					</a>
				</li>
			</ul>
			<p>
				Lending through Kiva involves risk of principal loss.
				Kiva does not guarantee repayment or offer a financial return on your loan.
				<br><br>
				&copy; {{ year }} Kiva. All rights reserved.
			</p>
		</nav>
		<nav class="large-footer show-for-large row" aria-label="Footer navigation">
			<div class="groups">
				<div class="narrow hide-for-print">
					<h2>Borrow</h2>
					<p>Loans for entrepreneurs doing amazing things.</p>
					<ul>
						<li>
							<router-link :to="applyUrl">
								Apply now
							</router-link>
						</li>
					</ul>
				</div>
				<div class="narrow hide-for-print">
					<h2>Explore</h2>
					<ul>
						<li>
							<router-link to="/protocol">
								Protocol
							</router-link>
						</li>
						<li>
							<router-link to="/gifts">
								Gifts
							</router-link>
						</li>
						<li>
							<router-link to="/live">
								Happening now
							</router-link>
						</li>
						<li>
							<router-link :to="sitemapUrl">
								Site map
							</router-link>
						</li>
						<li>
							<router-link to="/build">
								Developer API
							</router-link>
						</li>
						<li>
							<router-link :to="privacyUrl">
								Privacy policy
							</router-link>
						</li>
						<li>
							<router-link :to="termsUrl">
								Terms of use
							</router-link>
						</li>
					</ul>
				</div>
				<div class="narrow hide-for-print">
					<h2>Get to know us</h2>
					<ul>
						<li>
							<router-link :to="aboutUrl">
								About us
							</router-link>
						</li>
						<li>
							<router-link to="/about/how">
								How Kiva works
							</router-link>
						</li>
						<li>
							<router-link to="/about/how#faq-hkw-section">
								FAQs
							</router-link>
						</li>
						<li>
							<router-link to="/about/where-kiva-works">
								Where Kiva works
							</router-link>
						</li>
						<li>
							<router-link to="/blog">
								Blog
							</router-link>
						</li>
						<li>
							<router-link to="/partner-with-us">
								Partner with us
							</router-link>
						</li>
						<li>
							<router-link to="/help/contact-us">
								Contact us
							</router-link>
						</li>
						<li>
							<router-link :to="helpUrl">
								Help
							</router-link>
						</li>
					</ul>
				</div>
				<div class="narrow hide-for-print">
					<h2>Community</h2>
					<ul>
						<li>
							<router-link to="/teams">
								Teams
							</router-link>
						</li>
						<li>
							<router-link to="/kivau/intro">
								Students and educators
							</router-link>
						</li>
					</ul>
				</div>
				<div class="wide">
					<div>
						Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
						Founded in 2005, and based in San Francisco, with offices in Bangkok, Nairobi,
						Portland and staff around the globe.
					</div>
					<ul class="siteFooter-links hide-for-print">
						<li>
							<router-link to="/donate/supportus">
								Donate to Kiva here.
							</router-link>
						</li>
					</ul>
				</div>
				<div class="wide">
					<ul class="siteFooter-links hide-for-print download-app-icons">
						<li>
							<a :href="appStoreUrl" target="_blank" rel="noopener">
								<img
									src="@/assets/icons/app-store.svg"
									loading="lazy"
									alt="Check out our new app on the App Store"
								>
							</a>
						</li>
						<li>
							<a :href="playStoreUrl" target="_blank" rel="noopener">
								<img
									src="@/assets/icons/play-store.svg"
									loading="lazy"
									alt="Check out our new app on the Play Store"
								>
							</a>
						</li>
					</ul>
				</div>
				<div class="work-with-us wide hide-for-print">
					<h2>Work with us</h2>
					<ul>
						<li>
							<a :href="careersUrl" target="_blank">
								Careers
							</a>
						</li>
						<li>
							<router-link to="/work-with-us/internvolunteers">
								Volunteer internships
							</router-link>
						</li>
						<li>
							<a href="https://www.careers.kiva.org/fellowships" target="_blank">
								Kiva fellows
							</a>
						</li>
						<li>
							<router-link to="/work-with-us/reviewers">
								Review and translation
							</router-link>
						</li>
						<li>
							<a href="https://www.kivaushub.org/hubs" target="_blank">
								US Hubs
							</a>
						</li>
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
import getCacheKey from '@/util/getCacheKey';

export default {
	name: 'TheFooter',
	serverCacheKey: props => getCacheKey(props.theme ? `footerThemed${props.theme.themeKey}` : 'footer'),
	props: {
		theme: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			year: getYear(new Date()),
			applyUrl: '/borrow',
			aboutUrl: '/about',
			helpUrl: '/help',
			careersUrl: 'https://www.careers.kiva.org/',
			sitemapUrl: '/sitemap',
			privacyUrl: '/legal/privacy',
			termsUrl: '/legal/terms',
			appStoreUrl: 'https://apps.apple.com/app/id1453093374',
			playStoreUrl: 'https://play.google.com/store/apps/details?id=org.kiva.lending'
		};
	},
	computed: {
		cssVars() {
			if (this.theme) {
				return {
					'--kv-footer-background-color': this.theme.backgroundColor || '',
					'--kv-footer-text-color': this.theme.textColor || '',
					'--kv-footer-link-color': this.theme.linkColor || '',
					'--kv-footer-separator-color': this.theme.separatorColor || '',
				};
			}
			return {};
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

$footer-background-color: $kiva-green;
$footer-text-color: #fff;
$footer-link-color: $dark-green;
$footer-separator-color: $light-green;

.www-footer {
	background-color: $footer-background-color; // IE11 fallback
	background-color: var(--kv-footer-background-color, $footer-background-color);
	color: $footer-text-color; // IE11 fallback
	color: var(--kv-footer-text-color, $footer-text-color);
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

	@media print {
		padding: 0;
		min-height: auto;
		font-weight: 300;
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
		color: $footer-link-color;
		color: var(--kv-footer-link-color, $footer-link-color);

		&:visited,
		&:active {
			color: $footer-link-color;
			color: var(--kv-footer-link-color, $footer-link-color);
		}
	}

	h2 {
		font-size: 0.875rem;
		font-weight: $global-weight-bold;
		margin: 0;
		line-height: 1.6;
	}

	ul.download-app-icons li {
		display: inline-block;
	}

	ul.download-app-icons img {
		height: 2rem;
	}

	.small-footer {
		ul {
			display: flex;
			justify-content: space-between;
			margin-bottom: 1rem;
			border-bottom: 1px solid $footer-separator-color; // IE11 fallback
			border-bottom: 1px solid var(--kv-footer-separator-color, $footer-separator-color);

			@include breakpoint(medium only) {
				font-size: rem-calc(16);
			}

			li {
				margin: 0.125rem 0 0.9rem;
			}
		}

		ul.download-app-icons {
			max-width: 15rem;
			margin: 0 auto;
			padding-top: 0.7rem;
			border-bottom: none;
		}

		div {
			margin-bottom: 0.25rem;
			color: $footer-separator-color; // IE11 fallback
			color: var(--kv-footer-separator-color, $footer-separator-color);

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
					line-height: 1.6;
				}
			}

			// For print, do a single full-width column
			@media print {
				display: block;
				height: auto;

				.narrow,
				.wide {
					width: 100%;
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
					transform: translate3d(calc(-#{$spacing * 2} - 1px), 0, 0); /* stylelint-disable-line */
					a {
						padding-left: $spacing;
						border-left: 1px solid $footer-separator-color; // IE11 fallback
						border-left: 1px solid var(--kv-footer-separator-color, $footer-separator-color);
						margin-left: $spacing;
						white-space: nowrap;
					}
				}
			}
		}
	}
}
</style>
