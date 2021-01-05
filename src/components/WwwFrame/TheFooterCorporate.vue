<template>
	<footer class="the-footer-corporate" :style="cssVars">
		<nav aria-label="Footer navigation">
			<div class="row">
				<div class="columns">
					<div class="the-footer-corporate__logos logo-group">
						<kiva-logo class="logo-group__kiva" />
						<span v-if="corporateLogo" class="logo-group__separator" aria-hidden="true">+</span>
						<img
							v-if="corporateLogo"
							class="logo-group__corporate"
							:src="corporateLogo"
							alt=""
						>
					</div>
					<p class="the-footer-corporate__text">
						Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
						Founded in 2005, and based in San Francisco, with offices in Bangkok, Nairobi,
						Portland and staff around the globe.
					</p>
					<div class="the-footer-corporate__links">
						<router-link
							to="/legal/privacy"
							v-kv-track-event="['Footer', 'click-Explore-Privacy policy']"
						>
							Privacy policy
						</router-link>
						<span> | </span>
						<router-link
							to="/legal/terms"
							v-kv-track-event="['Footer', 'click-Explore-Terms of use']"
						>
							Terms of use
						</router-link>
					</div>
					<p class="the-footer-corporate__text">
						Lending through Kiva involves risk of principal loss.
						Kiva does not guarantee repayment or offer a financial return on your loan.
					</p>
					<p class="the-footer-corporate__text">
						&copy; {{ year }} Kiva. All rights reserved.
					</p>
				</div>
			</div>
		</nav>
	</footer>
</template>

<script>
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';

export default {
	components: {
		KivaLogo,
	},
	props: {
		theme: {
			type: Object,
			default: () => {}
		},
		corporateLogo: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			year: new Date().getFullYear(),
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
					'--kv-footer-logo-color': this.theme.logoColor || '',
				};
			}
			return {};
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

$footer-background-color: $kiva-green;
$footer-text-color: #fff;
$footer-link-color: $dark-green;
$footer-separator-color: $light-green;
$footer-logo-color: $white;

.the-footer-corporate {
	background-color: $footer-background-color; // IE11 fallback
	background-color: var(--kv-footer-background-color, $footer-background-color);
	color: $footer-text-color; // IE11 fallback
	color: var(--kv-footer-text-color, $footer-text-color);
	text-align: center;
	padding: 1rem;
	font-size: $small-text-font-size;
	line-height: $small-text-line-height;

	&__text {
		max-width: rem-calc(400);
		margin: 0 auto 1rem;
	}

	&__links {
		margin-bottom: 1rem;
	}

	&__logos {
		margin-bottom: 1.5rem;
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
}

.logo-group {
	display: flex;
	justify-content: center;
	align-items: center;
	height: rem-calc(28);
	margin-bottom: 1.5rem;

	&__kiva {
		fill: $footer-logo-color; // IE11 fallback
		fill: var(--kv-footer-logo-color, $footer-logo-color);
	}

	&__kiva,
	&__corporate {
		height: 100%;
	}

	&__separator {
		color: $subtle-gray;
		display: inline-block;
		font-size: 2rem;
		font-weight: bold;
		margin: 0 0.75rem;
	}
}
</style>
