<template>
	<footer
		class="tw-p-2 md:tw-p-3
				lg:tw-px-2 lg:tw-py-3 tw-bg-secondary tw-text-primary
				print:tw-p-0 print:tw-font-book print:tw-min-h-[auto]"
	>
		<kv-page-container>
			<disclaimers />
			<nav class="tw-block lg:tw-hidden" aria-label="Footer navigation">
				<div class="tw-mt-3 tw-mb-3">
					<h2 class="tw-text-h4">
						Borrow
					</h2>
					<p class="tw-text-small">
						Loans for entrepreneurs doing amazing things.
					</p>
					<ul class="tw-mb-2">
						<li>
							<router-link
								:to="applyUrl"
								v-kv-track-event="['Footer', 'click-Borrow-Apply now']"
								class="tw-text-small"
							>
								Apply now
							</router-link>
						</li>
					</ul>
				</div>

				<div class="tw-mb-3">
					<h2 class="tw-text-h4">
						Lend
					</h2>
					<p class="tw-text-small">
						Make a loan, change a life.
					</p>
					<ul class="tw-mb-2">
						<li>
							<router-link
								:to="lendByCategoryUrl"
								v-kv-track-event="['Footer', 'click-Lend-lend now']"
								class="tw-text-small"
							>
								Lend now
							</router-link>
						</li>
						<li>
							<router-link
								:to="monthlyGoodUrl"
								v-kv-track-event="['Footer', 'click-Lend-Monthly Good']"
								class="tw-text-small"
							>
								Monthly Good
							</router-link>
						</li>
					</ul>
				</div>

				<div>
					<h2 class="tw-text-h4">
						Donate
					</h2>
					<p class="tw-text-small">
						Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
						Founded in 2005, and based in San Francisco, with offices in Bangkok, Nairobi,
						Portland and staff around the globe.
					</p>
					<ul class="tw-mb-3">
						<li>
							<router-link
								to="/donate/supportus"
								v-kv-track-event="['Footer', 'click-Donate', 'Donate to Kiva here']"
								class="tw-text-small"
							>
								Donate to Kiva
							</router-link>
						</li>
					</ul>
					<hr class="tw-border-tertiary tw-mt-2 tw-mb-0">
				</div>

				<div>
					<kv-accordion-item
						id="get-to-know-us_accordion"
						:open="false"
					>
						<template #header>
							<h2 class="tw-text-h4">
								Get to know us
							</h2>
						</template>
						<ul class="tw-mb-2">
							<li>
								<router-link
									:to="aboutUrl"
									v-kv-track-event="['Footer', 'click-Get to know us-About us']"
									class="tw-text-small"
								>
									About us
								</router-link>
							</li>
							<li>
								<router-link
									to="/about/how"
									v-kv-track-event="['Footer', 'click-Get to know us-How Kiva works']"
									class="tw-text-small"
								>
									How Kiva works
								</router-link>
							</li>
							<li>
								<router-link
									to="/about/how#faq-hkw-section"
									v-kv-track-event="['Footer', 'click-Get to know us-FAQs']"
									class="tw-text-small"
								>
									FAQs
								</router-link>
							</li>
							<li>
								<router-link
									to="/about/where-kiva-works"
									v-kv-track-event="['Footer', 'click-Get to know us-Where Kiva works']"
									class="tw-text-small"
								>
									Where Kiva works
								</router-link>
							</li>
							<li>
								<router-link
									to="/blog"
									v-kv-track-event="['Footer', 'click-Get to know us-Blog']"
									class="tw-text-small"
								>
									Blog
								</router-link>
							</li>
							<li>
								<router-link
									to="/partner-with-us"
									v-kv-track-event="['Footer', 'click-Get to know us-Partner with us']"
									class="tw-text-small"
								>
									Partner with us
								</router-link>
							</li>
							<li>
								<a
									:href="employeeEngagementUrl"
									v-kv-track-event="['Footer', 'click-Work with us-Employee engagement']"
									class="tw-text-small"
								>
									Employee engagement
								</a>
							</li>
							<li>
								<router-link
									to="/help/contact-us"
									v-kv-track-event="['Footer', 'click-Get to know us-Contact us']"
									class="tw-text-small"
								>
									Contact us
								</router-link>
							</li>
							<li>
								<router-link
									:to="helpUrl"
									v-kv-track-event="['Footer', 'click-Get to know us-Help']"
									class="tw-text-small"
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
							<h2 class="tw-text-h4">
								Community
							</h2>
						</template>
						<ul class="tw-mb-2">
							<li>
								<router-link
									to="/teams"
									v-kv-track-event="['Footer', 'click-Community-Teams']"
									class="tw-text-small"
								>
									Teams
								</router-link>
							</li>
							<li>
								<router-link
									to="/kivau/intro"
									v-kv-track-event="['Footer', 'click-Community-Students and educators']"
									class="tw-text-small"
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
							<h2 class="tw-text-h4">
								Explore
							</h2>
						</template>
						<ul class="tw-mb-2">
							<li>
								<router-link
									to="/protocol"
									v-kv-track-event="['Footer', 'click-Explore-Protocol']"
									class="tw-text-small"
								>
									Protocol
								</router-link>
							</li>
							<li>
								<router-link
									to="/gifts"
									v-kv-track-event="['Footer', 'click-Explore-Gifts']"
									class="tw-text-small"
								>
									Gifts
								</router-link>
							</li>
							<li>
								<router-link
									to="/live"
									v-kv-track-event="['Footer', 'click-Explore-Happening now']"
									class="tw-text-small"
								>
									Happening now
								</router-link>
							</li>
							<li>
								<router-link
									to="/build"
									v-kv-track-event="['Footer', 'click-Explore-Developer API']"
									class="tw-text-small"
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
							<h2 class="tw-text-h4">
								Work with us
							</h2>
						</template>
						<ul class="tw-mb-2">
							<li>
								<a
									:href="careersUrl"
									target="_blank"
									rel="noopener"
									v-kv-track-event="['Footer', 'click-Work with us-Careers']"
									class="tw-text-small"
								>
									Careers
								</a>
							</li>
							<li>
								<router-link
									to="/work-with-us/internvolunteers"
									v-kv-track-event="['Footer', 'click-Work with us-Volunteer interships']"
									class="tw-text-small"
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
									class="tw-text-small"
								>
									Kiva fellows
								</a>
							</li>
							<li>
								<router-link
									to="/work-with-us/reviewers"
									v-kv-track-event="['Footer', 'click-Work with us-Review and translation']"
									class="tw-text-small"
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
									class="tw-text-small"
								>
									US Hubs
								</a>
							</li>
						</ul>
					</kv-accordion-item>
					<span></span>
				</div>

				<div>
					<ul class="tw-mt-4 tw-mb-2">
						<li class="tw-inline-block">
							<a
								:href="appStoreUrl"
								target="_blank"
								rel="noopener"
								v-kv-track-event="['global', 'click-app-badge-footer', 'App Store']"
							>
								<img
									class="tw-h-5 tw-mr-1"
									style="width: 7.5rem;"
									src="@/assets/icons/app-store.svg"
									loading="lazy"
									alt="Check out our new app on the App Store"
								>
							</a>
						</li>
						<li class="tw-inline-block">
							<a
								:href="playStoreUrl"
								target="_blank"
								rel="noopener"
								v-kv-track-event="['global', 'click-app-badge-footer', 'Google Store']"
							>
								<img
									class="tw-h-5"
									style="width: 8.4375rem;"
									src="@/assets/icons/play-store.svg"
									loading="lazy"
									alt="Check out our new app on the Play Store"
								>
							</a>
						</li>
					</ul>
				</div>

				<div class="tw-my-2">
					<a
						href="//www.facebook.com/kiva/"
						class="tw-inline-flex"
						target="_blank"
						rel="noopener"
						v-kv-track-event="['Footer', 'click-social-icon', 'Facebook']"
					>
						<kv-material-icon
							class="tw-mr-2.5 tw-w-3 tw-h-3 tw-text-tertiary"
							:icon="mdiFacebook"
						/>
						<span class="tw-sr-only">Kiva on Facebook</span>
					</a>
					<a
						href="//www.instagram.com/kiva.org"
						class="tw-inline-flex"
						target="_blank"
						rel="noopener"
						v-kv-track-event="['Footer', 'click-social-icon', 'Instagram']"
					>
						<kv-material-icon
							class="tw-mr-2.5 tw-w-3 tw-h-3 tw-text-tertiary"
							:icon="mdiInstagram"
						/>
						<span class="tw-sr-only">Kiva on Instagram</span>
					</a>
					<a
						href="//twitter.com/kiva"
						class="tw-inline-flex"
						target="_blank"
						rel="noopener"
						v-kv-track-event="['Footer', 'click-social-icon', 'Twitter']"
					>
						<kv-material-icon
							class="tw-mr-2.5 tw-w-3 tw-h-3 tw-text-tertiary"
							:icon="mdiTwitter"
						/>
						<span class="tw-sr-only">Kiva on Twitter</span>
					</a>
				</div>

				<div>
					<p class="tw-text-small tw-text-tertiary">
						Lending through Kiva involves risk of principal loss.
						Kiva does not guarantee repayment or offer a financial return on your loan.
						<br><br>
						&copy; {{ year }} Kiva. All rights reserved.
					</p>
				</div>

				<div class="tw-my-3">
					<ul class="tw-mb-2 tw-text-small tw-overflow-hidden">
						<li class="tw-inline-block tw--translate-x-2">
							<router-link
								:to="privacyUrl"
								v-kv-track-event="['Footer', 'click-Privacy policy']"
								class="tw-whitespace-nowrap tw-ml-1 tw-border-l tw-border-tertiary tw-pl-1"
							>
								Privacy policy
							</router-link>
						</li>
						<li class="tw-inline-block tw--translate-x-2">
							<router-link
								:to="cookiesUrl"
								v-kv-track-event="['Footer', 'click-Cookie policy']"
								class="tw-whitespace-nowrap tw-ml-1 tw-border-l tw-border-tertiary tw-pl-1"
							>
								Cookie and Data Settings
							</router-link>
						</li>
						<li class="tw-inline-block tw--translate-x-2">
							<router-link
								:to="termsUrl"
								v-kv-track-event="['Footer', 'click-Terms of use']"
								class="tw-whitespace-nowrap tw-ml-1 tw-border-l tw-border-tertiary tw-pl-1"
							>
								Terms of use
							</router-link>
						</li>
						<li class="tw-inline-block tw--translate-x-2">
							<router-link
								:to="sitemapUrl"
								v-kv-track-event="['Footer', 'click-Site map']"
								class="tw-whitespace-nowrap tw-ml-1 tw-border-l tw-border-tertiary tw-pl-1"
							>
								Site map
							</router-link>
						</li>
					</ul>
				</div>
			</nav>
			<nav class="tw-hidden lg:tw-block tw-mt-4" aria-label="Footer navigation">
				<kv-grid class="tw-grid-cols-4 tw-mb-1">
					<div class="print:tw-hidden">
						<div class="tw-mb-2">
							<h2 class="tw-text-h4">
								Borrow
							</h2>
							<p class="tw-text-small">
								Loans for entrepreneurs doing <br class="xxlu">amazing things.
							</p>
							<ul>
								<li>
									<router-link
										:to="applyUrl"
										v-kv-track-event="['Footer', 'click-Borrow-Apply now']"
										class="tw-text-small"
									>
										Apply now
									</router-link>
								</li>
							</ul>
						</div>
						<div class="tw-mb-2">
							<h2 class="tw-text-h4">
								Lend
							</h2>
							<p class="tw-text-small">
								Make a loan, change a life.
							</p>
							<ul>
								<li>
									<router-link
										:to="lendByCategoryUrl"
										v-kv-track-event="['Footer', 'click-Lend-lend now']"
										class="tw-text-small"
									>
										Lend now
									</router-link>
								</li>
								<li>
									<router-link
										:to="monthlyGoodUrl"
										v-kv-track-event="['Footer', 'click-Lend-Monthly Good']"
										class="tw-text-small"
									>
										Monthly Good
									</router-link>
								</li>
							</ul>
						</div>
						<div class="tw-mb-2">
							<h2 class="tw-text-h4">
								Explore
							</h2>
							<ul>
								<li>
									<router-link
										to="/protocol"
										v-kv-track-event="['Footer', 'click-Explore-Protocol']"
										class="tw-text-small"
									>
										Protocol
									</router-link>
								</li>
								<li>
									<router-link
										to="/gifts"
										v-kv-track-event="['Footer', 'click-Explore-Gifts']"
										class="tw-text-small"
									>
										Gifts
									</router-link>
								</li>
								<li>
									<router-link
										to="/live"
										v-kv-track-event="['Footer', 'click-Explore-Happening now']"
										class="tw-text-small"
									>
										Happening now
									</router-link>
								</li>
								<li>
									<router-link
										to="/build"
										v-kv-track-event="['Footer', 'click-Explore-Developer API']"
										class="tw-text-small"
									>
										Developer API
									</router-link>
								</li>
							</ul>
						</div>
					</div>
					<div class="print:tw-hidden">
						<div class="tw-mb-2 print:tw-hidden">
							<h2 class="tw-text-h4">
								Get to know us
							</h2>
							<ul>
								<li>
									<router-link
										:to="aboutUrl"
										v-kv-track-event="['Footer', 'click-Get to know us-About us']"
										class="tw-text-small"
									>
										About us
									</router-link>
								</li>
								<li>
									<router-link
										to="/about/how"
										v-kv-track-event="['Footer', 'click-Get to know us-How Kiva works']"
										class="tw-text-small"
									>
										How Kiva works
									</router-link>
								</li>
								<li>
									<router-link
										to="/about/how#faq-hkw-section"
										v-kv-track-event="['Footer', 'click-Get to know us-FAQs']"
										class="tw-text-small"
									>
										FAQs
									</router-link>
								</li>
								<li>
									<router-link
										to="/about/where-kiva-works"
										v-kv-track-event="['Footer', 'click-Get to know us-Where Kiva works']"
										class="tw-text-small"
									>
										Where Kiva works
									</router-link>
								</li>
								<li>
									<router-link
										to="/blog"
										v-kv-track-event="['Footer', 'click-Get to know us-Blog']"
										class="tw-text-small"
									>
										Blog
									</router-link>
								</li>
								<li>
									<router-link
										to="/partner-with-us"
										v-kv-track-event="['Footer', 'click-Get to know us-Partner with us']"
										class="tw-text-small"
									>
										Partner with us
									</router-link>
								</li>
								<li>
									<a
										:href="employeeEngagementUrl"
										v-kv-track-event="['Footer', 'click-Work with us-Employee engagement']"
										class="tw-text-small"
									>
										Employee engagement
									</a>
								</li>
								<li>
									<router-link
										to="/help/contact-us"
										v-kv-track-event="['Footer', 'click-Get to know us-Contact us']"
										class="tw-text-small"
									>
										Contact us
									</router-link>
								</li>
								<li>
									<router-link
										:to="helpUrl"
										v-kv-track-event="['Footer', 'click-Get to know us-Help']"
										class="tw-text-small"
									>
										Help
									</router-link>
								</li>
							</ul>
						</div>
						<div class="tw-mb-2 print:tw-hidden">
							<h2 class="tw-text-h4">
								Community
							</h2>
							<ul>
								<li>
									<router-link
										to="/teams"
										v-kv-track-event="['Footer', 'click-Community-Teams']"
										class="tw-text-small"
									>
										Teams
									</router-link>
								</li>
								<li>
									<router-link
										to="/kivau/intro"
										v-kv-track-event="['Footer', 'click-Community-Students and educators']"
										class="tw-text-small"
									>
										Students and educators
									</router-link>
								</li>
							</ul>
						</div>
					</div>
					<div class="tw-col-span-2 print:tw-w-full print:tw-max-w-full print:tw-flex-1">
						<div>
							<p class="tw-text-small">
								Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
								Founded in 2005, and based in San Francisco, with offices in Bangkok, Nairobi,
								Portland and staff around the globe.
							</p>
							<ul class="print:tw-hidden">
								<li>
									<router-link
										to="/donate/supportus"
										v-kv-track-event="['Footer', 'click-Donate', 'Donate to Kiva here']"
										class="tw-text-small"
									>
										Donate to Kiva
									</router-link>
								</li>
							</ul>
						</div>
						<div class="print:tw-hidden">
							<ul class="tw-mt-4">
								<li class="tw-inline-block">
									<a
										:href="appStoreUrl"
										target="_blank"
										rel="noopener"
										v-kv-track-event="['global', 'click-app-badge-footer', 'App Store']"
										class="tw-text-small"
									>
										<img
											class="download-app-ios tw-h-5 tw-mr-1"
											src="@/assets/icons/app-store.svg"
											loading="lazy"
											alt="Check out our new app on the App Store"
										>
									</a>
								</li>
								<li class="tw-inline-block">
									<a
										:href="playStoreUrl"
										target="_blank"
										rel="noopener"
										v-kv-track-event="['global', 'click-app-badge-footer', 'Google Store']"
										class="tw-text-small"
									>
										<img
											class="download-app-android tw-h-5"
											src="@/assets/icons/play-store.svg"
											loading="lazy"
											alt="Check out our new app on the Play Store"
										>
									</a>
								</li>
							</ul>
						</div>
						<div class="print:tw-hidden">
							<h2 class="tw-text-h4 tw-mt-3">
								Work with us
							</h2>
							<ul class="large-footer__single-line-links tw-mb-2 tw-max-w-md tw-overflow-hidden">
								<li class="tw-inline-block tw--translate-x-2">
									<a
										:href="careersUrl"
										target="_blank"
										rel="noopener"
										v-kv-track-event="['Footer', 'click-Work with us-Careers']"
										class="tw-text-small tw-whitespace-nowrap
											tw-border-l tw-border-tertiary tw-pl-1 tw-ml-1"
									>
										Careers
									</a>
								</li>
								<li class="tw-inline-block tw--translate-x-2">
									<router-link
										to="/work-with-us/internvolunteers"
										v-kv-track-event="['Footer', 'click-Work with us-Volunteer interships']"
										class="tw-text-small tw-whitespace-nowrap
											tw-border-l tw-border-tertiary tw-pl-1 tw-ml-1"
									>
										Volunteer internships
									</router-link>
								</li>
								<li class="tw-inline-block tw--translate-x-2">
									<a
										href="https://www.careers.kiva.org/fellowships"
										target="_blank"
										rel="noopener"
										v-kv-track-event="['Footer', 'click-Work with us-Kiva fellows']"
										class="tw-text-small tw-whitespace-nowrap
											tw-border-l tw-border-tertiary tw-pl-1 tw-ml-1"
									>
										Kiva fellows
									</a>
								</li>
								<li class="tw-inline-block tw--translate-x-2">
									<router-link
										to="/work-with-us/reviewers"
										v-kv-track-event="['Footer', 'click-Work with us-Review and translation']"
										class="tw-text-small tw-whitespace-nowrap
											tw-border-l tw-border-tertiary tw-pl-1 tw-ml-1"
									>
										Review and translation
									</router-link>
								</li>
								<li class="tw-inline-block tw--translate-x-2">
									<a
										href="https://www.kivaushub.org/hubs"
										target="_blank"
										rel="noopener"
										v-kv-track-event="['Footer', 'click-Work with us-US Hubs']"
										class="tw-text-small tw-whitespace-nowrap
											tw-border-l tw-border-tertiary tw-pl-1 tw-ml-1"
									>
										US Hubs
									</a>
								</li>
							</ul>
						</div>
					</div>
				</kv-grid>

				<div>
					<ul class="large-footer__single-line-links tw-mb-2 tw-overflow-hidden">
						<li class="tw-inline-block tw--translate-x-2">
							<router-link
								:to="privacyUrl"
								v-kv-track-event="['Footer', 'click-Privacy policy']"
								class="tw-text-small tw-whitespace-nowrap
									tw-border-l tw-border-tertiary tw-pl-1 tw-ml-1"
							>
								Privacy policy
							</router-link>
						</li>
						<li class="tw-inline-block tw--translate-x-2">
							<router-link
								:to="cookiesUrl"
								v-kv-track-event="['Footer', 'click-Cookie policy']"
								class="tw-text-small tw-whitespace-nowrap
									tw-border-l tw-border-tertiary tw-pl-1 tw-ml-1"
							>
								Cookie and Data Settings
							</router-link>
						</li>
						<li class="tw-inline-block tw--translate-x-2">
							<router-link
								:to="termsUrl"
								v-kv-track-event="['Footer', 'click-Terms of use']"
								class="tw-text-small tw-whitespace-nowrap
									tw-border-l tw-border-tertiary tw-pl-1 tw-ml-1"
							>
								Terms of use
							</router-link>
						</li>
						<li class="tw-inline-block tw--translate-x-2">
							<router-link
								:to="sitemapUrl"
								v-kv-track-event="['Footer', 'click-Site map']"
								class="tw-text-small tw-whitespace-nowrap
									tw-border-l tw-border-tertiary tw-pl-1 tw-ml-1"
							>
								Site map
							</router-link>
						</li>
					</ul>
				</div>

				<div>
					<p class="tw-text-small tw-text-tertiary">
						Lending through Kiva involves risk of principal loss.
						Kiva does not guarantee repayment or offer a financial return on your loan.
						<br>
						&copy; {{ year }} Kiva. All rights reserved.
					</p>
				</div>
			</nav>
		</kv-page-container>
	</footer>
</template>

<script>
import { getYear } from 'date-fns';
import KvAccordionItem from '@/components/Kv/KvAccordionItem';
import Disclaimers from '@/components/WwwFrame/DisclaimersContentful';
import { mdiFacebook, mdiInstagram, mdiTwitter } from '@mdi/js';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'TheFooter',
	components: {
		KvAccordionItem,
		Disclaimers,
		KvGrid,
		KvPageContainer,
		KvMaterialIcon
	},
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
			employeeEngagementUrl: '/lp/employee-engagement',
			cookiesUrl: '/legal/cookies#manage-settings',
			sitemapUrl: '/sitemap',
			privacyUrl: '/legal/privacy',
			termsUrl: '/legal/terms',
			appStoreUrl: 'https://apps.apple.com/app/id1453093374',
			playStoreUrl: 'https://play.google.com/store/apps/details?id=org.kiva.lending',
			mdiFacebook,
			mdiInstagram,
			mdiTwitter
		};
	},
};
</script>
