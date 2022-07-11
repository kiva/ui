<template>
	<section
		class="tw-rounded tw-border-tertiary tw-bg-primary tw-p-2.5 md:tw-p-3.5 lg:tw-p-4"
		data-test-id="bp-direct-business-info"
	>
		<h2 class="tw-mt-0 tw-mb-1" data-testid="bp-direct-business-name">
			About {{ borrowerBusinessName }}
		</h2>

		<kv-text-link
			v-if="processedWebsite"
			:icon="mdiArrowTopRight"
			class="tw-mb-2"
			data-testid="bp-direct-business-website"
			target="_blank"
			:href="processedWebsite"
		>
			View Website
		</kv-text-link>

		<h3 v-if="sector" class="tw-mb-0" data-testid="bp-direct-business-industry">
			{{ sector }}
		</h3>
		<p class="tw-text-h4 tw-text-secondary tw-mb-2">
			Industry
		</p>

		<h3 class="tw-mb-0" data-testid="bp-direct-business-years">
			{{ yearsInBusinessFormatted }}
		</h3>
		<p class="tw-text-h4 tw-text-secondary">
			Years in operation
		</p>

		<a
			v-for="(link, index) in filteredSocialLinks"
			:key="index"
			target="_blank"
			class="tw-rounded tw-bg-secondary
					tw-inline-flex tw-items-center tw-justify-center
					tw-mt-2 tw-mr-2
					tw-h-6 tw-w-6"
			:data-testid="`bp-direct-business-social-links-${index}`"
			:href="verifyUrl(link.url)"
			v-kv-track-event="['Borrower Profile', 'EXP-GROW-655-Aug2021', 'click-social-', link.type]"
		>
			<component
				:is="getLogo(link.type)"
				:alt="`${link.type}-logo`"
				:width="getLogoWidth(link.type)"
				:height="getLogoHeight(link.type)"
			/>
		</a>
	</section>
</template>

<script>
import { mdiArrowTopRight } from '@mdi/js';
import * as Sentry from '@sentry/vue';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

const TwitterLogo = () => import('@/assets/inline-svgs/logos/twitter-logo.svg');
const YelpLogo = () => import('@/assets/inline-svgs/logos/yelp-logo.svg');
const EtsyLogo = () => import('@/assets/inline-svgs/logos/etsy-logo.svg');
const FacebookLogo = () => import('@/assets/inline-svgs/logos/facebook-logo.svg');
const InstagramLogo = () => import('@/assets/inline-svgs/logos/instagram-logo.svg');
const LinkedinLogo = () => import('@/assets/inline-svgs/logos/linkedin-logo.svg');

export default {
	name: 'BorrowerBusinessDetails',
	components: {
		KvTextLink,
		TwitterLogo,
		YelpLogo,
		EtsyLogo,
		FacebookLogo,
		InstagramLogo,
		LinkedinLogo,
	},
	props: {
		loanId: {
			type: Number,
			default: 0
		},
		borrowerBusinessName: {
			type: String,
			default: ''
		},
		sector: {
			type: String,
			default: ''
		},
		socialLinks: {
			type: Object,
			default: () => {}
		},
		yearsInBusiness: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			mdiArrowTopRight,
		};
	},
	methods: {
		getLogo(value) {
			switch (value) {
				case 'twitter':
					return TwitterLogo;
				case 'etsy':
					return EtsyLogo;
				case 'facebook':
					return FacebookLogo;
				case 'instagram':
					return InstagramLogo;
				case 'linkedin':
					return LinkedinLogo;
				case 'yelp':
					return YelpLogo;
				default:
					return null;
			}
		},
		getLogoWidth(value) {
			switch (value) {
				case 'twitter':
					return 28;
				case 'etsy':
					return 32;
				case 'facebook':
					return 28;
				case 'instagram':
					return 28;
				case 'linkedin':
					return 30;
				case 'yelp':
					return 30;
				default:
					return 0;
			}
		},
		getLogoHeight(value) {
			switch (value) {
				case 'twitter':
					return 23;
				case 'etsy':
					return 15;
				case 'facebook':
					return 28;
				case 'instagram':
					return 28;
				case 'linkedin':
					return 28;
				case 'yelp':
					return 22;
				default:
					return 0;
			}
		},
		verifyUrl(value) {
			if (value) {
				try {
					let validatedUrl = value;
					if (!value.startsWith('http')) {
						validatedUrl = `https://${value}`;
					}
					validatedUrl = new URL(validatedUrl);
					return validatedUrl.href;
				} catch (err) {
					if (!this.$$isServer) {
						Sentry.withScope(scope => {
							scope.setTag('borrower_profile', 'social_link');
							Sentry.captureMessage(`Invalid url ${value} for ${this.loanId}`);
						});
						return '';
					}
				}
			}
		}
	},
	computed: {
		processedWebsite() {
			const website = this.socialLinks?.website ?? '';
			// verify we have a website url
			if (!website) return '';

			return this.verifyUrl(website);
		},
		filteredSocialLinks() {
			const linkKeys = Object.keys(this.socialLinks);
			// this.socialLInks includes __typename + website which we don't want in this list
			const socialLinkKeys = ['etsy', 'facebook', 'instagram', 'linkedin', 'twitter', 'yelp'];
			// filter out any keys without a value
			const filteredKeys = linkKeys.filter(key => {
				if (socialLinkKeys.includes(key)
					&& this.socialLinks[key]) return true;
				return false;
			});
			// map api provided values to usable object
			const socialLinks = filteredKeys.map(key => {
				return { type: key, url: this.socialLinks[key] };
			});
			return socialLinks ?? [];
		},
		yearsInBusinessFormatted() {
			const formatedInBusinessOptions = {
				startup: 'New Business',
				six_month: '<6 months',
				one_year: '6 months - 1 year',
				three_year: '1 year - 3 years',
				five_year: '3 years - 5 years',
				more: 'More than 5 years',
			};

			return formatedInBusinessOptions[this.yearsInBusiness];
		},
	}
};
</script>
