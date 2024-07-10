<template>
	<div class="tw-bg-primary">
		<!-- Header / Nav -->

		<!-- mobile only logo -->
		<kv-page-container class="md:tw-hidden">
			<div class="tw-flex tw-flex-col md:tw-flex-row tw-items-baseline">
				<div class="tw-flex-1 tw-my-2.5">
					<KivaCreativeStudioLogo class="tw-h-4 tw-text-primary" />
					<span class="tw-sr-only">Kiva Creative Studio</span>
				</div>
			</div>
		</kv-page-container>

		<div
			class="
					tw-bg-secondary md:tw-bg-primary tw-w-full -tw-mx-2.5 md:tw-mx-0
					tw-sticky tw-z-sticky tw-top-0"
		>
			<kv-page-container>
				<div class="tw-flex tw-items-center">
					<!-- Desktop only logo -->
					<div class="tw-hidden md:tw-block tw-flex-1 tw-my-2.5">
						<KivaCreativeStudioLogo class="tw-h-4" />
						<span class="tw-sr-only">Kiva Creative Studio</span>
					</div>

					<!-- nav for mobile and desktop -->
					<nav id="top-nav" class="tw-flex-1">
						<ul
							class="
								tw-flex tw-gap-2 tw-items-center md:tw-justify-end tw-py-2.5
								tw-bg-secondary md:tw-bg-primary"
						>
							<li class="tw-flex-1 md:tw-flex-initial">
								<kv-button
									variant="ghost"
									class="tw-w-full md:tw-w-auto"
									href="#creative-studio-logo-intro"
									@click.native.prevent="scrollPastNav('#creative-studio-logo-intro')"
									:state="activeSection.includes('creative-studio-logo') ? 'active' : ''"
								>
									Logos
								</kv-button>
							</li>
							<li class="tw-flex-1 md:tw-flex-initial">
								<kv-button
									variant="ghost"
									class="tw-w-full md:tw-w-auto"
									href="#creative-studio-colors-intro"
									@click.native.prevent="scrollPastNav('#creative-studio-colors-intro')"
									:state="activeSection.includes('creative-studio-colors') ? 'active' : ''"
								>
									Colors
								</kv-button>
							</li>
							<li class="tw-flex-1 md:tw-flex-initial">
								<kv-button
									variant="ghost"
									class="tw-w-full md:tw-w-auto"
									href="#creative-studio-typography-intro"
									@click.native.prevent="scrollPastNav('#creative-studio-typography-intro')"
									:state="activeSection.includes('creative-studio-typography') ? 'active' : ''"
								>
									Type
								</kv-button>
							</li>
						</ul>
					</nav>
				</div>
			</kv-page-container>
		</div>

		<!-- Body -->
		<main>
			<slot></slot>
		</main>

		<!-- Footer -->
		<div class="tw-bg-secondary tw-py-8">
			<kv-page-container>
				<kv-grid class="tw-grid-cols-none md:tw-grid-cols-12 tw-mb-4 md:tw-mb-8">
					<div class="tw-col-span-4">
						<kiva-logo class="tw-h-3 tw-mb-4 tw-text-brand" />
						<p class="tw-text-secondary tw-hidden md:tw-block">
							&copy; {{ year }} Kiva. All rights reserved.
						</p>
					</div>
					<div class="tw-col-span-8">
						<kv-grid class="tw-grid-cols-4 md:tw-grid-cols-8 tw-gap-y-6">
							<div class="tw-col-span-2">
								<h2 class="tw-text-h4 tw-mb-1 md:tw-mb-2">
									Downloads
								</h2>
								<ul class="tw-flex tw-flex-col tw-gap-0.5">
									<li>
										<a href="/">
											Logo
										</a>
									</li>
									<li>
										<a
											:href="`mailto:designops@kiva.org?${typeRequestEmail}`"
											class="tw-inline-flex tw-gap-1"
										>
											<span>Type</span>
											<kv-material-icon class="tw-w-2 tw-h-2" :icon="mdiEmailOutline" />
										</a>
									</li>
								</ul>
							</div>
							<div class="tw-col-span-2">
								<h2 class="tw-text-h4 tw-mb-1 md:tw-mb-2">
									Our Sites
								</h2>
								<ul class="tw-flex tw-flex-col tw-gap-0.5">
									<li>
										<a href="/">
											kiva.org
										</a>
									</li>
									<li>
										<a href="https://kiva.global">
											kiva.global
										</a>
									</li>
								</ul>
							</div>
							<div class="tw-col-span-2">
								<h2 class="tw-text-h4 tw-mb-1 md:tw-mb-2">
									Contact Us
								</h2>
								<ul class="tw-flex tw-flex-col tw-gap-0.5">
									<li>
										<a href="mailto:designops@kiva.org">designops@kiva.org</a>
									</li>
								</ul>
							</div>
							<div class="tw-col-span-2">
								<h2 class="tw-text-h4 tw-mb-1 md:tw-mb-2">
									Legal
								</h2>
								<ul class="tw-flex tw-flex-col tw-gap-0.5">
									<li>
										<router-link to="/legal/terms">
											Terms of use
										</router-link>
									</li>
									<li>
										<router-link to="/legal/privacy">
											Privacy policy
										</router-link>
									</li>
								</ul>
							</div>
						</kv-grid>
					</div>
				</kv-grid>
				<div class="tw-flex tw-gap-4 tw-mb-1.5 md:tw-mb-0">
					<a
						class="tw-text-tertiary hover:tw-text-action-highlight"
						href="https://www.instagram.com/kiva.org"
						target="_blank"
					>
						<instagram-logo class="tw-w-3" />
						<span class="tw-sr-only">Kiva's Instagram</span>
					</a>
					<a
						class="tw-text-tertiary hover:tw-text-action-highlight"
						href="https://www.facebook.com/kiva"
						target="_blank"
					>
						<facebook-logo class="tw-w-3" />
						<span class="tw-sr-only">Kiva's Facebook</span>
					</a>
					<a
						class="tw-text-tertiary hover:tw-text-action-highlight"
						href="https://www.twitter.com/Kiva/"
						target="_blank"
					>
						<twitter-logo class="tw-w-3" />
						<span class="tw-sr-only">Kiva's Twitter</span>
					</a>
				</div>
				<p class="tw-text-secondary md:tw-hidden">
					&copy; {{ year }} Kiva. All rights reserved.
				</p>
			</kv-page-container>
		</div>
	</div>
</template>

<script>
import { mdiEmailOutline } from '@mdi/js';
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';
import KivaCreativeStudioLogo from '@/assets/inline-svgs/logos/kiva-creative-studio-logo.svg';
import InstagramLogo from '@/assets/inline-svgs/logos/instagram-logo.svg';
import FacebookLogo from '@/assets/inline-svgs/logos/facebook-logo.svg';
import TwitterLogo from '@/assets/inline-svgs/logos/twitter-logo.svg';
import { createIntersectionObserver } from '@/util/observerUtils';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'WwwPageDesign',
	components: {
		KivaLogo,
		KivaCreativeStudioLogo,
		KvButton,
		KvGrid,
		KvMaterialIcon,
		KvPageContainer,
		InstagramLogo,
		FacebookLogo,
		TwitterLogo,
	},
	data() {
		return {
			year: new Date().getFullYear(),
			activeSection: '',
			mdiEmailOutline,
			typeRequestEmail: `
				subject=${encodeURI('📥 Typekit request')}
				&body=${encodeURI(`Name:
Organization:

Hey, Design 👋
This is a message requesting the Kiva Post Grot typekit for the purpose(s) of
				`)}
			`
		};
	},
	methods: {
		scrollPastNav(id) {
			// Scrolls the page so the target isn't covered by the top nav
			const navEl = document.querySelector('#top-nav');
			const navHeight = navEl?.clientHeight ?? 0;
			const targetEl = document.querySelector(id);
			const targetOffset = targetEl?.offsetTop ?? 0;

			if (navHeight && targetOffset) {
				window.scrollTo({
					top: targetOffset - navHeight,
					behavior: 'smooth'
				});
			}

			// update the url without triggering a new scroll
			const url = new URL(window.location);
			url.hash = id;
			window.history.replaceState({}, '', url);
		},
		createObserver() {
			// scrollspy to highlight which section is currently in the viewport
			setTimeout(() => {
				// Kludge. Not sure why setTimeout is needed, but the observer doesn't seem to work without it.
				// Possibly because I'm not using $refs.
				// Tried await this.$nextTick(), but doesn't work.
				this.observer = createIntersectionObserver({
					targets: document.querySelectorAll('[data-section-type="contentful-section"]'),
					options: {
						rootMargin: '-50% 0px', // when the section crosses the halfway mark of the screen
						root: null, // use the window as the root
					},
					callback: entries => {
						entries.forEach(entry => {
							if (entry.isIntersecting) {
								this.activeSection = entry.target.id;
							}
						});
					}
				});
			}, 500);
		},
		destroyObserver() {
			if (this.observer) {
				this.observer.disconnect();
			}
		},
	},
	mounted() {
		this.createObserver();
	},
	beforeDestroy() {
		this.destroyObserver();
	},
};
</script>
