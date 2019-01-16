<template>
	<transition name="kvfade">
		<div class="cookie-banner-container" v-if="showBanner">
			<div class="cookie-banner">
				<div class="cookie-banner-content">
					<div
						@click.stop.prevent="handleClickClose"
						class="close-button close-button-desktop"
						aria-label="Close"
					>
						<kv-icon name="small-x" />
					</div>
					<div class="mobile-row">
						<div class="left-spacer"></div>
						<h3>Cookie Policy</h3>
						<div
							@click.stop.prevent="handleClickClose"
							class="close-button close-button-mobile"
							aria-label="Close"
						>
							<kv-icon name="small-x" />
						</div>
					</div>
					We use cookies to improve your experience and enable the functionality and security of this site.
					By continuing to use this site, you agree to the use of these cookies.
					For more information please see our <a href="https://www.kiva.org/legal/cookie">cookie policy</a>.
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
	inject: ['cookieStore'],
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

		if (this.cookieStore.get('kvgdpr') === undefined) {
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

			.icon.icon-small-x {
				fill: $subtle-gray;
				transition: fill 0.16s linear;
			}

			&:hover {
				.icon.icon-small-x {
					fill: $charcoal;
				}
			}
		}

		.close-button-desktop {
			display: none;
		}

		.cookie-banner-content {
			text-align: center;
			margin: 0 auto;
			max-width: 43.75rem;

			.mobile-row {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left-spacer,
				.close-button-mobile {
					width: 100px;
					height: 28px;
				}

				.close-button-mobile {
					display: flex;
					align-items: center;
					justify-content: flex-end;

					.icon.icon-small-x {
						height: $banner-padding-mobile;
						width: $banner-padding-mobile;
					}
				}
			}
		}
	}

	@include breakpoint(medium) {
		padding: 1rem;

		.cookie-banner {
			$banner-padding-tablet: 1.5rem;

			padding: $banner-padding-tablet;

			.close-button-mobile {
				.icon.icon-small-x {
					height: $banner-padding-tablet;
					width: $banner-padding-tablet;
				}
			}
		}
	}

	@include breakpoint(xga) {
		padding: rem-calc(20);

		.cookie-banner {
			$banner-padding-desktop: 1.875rem;

			padding: $banner-padding-desktop;

			.close-button-desktop {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				position: absolute;
				right: $banner-padding-desktop;
				top: 50%;
				transform: translateY(-50%);

				.icon.icon-small-x {
					height: $banner-padding-desktop;
					width: $banner-padding-desktop;
				}
			}

			.cookie-banner-content {
				.mobile-row {
					display: none;
				}
			}
		}
	}
}
</style>
