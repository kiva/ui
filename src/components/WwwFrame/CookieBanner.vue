<template>
	<transition name="kvfade">
		<div class="cookie-banner-container" v-if="showBanner">
			<div class="cookie-banner">
				<div class="cookie-banner-content">
					<h3 class="text-center hide-for-xxlarge">Cookie Policy</h3>
					We use cookies to improve your experience and enable the functionality and security of this site.
					By continuing to use this site, you agree to the use of these cookies.
					For more information or to change your cookie
					preferences please see our <a href="/legal/cookie" target="_blank">cookie policy</a>.
					<kv-button
						class="setting close-button"
						@click.native.stop.prevent="handleClickClose"
						aria-label="Close"
					>Sounds good
					</kv-button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';
import cookieStore from '@/util/cookieStore';

export default {
	components: {
		KvIcon,
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
			if (cookieStore.get('kvgdpr_closed') === 'true') {
				cookieStore.remove('kvgdpr_closed');
				this.setGdprCookie();
			}
		},
		setGdprCookie() {
			const now = (new Date()).getTime();
			const cookieValue = `viewed=true&viewed_date=${now}`;

			try {
				// eslint-disable-next-line max-len
				cookieStore.set('kvgdpr', cookieValue, { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
			} catch (e) { /* intentionally empty */ }
		}
	},
	mounted() {
		this.migrateCookie();

		if (cookieStore.get('kvgdpr') === undefined) {
			this.showBanner = true;
			this.$kvTrackEvent('global', 'gdpr-notice', 'visible');
			this.setGdprCookie();
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.cookie-banner-container {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 0.5rem;
	z-index: 1000;

	.cookie-banner {
		$banner-padding-mobile: 1.125rem;

		position: relative;
		background: #f4f4f4;
		font-size: rem-calc(14);
		border: 0.5px solid rgba(151, 151, 151, 0.3);
		border-radius: rem-calc(2);
		color: $charcoal;
		padding: $banner-padding-mobile;

		.close-button {
			cursor: pointer;
			display: block;
			margin: 15px auto 0 auto;
		}

		.cookie-banner-content {
			text-align: center;
			margin: 0 auto;
			max-width: 38.75rem;
		}
	}

	@include breakpoint(medium) {
		padding: 1rem;

		.cookie-banner {
			$banner-padding-tablet: 1.5rem;

			padding: $banner-padding-tablet;
		}
	}

	@include breakpoint(xga) {
		padding: rem-calc(20);

		.cookie-banner {
			$banner-padding-desktop: 1.875rem;

			padding: $banner-padding-desktop;

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
}
</style>
