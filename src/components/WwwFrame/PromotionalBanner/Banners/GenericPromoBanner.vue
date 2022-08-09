<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
	<div class="tw-flex tw-items-center tw-justify-center tw-bg-brand tw-py-1 tw-pl-1.5 generic-banner">
		<kv-icon
			v-if="iconKey"
			:name="iconKey"
			class=" tw-fill-current tw-text-white tw-h-3 tw-w-3 tw-max-w-3 tw-my-0 tw-mr-1.5"
		/>
		<span class="text-center">
			<component
				:is="currentWrapperComponent"
				:to="trimmedLink"
				:href="trimmedLink"
				:target="isExternalLink ? '_blank' : '_self'"
				class="tw-text-center tw-text-white tw-text-base hover:tw-text-white hover:tw-no-underline
				tw-align-bottom"
				v-kv-track-event="handleTracking"
				v-html="processedContent"
			/>
			<a
				v-if="hasDisclaimer"
				@click="scrollToSection('#disclaimers')"
				class="tw-text-white"
				v-kv-track-event="['promo', 'click-Contentful-banner', 'disclaimer-superscript', '1']"
			>
				<sup>
					1
				</sup>
			</a>
		</span>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import smoothScrollMixin from '@/plugins/smooth-scroll-mixin';

export default {
	name: 'GenericPromoBanner',
	components: {
		KvIcon
	},
	mixins: [smoothScrollMixin],
	props: {
		iconKey: {
			type: String,
			default: ''
		},
		promoBannerContent: {
			type: Object,
			default() {
				return {
					kvTrackEvent: [],
					link: '',
					richText: '',
					disclaimer: '',
				};
			}
		},
	},
	methods: {
		scrollToSection(sectionId) {
			const elementToScrollTo = document.querySelector(sectionId);
			const topOfSectionToScrollTo = elementToScrollTo?.offsetTop ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		}
	},
	computed: {
		// if the promoBannerContent includes a link, render a router-link element, else render a plain div
		currentWrapperComponent() {
			if (this.promoBannerContent.link) {
				if (!this.isExternalLink) {
					return 'router-link';
				}
				if (this.isExternalLink) {
					return 'a';
				}
			}
			return 'div';
		},
		// Returns true if the link is an external link
		// Relative links should start with '/' and will resolve at kiva.org
		// External links should start with 'http' and will resolve outside in a new window
		isExternalLink() {
			return (this.promoBannerContent.link && this.promoBannerContent.link.substring(0, 4) === 'http');
		},
		// Checking to see if tracking events have been added in contentful
		// If not, pass through a more generic tracking event
		handleTracking() {
			if (typeof this.promoBannerContent.kvTrackEvent === 'undefined') {
				return ['promo', 'click-Contentful-banner', this.promoBannerContent.richText];
			}
			return this.promoBannerContent.kvTrackEvent;
		},
		processedContent() {
			// Remove all p tags from contentful rich text
			const contentfulRichText = this.promoBannerContent?.richText ?? '';
			return contentfulRichText.replace(/<p>/g, '').replace(/<\/p>/g, '');
		},
		trimmedLink() {
			return this.promoBannerContent?.link?.trim() ?? '';
		},
		hasDisclaimer() {
			const disclaimer = this.promoBannerContent?.disclaimer ?? '';
			return disclaimer !== '';
		}
	},
};
</script>
