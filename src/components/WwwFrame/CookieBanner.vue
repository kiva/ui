<template>
	<transition name="kvfade">
		<div class="cookie-banner-container" v-if="showBanner">
			<div class="cookie-banner">
				<div class="cookie-banner-content">
					We use cookies to improve your experience and enable the functionality and security of this site.
					By continuing to use this site, you agree to the use of these cookies.
					For more information or to change your cookie
					preferences please see our <a href="/legal/cookie" target="_blank">cookie policy</a>.
					<kv-button
						class="setting close-button"
						@click.native.stop.prevent="handleClickClose"
						aria-label="Close"
					>
						Sounds good
					</kv-button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import getCacheKey from '@/util/getCacheKey';

export default {
	name: 'CookieBanner',
	serverCacheKey: () => getCacheKey('CookieBanner'),
	inject: ['cookieStore'],
	components: {
		KvButton
	},
	data() {
		return {
			showBanner: false,
		};
	},
	methods: {
		handleClickClose() {
			this.showBanner = false;
			this.$kvTrackEvent('global', 'gdpr-notice', 'click-close');
		},
		migrateCookie() {
			if (this.cookieStore.get('kvgdpr_closed') === 'true') {
				this.cookieStore.remove('kvgdpr_closed');
				this.setGdprCookie();
			}
		},
		setGdprCookie() {
			const now = (new Date()).getTime();
			const cookieValue = `viewed=true&viewed_date=${now}`;

			try {
				// eslint-disable-next-line max-len
				this.cookieStore.set('kvgdpr', cookieValue, { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
			} catch (e) { /* intentionally empty */ }
		}
	},
	mounted() {
		this.migrateCookie();
		// If oneTrust is enabled - don't show banner
		if (!this.$appConfig?.oneTrust?.enable) {
			if (this.cookieStore.get('kvgdpr') === undefined) {
				this.showBanner = true;
				this.$kvTrackEvent('global', 'gdpr-notice', 'visible');
				this.setGdprCookie();
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$banner-padding-mobile: 0.75rem;
$banner-padding-desktop: 1.5rem;

.cookie-banner-container {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 0;
	z-index: 1000;

	.cookie-banner {
		position: relative;
		background: #f4f4f4;
		font-size: rem-calc(14);
		border: 0.5px solid rgba(151, 151, 151, 0.3);
		border-radius: rem-calc(2);
		color: $charcoal;
		padding: $banner-padding-mobile;
		line-height: 1.6;

		.close-button {
			cursor: pointer;
			display: block;
			margin: 0.25rem auto 0;
			padding: 0.55rem 1rem;
		}

		.cookie-banner-content {
			text-align: center;
			margin: 0 auto;
		}
	}

	@include breakpoint(large) {
		.cookie-banner {
			padding-right: 10rem;

			.close-button {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				position: absolute;
				right: $banner-padding-desktop;
				top: 50%;
				transform: translateY(-50%);
				margin: unset;
			}
		}
	}

	@include breakpoint(xga) {
		.cookie-banner {
			padding-right: 10rem;

			.cookie-banner-content {
				max-width: 49rem;
			}
		}
	}
}
</style>
