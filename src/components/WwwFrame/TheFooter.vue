<template>
	<footer class="www-footer" :style="cssVars">
		<nav class="small-footer hide-for-large" aria-label="Footer navigation">
			<div class="row collapse">
				<div class="column">
					<h2>Borrow</h2>
					<p>Loans for entrepreneurs doing amazing things.</p>
					<ul>
						<li>
							<router-link
								:to="applyUrl"
								v-kv-track-event="['Footer', 'click-Borrow-Apply now']"
							>
								Apply now
							</router-link>
						</li>
					</ul>
				</div>
			</div>
			<div class="row collapse">
				<div class="column">
					<h2>Lend</h2>
					<p>Make a loan, change a life.</p>
					<ul>
						<li>
							<router-link
								:to="lendByCategoryUrl"
								v-kv-track-event="['Footer', 'click-Lend-lend now']"
							>
								Lend now
							</router-link>
						</li>
						<li>
							<router-link
								:to="monthlyGoodUrl"
								v-kv-track-event="['Footer', 'click-Lend-Monthly Good']"
							>
								Monthly Good
							</router-link>
						</li>
					</ul>
				</div>
			</div>
			<div class="row collapse">
				<div class="column">
					<h2>Donate</h2>
					<p>
						Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
						Founded in 2005, and based in San Francisco, with offices in Bangkok, Nairobi,
						Portland and staff around the globe.
					</p>
					<ul>
						<li>
							<router-link
								to="/donate/supportus"
								v-kv-track-event="['Footer', 'click-Donate', 'Donate to Kiva here']"
							>
								Donate to Kiva
							</router-link>
						</li>
					</ul>
					<hr>
				</div>
			</div>
			<div class="row collapse">
				<div class="column">
					<kv-accordion-item
						id="get-to-know-us_accordion"
						:open="false"
					>
						<template #header>
							<h2>Get to know us</h2>
						</template>
						<ul>
							<li>
								<router-link
									:to="aboutUrl"
									v-kv-track-event="['Footer', 'click-Get to know us-About us']"
								>
									About us
								</router-link>
							</li>
							<li>
								<router-link
									to="/about/how"
									v-kv-track-event="['Footer', 'click-Get to know us-How Kiva works']"
								>
									How Kiva works
								</router-link>
							</li>
							<li>
								<router-link
									to="/about/how#faq-hkw-section"
									v-kv-track-event="['Footer', 'click-Get to know us-FAQs']"
								>
									FAQs
								</router-link>
							</li>
							<li>
								<router-link
									to="/about/where-kiva-works"
									v-kv-track-event="['Footer', 'click-Get to know us-Where Kiva works']"
								>
									Where Kiva works
								</router-link>
							</li>
							<li>
								<router-link
									to="/blog"
									v-kv-track-event="['Footer', 'click-Get to know us-Blog']"
								>
									Blog
								</router-link>
							</li>
							<li>
								<router-link
									to="/partner-with-us"
									v-kv-track-event="['Footer', 'click-Get to know us-Partner with us']"
								>
									Partner with us
								</router-link>
							</li>
							<li>
								<router-link
									to="/help/contact-us"
									v-kv-track-event="['Footer', 'click-Get to know us-Contact us']"
								>
									Contact us
								</router-link>
							</li>
							<li>
								<router-link
									:to="helpUrl"
									v-kv-track-event="['Footer', 'click-Get to know us-Help']"
								>
									Help
								</router-link>
							</li>
						</ul>
					</kv-accordion-item>
					<kv-accordion-item
						id="community_accordion"
						:open="false"
					>
						<template #header>
							<h2>Community</h2>
						</template>
						<ul>
							<li>
								<router-link
									to="/teams"
									v-kv-track-event="['Footer', 'click-Community-Teams']"
								>
									Teams
								</router-link>
							</li>
							<li>
								<router-link
									to="/kivau/intro"
									v-kv-track-event="['Footer', 'click-Community-Students and educators']"
								>
									Students and educators
								</router-link>
							</li>
						</ul>
					</kv-accordion-item>
					<kv-accordion-item
						id="explore_accordion"
						:open="false"
					>
						<template #header>
							<h2>Explore</h2>
						</template>
						<ul>
							<li>
								<router-link
									to="/protocol"
									v-kv-track-event="['Footer', 'click-Explore-Protocol']"
								>
									Protocol
								</router-link>
							</li>
							<li>
								<router-link
									to="/gifts"
									v-kv-track-event="['Footer', 'click-Explore-Gifts']"
								>
									Gifts
								</router-link>
							</li>
							<li>
								<router-link
									to="/live"
									v-kv-track-event="['Footer', 'click-Explore-Happening now']"
								>
									Happening now
								</router-link>
							</li>
							<li>
								<router-link
									to="/build"
									v-kv-track-event="['Footer', 'click-Explore-Developer API']"
								>
									Developer API
								</router-link>
							</li>
						</ul>
					</kv-accordion-item>
					<kv-accordion-item
						id="work-with-us_accordion"
						:open="false"
					>
						<template #header>
							<h2>Work with us</h2>
						</template>
						<ul>
							<li>
								<a
									:href="careersUrl"
									target="_blank"
									rel="noopener"
									v-kv-track-event="['Footer', 'click-Work with us-Careers']"
								>
									Careers
								</a>
							</li>
							<li>
								<router-link
									to="/work-with-us/internvolunteers"
									v-kv-track-event="['Footer', 'click-Work with us-Volunteer interships']"
								>
									Volunteer internships
								</router-link>
							</li>
							<li>
								<a
									href="https://www.careers.kiva.org/fellowships"
									target="_blank"
									rel="noopener"
									v-kv-track-event="['Footer', 'click-Work with us-Kiva fellows']"
								>
									Kiva fellows
								</a>
							</li>
							<li>
								<router-link
									to="/work-with-us/reviewers"
									v-kv-track-event="['Footer', 'click-Work with us-Review and translation']"
								>
									Review and translation
								</router-link>
							</li>
							<li>
								<a
									href="https://www.kivaushub.org/hubs"
									target="_blank"
									rel="noopener"
									v-kv-track-event="['Footer', 'click-Work with us-US Hubs']"
								>
									US Hubs
								</a>
							</li>
						</ul>
					</kv-accordion-item>
					<span></span>
				</div>
			</div>
			<div class="row collapse">
				<div class="column">
					<ul class=" download-app-icons">
						<li>
							<a
								:href="appStoreUrl"
								target="_blank"
								rel="noopener"
								v-kv-track-event="['global', 'click-app-badge-footer', 'App Store']"
							>
								<img
									class="download-app-ios"
									src="@/assets/icons/app-store.svg"
									loading="lazy"
									alt="Check out our new app on the App Store"
								>
							</a>
						</li>
						<li>
							<a
								:href="playStoreUrl"
								target="_blank"
								rel="noopener"
								v-kv-track-event="['global', 'click-app-badge-footer', 'Google Store']"
							>
								<img
									class="download-app-android"
									src="@/assets/icons/play-store.svg"
									loading="lazy"
									alt="Check out our new app on the Play Store"
								>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="row collapse small-footer__social-icon-row">
				<div class="column">
					<a
						href="//www.facebook.com/kiva/"
						target="_blank"
						rel="noopener"
						v-kv-track-event="['Footer', 'click-social-icon', 'Facebook']"
					>
						<kv-icon name="facebook-round" title="Facebook" class="small-footer__social-icon" />
					</a>
					<a
						href="//www.instagram.com/kiva.org"
						target="_blank"
						rel="noopener"
						v-kv-track-event="['Footer', 'click-social-icon', 'Instagram']"
					>
						<kv-icon name="instagram" title="Instagram" class="small-footer__social-icon" />
					</a>
					<a
						href="//twitter.com/kiva"
						target="_blank"
						rel="noopener"
						v-kv-track-event="['Footer', 'click-social-icon', 'Twitter']"
					>
						<kv-icon name="twitter" title="Twitter" class="small-footer__social-icon" />
					</a>
				</div>
			</div>

			<div class="row collapse">
				<div class="column">
					<ul class="small-footer__single-line-links">
						<li>
							<router-link
								:to="privacyUrl"
								v-kv-track-event="['Footer', 'click-Privacy policy']"
							>
								Privacy policy
							</router-link>
						</li>
						<li>
							<router-link
								:to="cookiesUrl"
								v-kv-track-event="['Footer', 'click-Cookie policy']"
							>
								Cookie and Data Settings
							</router-link>
						</li>
						<li>
							<router-link
								:to="termsUrl"
								v-kv-track-event="['Footer', 'click-Terms of use']"
							>
								Terms of use
							</router-link>
						</li>
						<li>
							<router-link
								:to="sitemapUrl"
								v-kv-track-event="['Footer', 'click-Site map']"
							>
								Site map
							</router-link>
						</li>
					</ul>
				</div>
			</div>
			<div class="row collapse">
				<div class="column">
					<p class="small-footer__disclaimer">
						Lending through Kiva involves risk of principal loss.
						Kiva does not guarantee repayment or offer a financial return on your loan.
						<br><br>
						&copy; {{ year }} Kiva. All rights reserved.
					</p>
				</div>
			</div>
		</nav>
		<nav class="large-footer show-for-large" aria-label="Footer navigation">
			<div class="row collapse text-left">
				<div class="column narrow hide-for-print">
					<div class="large-footer__block">
						<h2>Borrow</h2>
						<p>Loans for entrepreneurs doing <br class="xxlu">amazing things.</p>
						<ul>
							<li>
								<router-link
									:to="applyUrl"
									v-kv-track-event="['Footer', 'click-Borrow-Apply now']"
								>
									Apply now
								</router-link>
							</li>
						</ul>
					</div>
					<div class="large-footer__block">
						<h2>Lend</h2>
						<p>Make a loan, change a life.</p>
						<ul>
							<li>
								<router-link
									:to="lendByCategoryUrl"
									v-kv-track-event="['Footer', 'click-Lend-lend now']"
								>
									Lend now
								</router-link>
							</li>
							<li>
								<router-link
									:to="monthlyGoodUrl"
									v-kv-track-event="['Footer', 'click-Lend-Monthly Good']"
								>
									Monthly Good
								</router-link>
							</li>
						</ul>
					</div>
					<div class="large-footer__block">
						<h2>Explore</h2>
						<ul>
							<li>
								<router-link
									to="/protocol"
									v-kv-track-event="['Footer', 'click-Explore-Protocol']"
								>
									Protocol
								</router-link>
							</li>
							<li>
								<router-link
									to="/gifts"
									v-kv-track-event="['Footer', 'click-Explore-Gifts']"
								>
									Gifts
								</router-link>
							</li>
							<li>
								<router-link
									to="/live"
									v-kv-track-event="['Footer', 'click-Explore-Happening now']"
								>
									Happening now
								</router-link>
							</li>
							<li>
								<router-link
									to="/build"
									v-kv-track-event="['Footer', 'click-Explore-Developer API']"
								>
									Developer API
								</router-link>
							</li>
						</ul>
					</div>
				</div>
				<div class="column narrow hide-for-print">
					<div class="large-footer__block hide-for-print">
						<h2>Get to know us</h2>
						<ul>
							<li>
								<router-link
									:to="aboutUrl"
									v-kv-track-event="['Footer', 'click-Get to know us-About us']"
								>
									About us
								</router-link>
							</li>
							<li>
								<router-link
									to="/about/how"
									v-kv-track-event="['Footer', 'click-Get to know us-How Kiva works']"
								>
									How Kiva works
								</router-link>
							</li>
							<li>
								<router-link
									to="/about/how#faq-hkw-section"
									v-kv-track-event="['Footer', 'click-Get to know us-FAQs']"
								>
									FAQs
								</router-link>
							</li>
							<li>
								<router-link
									to="/about/where-kiva-works"
									v-kv-track-event="['Footer', 'click-Get to know us-Where Kiva works']"
								>
									Where Kiva works
								</router-link>
							</li>
							<li>
								<router-link
									to="/blog"
									v-kv-track-event="['Footer', 'click-Get to know us-Blog']"
								>
									Blog
								</router-link>
							</li>
							<li>
								<router-link
									to="/partner-with-us"
									v-kv-track-event="['Footer', 'click-Get to know us-Partner with us']"
								>
									Partner with us
								</router-link>
							</li>
							<li>
								<router-link
									to="/help/contact-us"
									v-kv-track-event="['Footer', 'click-Get to know us-Contact us']"
								>
									Contact us
								</router-link>
							</li>
							<li>
								<router-link
									:to="helpUrl"
									v-kv-track-event="['Footer', 'click-Get to know us-Help']"
								>
									Help
								</router-link>
							</li>
						</ul>
					</div>
					<div class="large-footer__block hide-for-print">
						<h2>Community</h2>
						<ul>
							<li>
								<router-link
									to="/teams"
									v-kv-track-event="['Footer', 'click-Community-Teams']"
								>
									Teams
								</router-link>
							</li>
							<li>
								<router-link
									to="/kivau/intro"
									v-kv-track-event="['Footer', 'click-Community-Students and educators']"
								>
									Students and educators
								</router-link>
							</li>
						</ul>
					</div>
				</div>
				<div class="column large-6 expand-for-print">
					<div class="large-footer__block">
						<p>
							Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
							Founded in 2005, and based in San Francisco, with offices in Bangkok, Nairobi,
							Portland and staff around the globe.
						</p>
						<ul class="hide-for-print">
							<li>
								<router-link
									to="/donate/supportus"
									v-kv-track-event="['Footer', 'click-Donate', 'Donate to Kiva here']"
								>
									Donate to Kiva
								</router-link>
							</li>
						</ul>
					</div>
					<div class="large-footer__block hide-for-print">
						<ul class=" download-app-icons">
							<li>
								<a
									:href="appStoreUrl"
									target="_blank"
									rel="noopener"
									v-kv-track-event="['global', 'click-app-badge-footer', 'App Store']"
								>
									<img
										class="download-app-ios"
										src="@/assets/icons/app-store.svg"
										loading="lazy"
										alt="Check out our new app on the App Store"
									>
								</a>
							</li>
							<li>
								<a
									:href="playStoreUrl"
									target="_blank"
									rel="noopener"
									v-kv-track-event="['global', 'click-app-badge-footer', 'Google Store']"
								>
									<img
										class="download-app-android"
										src="@/assets/icons/play-store.svg"
										loading="lazy"
										alt="Check out our new app on the Play Store"
									>
								</a>
							</li>
						</ul>
					</div>
					<div class="large-footer__block hide-for-print">
						<h2>Work with us</h2>
						<ul class="large-footer__single-line-links large-footer__single-line-links--work-with-us">
							<li>
								<a
									:href="careersUrl"
									target="_blank"
									rel="noopener"
									v-kv-track-event="['Footer', 'click-Work with us-Careers']"
								>
									Careers
								</a>
							</li>
							<li>
								<router-link
									to="/work-with-us/internvolunteers"
									v-kv-track-event="['Footer', 'click-Work with us-Volunteer interships']"
								>
									Volunteer internships
								</router-link>
							</li>
							<li>
								<a
									href="https://www.careers.kiva.org/fellowships"
									target="_blank"
									rel="noopener"
									v-kv-track-event="['Footer', 'click-Work with us-Kiva fellows']"
								>
									Kiva fellows
								</a>
							</li>
							<li>
								<router-link
									to="/work-with-us/reviewers"
									v-kv-track-event="['Footer', 'click-Work with us-Review and translation']"
								>
									Review and translation
								</router-link>
							</li>
							<li>
								<a
									href="https://www.kivaushub.org/hubs"
									target="_blank"
									rel="noopener"
									v-kv-track-event="['Footer', 'click-Work with us-US Hubs']"
								>
									US Hubs
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="row column collapse text-left">
				<ul class="large-footer__single-line-links">
					<li>
						<router-link
							:to="privacyUrl"
							v-kv-track-event="['Footer', 'click-Privacy policy']"
						>
							Privacy policy
						</router-link>
					</li>
					<li>
						<router-link
							:to="cookiesUrl"
							v-kv-track-event="['Footer', 'click-Cookie policy']"
						>
							Cookie and Data Settings
						</router-link>
					</li>
					<li>
						<router-link
							:to="termsUrl"
							v-kv-track-event="['Footer', 'click-Terms of use']"
						>
							Terms of use
						</router-link>
					</li>
					<li>
						<router-link
							:to="sitemapUrl"
							v-kv-track-event="['Footer', 'click-Site map']"
						>
							Site map
						</router-link>
					</li>
				</ul>
			</div>
			<div class="row column collapse text-left">
				<p class="large-footer__disclaimer">
					Lending through Kiva involves risk of principal loss.
					Kiva does not guarantee repayment or offer a financial return on your loan.
					<br><br>
					&copy; {{ year }} Kiva. All rights reserved.
				</p>
			</div>
		</nav>
	</footer>
</template>

<script>
import { getYear } from 'date-fns';
import getCacheKey from '@/util/getCacheKey';
import KvAccordionItem from '@/components/Kv/KvAccordionItem';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'TheFooter',
	components: {
		KvAccordionItem,
		KvIcon
	},
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
			monthlyGoodUrl: '/monthlygood',
			aboutUrl: '/about',
			lendByCategoryUrl: '/lend-by-category',
			helpUrl: '/help',
			careersUrl: 'https://www.careers.kiva.org/',
			cookiesUrl: '/legal/cookies#manage-settings',
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

$footer-background-color: $kiva-bg-lightgray;
$footer-text-color: $umbreon;
$footer-link-color: $kiva-darkgreen;
$footer-separator-color: $magnemite;

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
		padding: rem-calc(24);
	}

	@include breakpoint(large) {
		padding: rem-calc(24) 1rem;
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
		letter-spacing: initial;
		margin: 0;
		line-height: 1.6;
	}

	.download-app-icons li {
		display: inline-block;
	}

	.download-app-android,
	.download-app-ios {
		height: rem-calc(40);
	}

	.download-app-android {
		width: rem-calc(135);
	}

	.download-app-ios {
		width: rem-calc(120);
		margin-right: 0.5rem;
	}

	.small-footer {
		text-align: left;

		ul {
			margin-bottom: 1rem;
		}

		hr {
			margin: 1rem auto 0 auto;
			border-bottom: 1px solid $footer-link-color;
		}

		.kv-accordion {
			border-bottom: 1px solid $footer-link-color;
		}

		&__social-icon-row {
			margin: 0.65rem auto 1rem auto;
		}

		&__social-icon {
			width: rem-calc(24);
			height: rem-calc(24);
			flex-shrink: 0;
			margin-right: rem-calc(26);
			fill: $footer-text-color;
		}
	}

	.large-footer {
		&__block {
			padding: 1rem 0.9375rem;
			text-align: left;
		}

		&__single-line-links--work-with-us {
			max-width: rem-calc(463);
		}
	}

	.large-footer,
	.small-footer {
		&__disclaimer {
			color: $footer-separator-color;
		}

		&__single-line-links {
			$spacing: 0.5rem;

			margin-bottom: 1rem;
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

		.download-app-icons {
			margin-top: 1.65rem;
		}
	}

	@media print {
		.expand-for-print {
			width: 100%;
			max-width: 100%;
			flex: 1;
		}
	}
}
</style>
