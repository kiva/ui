<template>
	<footer class="the-footer-corporate" :style="cssVars">
		<nav aria-label="Footer navigation">
			<div class="row">
				<div class="columns">
					<campaign-logo-group
						class="the-footer-corporate__logos"
						:corporate-logo-url="corporateLogoUrl"
					/>
					<p class="the-footer-corporate__text">
						Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
						Founded in 2005, and based in San Francisco, with offices in Bangkok, Nairobi,
						Portland and staff around the globe.
					</p>
					<div class="the-footer-corporate__links">
						<router-link
							to="/legal/privacy"
							v-kv-track-event="['Footer', 'click-Explore-Privacy policy']"
							target="_blank"
						>
							Privacy policy
						</router-link>
						<span> | </span>
						<router-link
							to="/legal/cookies#manage-settings"
							v-kv-track-event="['Footer', 'click-Explore-Cookie policy']"
							target="_blank"
						>
							Cookie and Data Settings
						</router-link>
						<span> | </span>
						<router-link
							to="/legal/terms"
							v-kv-track-event="['Footer', 'click-Explore-Terms of use']"
							target="_blank"
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
import CampaignLogoGroup from '@/components/CorporateCampaign/CampaignLogoGroup';

export default {
	components: {
		CampaignLogoGroup,
	},
	props: {
		theme: {
			type: Object,
			default: () => {}
		},
		corporateLogoUrl: {
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
		--logo-color: var(--kv-footer-logo-color, $footer-logo-color);

		margin-bottom: 1.5rem;
		height: rem-calc(20);

		@include breakpoint(large) {
			height: rem-calc(28);
		}
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
</style>
