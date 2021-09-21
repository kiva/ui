<template>
	<div class="kv-tailwind">
		<div class="tw-bg-primary">
			<!-- Header / Nav -->

			<!-- mobile only logo -->
			<kv-page-container class="md:tw-hidden">
				<div class="tw-flex tw-flex-col md:tw-flex-row tw-items-baseline">
					<div class="tw-flex-1 tw-my-2.5">
						<KivaCreativeStudioLogo class="tw-h-8 tw-text-primary" />
						<span class="tw-sr-only">Kiva Creative Studio</span>
					</div>
				</div>
			</kv-page-container>

			<div class="
					tw-bg-secondary md:tw-bg-primary tw-w-full -tw-mx-2.5 md:tw-mx-0
					tw-sticky tw-z-sticky tw-top-0"
			>
				<kv-page-container>
					<div class="tw-flex">
						<!-- Desktop only logo -->
						<div class="tw-hidden md:tw-block tw-flex-1 tw-my-2.5">
							<KivaCreativeStudioLogo class="tw-h-8" />
							<span class="tw-sr-only">Kiva Creative Studio</span>
						</div>

						<!-- nav for mobile and desktop -->
						<ul class="
								tw-flex tw-gap-2 tw-items-center md:tw-justify-end tw-py-2.5
								tw-bg-secondary md:tw-bg-primary"
						>
							<li>
								<kv-button variant="ghost" to="#creative-studio-logo-intro">
									Logos
								</kv-button>
							</li>
							<li>
								<kv-button variant="ghost" to="#creative-studio-colors-intro">
									Colors
								</kv-button>
							</li>
							<li>
								<kv-button variant="ghost" to="#creative-studio-typography-intro">
									Type
								</kv-button>
							</li>
						</ul>
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
											<router-link to="/">
												Logo
											</router-link>
										</li>
										<li>
											<a href="mailto:design@kiva.org">Type</a>
										</li>
									</ul>
								</div>
								<div class="tw-col-span-2">
									<h2 class="tw-text-h4 tw-mb-1 md:tw-mb-2">
										Our Sites
									</h2>
									<ul class="tw-flex tw-flex-col tw-gap-0.5">
										<li>
											<router-link to="/">
												kiva.org
											</router-link>
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
											<a href="mailto:design@kiva.org">design@kiva.org</a>
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
	</div>
</template>

<script>
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';
import KivaCreativeStudioLogo from '@/assets/inline-svgs/logos/kiva-creative-studio-logo.svg';
import InstagramLogo from '@/assets/inline-svgs/logos/instagram-logo.svg';
import FacebookLogo from '@/assets/inline-svgs/logos/facebook-logo.svg';
import TwitterLogo from '@/assets/inline-svgs/logos/twitter-logo.svg';

import { darkTheme } from '@kiva/kv-tokens/configs/kivaColors';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	components: {
		KivaLogo,
		KivaCreativeStudioLogo,
		KvButton,
		KvGrid,
		KvPageContainer,
		InstagramLogo,
		FacebookLogo,
		TwitterLogo,
	},
	data() {
		return {
			darkTheme,
			year: new Date().getFullYear(),
		};
	}
};
</script>
