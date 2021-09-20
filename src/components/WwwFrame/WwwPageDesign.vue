<template>
	<div class="kv-tailwind tw-relative tw-h-full">
		<!-- Header / Nav -->

		<kv-theme-provider :theme="darkTheme">
			<kv-page-container>
				<div class="tw-flex tw-flex-col md:tw-flex-row tw-items-baseline">
					<div class="tw-flex-1">
						<!-- eslint-disable max-len -->
						<svg width="89" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3.434 0H0v17.145h3.434V0Zm9.026 17.145h3.434V5.491H12.46v11.654Zm8.784 0h3.954l3.954-11.654h-3.434s-1.836 6.32-2.396 8.33h-.04c-.56-2.01-2.436-8.33-2.436-8.33h-3.634l4.032 11.654ZM41.131 5.491h-3.315v1.6c-.56-1.23-1.876-1.928-3.434-1.928-2.795 0-5.032 2.34-5.032 6.155 0 3.816 2.156 6.155 4.871 6.155 1.918 0 3.036-.944 3.635-2.011v1.682h3.313l-.038-11.653Zm-3.395 6.114c0 2.134-1.278 3.16-2.556 3.16-1.398 0-2.316-1.477-2.316-3.447s.958-3.447 2.435-3.447c1.198 0 2.436 1.025 2.436 3.16v.574h.002Zm-33.423-.574c5.51 0 6.79-4.718 6.79-5.54h-.48c-5.51 0-6.788 4.72-6.788 5.54h.478Zm-.478.41c0 .861.958 5.662 6.868 5.662h.479c0-.861-.959-5.662-6.869-5.662h-.478Zm12.418-9.15c0-1.108-.838-2.052-1.917-2.052h-.12c-1.077-.041-1.996.82-2.036 1.929v.123c0 1.107.838 2.052 1.917 2.052h.12c1.078.04 1.997-.82 2.036-1.93v-.122Z" fill="currentColor" class="tw-text-brand" />
							<path d="M8.174 23.355c3.56 0 6.065 1.571 7.06 4.733l-3.48 1.213c-.577-1.87-1.631-2.963-3.64-2.963-2.963 0-4.415 2.386-4.415 5.708 0 3.281 1.452 5.707 4.435 5.707 1.83 0 2.983-.934 3.58-2.784l3.44 1.213c-1.114 2.804-3.42 4.535-7.06 4.535C3.182 40.717 0 37.515 0 32.046c0-5.47 3.142-8.691 8.174-8.691ZM24.342 32.105c-.377-.278-.934-.378-1.352-.378-1.094 0-2.665.756-2.665 3.361v5.29h-3.46V29.022h3.222v1.91c.696-1.512 1.75-2.248 3.4-2.248.438 0 .955.04 1.452.259l-.597 3.162ZM36.056 38.032c-.915 1.67-2.645 2.705-5.071 2.705-3.52 0-5.887-2.268-5.887-6.026 0-3.72 2.426-5.986 5.768-5.986 3.818 0 5.628 2.764 5.628 6.065v.836h-7.916c.04 1.312.617 2.605 2.367 2.605 1.193 0 1.83-.676 2.168-1.352l2.943 1.153Zm-7.458-4.514h4.455c-.04-1.572-.954-2.387-2.187-2.387-1.413 0-2.188.955-2.268 2.386ZM49.181 40.379h-3.32v-1.631c-.578 1.034-1.711 1.989-3.62 1.989-2.725 0-4.873-2.287-4.873-6.006 0-3.7 2.227-6.006 5.032-6.006 1.55 0 2.883.696 3.46 1.889v-1.591h3.321v11.356Zm-3.42-5.947c0-2.068-1.233-3.082-2.466-3.082-1.472 0-2.427 1.452-2.427 3.36 0 1.93.915 3.362 2.307 3.362 1.293 0 2.586-.975 2.586-3.083v-.557ZM58.608 40.22c-.696.318-1.65.497-2.565.497-2.247 0-3.918-.975-3.918-3.7V31.53h-1.89v-2.506h1.89V25.78l3.44-1.551v4.793h2.467v2.506h-2.466v5.031c0 1.154.397 1.352.974 1.352.517 0 .855-.218 1.233-.397l.835 2.704ZM61.73 23.355c1.214 0 2.049.815 2.049 2.028 0 1.094-.756 1.989-2.049 1.989-1.292 0-2.048-.875-2.048-1.989 0-1.213.835-2.028 2.048-2.028Zm-1.71 5.668h3.44v11.355h-3.44V29.023ZM64.594 29.023h3.62s1.889 6.185 2.426 8.134h.04c.557-1.95 2.406-8.134 2.406-8.134h3.42L72.55 40.379h-3.938l-4.017-11.356ZM87.704 38.032c-.915 1.67-2.645 2.705-5.072 2.705-3.52 0-5.886-2.268-5.886-6.026 0-3.72 2.426-5.986 5.767-5.986 3.818 0 5.628 2.764 5.628 6.065v.836h-7.915c.04 1.312.616 2.605 2.367 2.605 1.193 0 1.83-.676 2.167-1.352l2.944 1.153Zm-7.478-4.514h4.455c-.04-1.572-.955-2.387-2.188-2.387-1.412 0-2.168.955-2.267 2.386ZM7.856 53.678c3.957.676 5.787 2.049 5.787 5.052 0 3.221-2.844 5.25-6.722 5.25-4.216 0-6.782-2.387-6.921-5.072l3.58-.576c.159 1.59 1.233 2.764 3.34 2.764 1.691 0 3.083-.636 3.083-2.168 0-1.233-.914-1.83-3.5-2.247-3.48-.557-6.125-1.69-6.125-5.051 0-3.341 2.685-5.012 6.384-5.012 3.46 0 6.065 1.65 6.622 4.574l-3.62.796c-.258-1.532-1.332-2.486-3.102-2.486-1.79 0-2.665.716-2.665 1.83-.02 1.431 1.154 1.889 3.859 2.346ZM22.393 63.482c-.696.319-1.65.498-2.565.498-2.248 0-3.918-.975-3.918-3.7v-5.488h-1.89v-2.506h1.89v-3.242l3.44-1.551v4.793h2.466v2.506H19.35v5.031c0 1.154.398 1.352.975 1.352.517 0 .855-.218 1.233-.397l.835 2.704ZM34.445 63.642h-3.321v-1.67c-.577 1.073-1.671 2.008-3.48 2.008-2.168 0-3.938-1.293-3.938-3.858v-7.836h3.44v6.802c0 1.551.796 2.068 1.71 2.068 1.074 0 2.148-.935 2.148-3.023v-5.847h3.44v11.356ZM44.806 53.718v-6.761h3.44v16.705h-3.32v-1.65c-.597 1.033-1.77 1.988-3.72 1.988-2.784 0-4.991-2.287-4.991-6.006 0-3.699 2.267-6.006 5.15-6.006 1.592-.02 2.825.716 3.441 1.73Zm.02 3.918c0-2.068-1.293-3.023-2.545-3.023-1.572 0-2.546 1.452-2.546 3.361 0 1.93.935 3.361 2.426 3.361 1.313 0 2.665-.934 2.665-3.003v-.696ZM52.443 46.618c1.213 0 2.048.815 2.048 2.029 0 1.093-.755 1.988-2.048 1.988-1.293 0-2.048-.875-2.048-1.988 0-1.214.835-2.029 2.048-2.029Zm-1.71 5.668h3.44v11.356h-3.44V52.286ZM67.776 57.974c0 3.72-2.386 6.006-5.946 6.006-3.54 0-5.907-2.287-5.907-6.006 0-3.719 2.387-6.006 5.907-6.006 3.56 0 5.946 2.287 5.946 6.006Zm-3.48 0c0-1.929-.736-3.44-2.466-3.44-1.69 0-2.426 1.491-2.426 3.44 0 1.95.735 3.44 2.426 3.44 1.73 0 2.466-1.51 2.466-3.44Z" fill="currentColor" class="tw-text-primary" />
						</svg>
						<!-- eslint-endable max-len -->
						<span class="tw-sr-only">Kiva Creative Studio</span>
					</div>
				</div>
			</kv-page-container>

			<div class="tw-bg-secondary md:tw-bg-primary tw-w-full tw-py-2.5 -tw-mx-2.5 md:tw-mx-0 tw-sticky tw-top-0">
				<kv-page-container>
					<ul class="tw-flex tw-gap-2 tw-bg-secondary md:tw-bg-primary">
						<li>
							<kv-button variant="ghost" to="#logos">
								Logos
							</kv-button>
						</li>
						<li>
							<kv-button variant="ghost" to="#colors">
								Colors
							</kv-button>
						</li>
						<li>
							<kv-button variant="ghost" to="#type">
								Type
							</kv-button>
						</li>
					</ul>
				</kv-page-container>
			</div>

			<!-- Body -->
			<main>
				<!-- <header>
				<kv-page-container>
					<h1 class="tw-text-secondary tw-text-h3 tw-mb-8">
						Brand guide & assets
					</h1>
					<p class="tw-text-jumbo">
						Everything you
						need to create
						<span class="tw-text-brand">good</span> experiences.
					</p>
				</kv-page-container>
			</header> -->
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
						<a class="tw-text-tertiary hover:tw-text-action-highlight" href="https://www.instagram.com/kiva.org" target="_blank"><instagram-logo class="tw-w-3" /></a>
						<a class="tw-text-tertiary hover:tw-text-action-highlight" href="https://www.facebook.com/kiva" target="_blank"><facebook-logo class="tw-w-3" /></a>
						<a class="tw-text-tertiary hover:tw-text-action-highlight" href="https://www.twitter.com/Kiva/" target="_blank"><twitter-logo class="tw-w-3" /></a>
					</div>
					<p class="tw-text-secondary md:tw-hidden">
						&copy; {{ year }} Kiva. All rights reserved.
					</p>
				</kv-page-container>
			</div>
		</kv-theme-provider>
	</div>
</template>

<script>
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';
import InstagramLogo from '@/assets/inline-svgs/logos/instagram-logo.svg';
import FacebookLogo from '@/assets/inline-svgs/logos/facebook-logo.svg';
import TwitterLogo from '@/assets/inline-svgs/logos/twitter-logo.svg';

import { darkTheme } from '@kiva/kv-tokens/configs/kivaColors';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvThemeProvider from '~/@kiva/kv-components/vue/KvThemeProvider';

export default {
	components: {
		KivaLogo,
		KvButton,
		KvGrid,
		KvPageContainer,
		KvThemeProvider,
		InstagramLogo,
		FacebookLogo,
		TwitterLogo,
	},
	data() {
		return {
			year: new Date().getFullYear(),
			darkTheme,

		};
	}
};
</script>
