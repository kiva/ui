<template>
	<section class="tw-relative">
		<kv-page-container class="tw-mt-4 md:tw-mt-6 lg:tw-mt-8">
			<kv-grid class="tw-grid-cols-12">
				<div :class="[
					'tw-px-2',
					'tw-mb-2',
					'tw-col-span-12',
					'md:tw-col-span-8',
					'md:tw-col-start-3',
					'lg:tw-col-span-6',
					'lg:tw-col-start-4'
				]"
				>
					<img
						class="tw-h-16 tw-w-16 tw-mx-auto tw-mb-4"
						:src="causesIconImgRequire(`./heart-icon.svg`)"
					>
					<h1 class="tw-text-center">
						We're excited you're here!
					</h1>
					<p class="tw-text-h3 tw-text-secondary tw-mt-3 tw-text-center tw-px-2.5 tw-mb-4">
						Check the app for regular inspiration and updates on your impact.
					</p>
					<div class="tw-m-auto tw-max-w-[220px]">
						<a
							class="tw-inline-block tw-mb-3 tw-w-full"
							:href="appStoreUrl"
							rel="noopener"
							v-kv-track-event="['global', 'click-app-badge-footer', 'App Store']"
						>
							<img
								class="tw-w-full"
								src="@/assets/icons/app-store.svg"
								loading="lazy"
								alt="Check out our new app on the App Store"
							>
						</a>
						<a
							class="tw-inline-block tw-mb-3 tw-w-full"
							:href="playStoreUrl"
							target="_blank"
							rel="noopener"
							v-kv-track-event="['global', 'click-app-badge-footer', 'Google Store']"
						>
							<img
								class="tw-w-full"
								src="@/assets/icons/play-store.svg"
								loading="lazy"
								alt="Check out our new app on the Play Store"
							>
						</a>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</section>
</template>

<script>

import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const causesIconImgRequire = require.context('@/assets/images/causes-icons/', true);

export default {
	components: {
		KvGrid,
		KvPageContainer,
	},
	data() {
		return {
			causesIconImgRequire,
			appStoreUrl: 'https://apps.apple.com/app/id1453093374',
			playStoreUrl: 'https://play.google.com/store/apps/details?id=org.kiva.lending'
		};
	},
	inject: ['apollo'],
};
</script>
