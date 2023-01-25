<template>
	<footer class="the-footer-corporate tw-bg-secondary tw-text-primary">
		<nav aria-label="Footer navigation">
			<div class="tw-px-2 tw-py-4 md:tw-px-4 md:tw-py-6 tw-text-center">
				<div class="tw-bg-white tw-rounded-sm tw-p-2 tw-mb-3 tw-mx-auto" style="max-width: 400px;">
					<campaign-logo-group
						class="the-footer-corporate__logos tw-h-3 md:tw-h-4"
						:corporate-logo-url="corporateLogoUrl"
						:logo-height="logoHeight"
						:logo-classes="logoClasses"
					/>
				</div>
				<p class="the-footer-corporate__text tw-text-small tw-mx-auto tw-mb-2" style="max-width: 400px;">
					Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
					Founded in 2005, and based in San Francisco, with offices in Bangkok, Nairobi,
					Portland and staff around the globe.
				</p>
				<div class="the-footer-corporate__links tw-text-small tw-mb-2">
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
				<p class="the-footer-corporate__text tw-text-small tw-mx-auto tw-mb-2" style="max-width: 400px;">
					Lending through Kiva involves risk of principal loss.
					Kiva does not guarantee repayment or offer a financial return on your loan.
				</p>
				<p class="the-footer-corporate__text tw-text-tertiary tw-text-small">
					&copy; {{ year }} Kiva. All rights reserved.
				</p>
			</div>
		</nav>
	</footer>
</template>

<script>
import CampaignLogoGroup from '@/components/CorporateCampaign/CampaignLogoGroup';

export default {
	name: 'TheFooterCorporate',
	components: {
		CampaignLogoGroup,
	},
	props: {
		corporateLogoUrl: {
			type: String,
			default: ''
		},
		logoHeight: {
			type: Number,
			default: 28,
			required: false
		},
		logoClasses: {
			type: String,
			default: '',
			required: false
		}
	},
	data() {
		return {
			year: new Date().getFullYear(),
		};
	},
};
</script>
