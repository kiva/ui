<template>
	<section class="tw-rounded tw-border-gray-300 tw-bg-white tw-p-[20px] md:tw-p-[28px] md:tw-p-[32px]">
		<h2 class="tw-mt-0 tw-mb-1">
			About {{ borrowerBusinessName }}
		</h2>

		<kv-text-link
			v-if="processedWebsite"
			:icon="mdiArrowTopRight"
			class="tw-mb-2"
			target="_blank"
			:href="processedWebsite"
		>
			View Website
		</kv-text-link>

		<h3 v-if="sector" class="tw-mb-0">
			{{ sector }}
		</h3>
		<p class="tw-text-h4 tw-text-gray-500 tw-mb-2">
			Industry
		</p>

		<h3 class="tw-mb-0">
			{{ yearsInBusinessFormatted }}
		</h3>
		<p class="tw-text-h4 tw-text-gray-500">
			Years in operation
		</p>

		<!-- TEMPORARY Text link until we add icon display -->
		<kv-text-link
			v-for="(link, index) in filteredSocialLinks"
			:key="index"
			:icon="mdiArrowTopRight"
			class="tw-mt-2 tw-mr-2"
			target="_blank"
			:href="link.url"
		>
			{{ link.type }}
		</kv-text-link>
	</section>
</template>

<script>
import { mdiArrowTopRight } from '@mdi/js';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

export default {
	components: {
		KvTextLink,
	},
	props: {
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
	computed: {
		processedWebsite() {
			const website = this.socialLinks?.website ?? '';
			// verify we have a website url
			if (!website) return '';
			// TODO: Create util to validate + format website urls (ensure they use https and have a valid structure)
			return website;
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
			return socialLinks;
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
		}
	}
};
</script>
