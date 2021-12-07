<template>
	<div class="row align-center generic-banner">
		<kv-icon :name="iconKey" :class="`${iconKey}-icon icon`" />
		<span class="text-center">
			<component
				:is="currentWrapperComponent"
				:to="trimmedLink"
				:href="trimmedLink"
				:target="isExternalLink ? '_blank' : '_self'"
				:class="{ 'banner-link' : trimmedLink, 'banner-wrapper' : !trimmedLink}"
				v-kv-track-event="handleTracking"
				v-html="processedContent"
			/>
			<a
				v-if="hasDisclaimer"
				@click="scrollToSection('#disclaimers')"
				class="disclaimer-indicator"
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
	components: {
		KvIcon
	},
	mixins: [smoothScrollMixin],
	props: {
		iconKey: {
			type: String,
			default: 'info'
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

<style  lang="scss" scoped>
@import 'settings';

.row {
	margin: 0;
	max-width: 100%;
}

.generic-banner {
	background-image: url('~@/assets/images/backgrounds/tipbar-bg-small.jpg');
	background-position: bottom;
	padding: 0.365rem;
	flex-wrap: unset;

	& [class*="-icon"] {
		display: block;
		align-self: center;
		height: rem-calc(22);
		width: rem-calc(22);
		min-width: rem-calc(22);
		max-width: rem-calc(22);
		fill: $kiva-icon-green;
		margin: 0 rem-calc(10);
	}

	.icon-corporate,
	.icon-iwd {
		fill: inherit;
	}

	.disclaimer-indicator {
		color: $kiva-icon-green;

		&:hover,
		&:active {
			color: $kiva-darkgreen;
		}
	}

	.banner-link,
	.banner-wrapper {
		color: $kiva-icon-green;
		text-decoration: none;
		text-align: center;
		line-height: 1.25;
		vertical-align: bottom;
	}

	.banner-link {
		&:hover,
		&:active {
			color: $kiva-darkgreen;

			[class*="-icon"] {
				fill: $kiva-darkgreen;
			}

			.icon-corporate,
			.icon-iwd {
				fill: inherit;
			}
		}
	}
}
</style>
