<template>
	<div class="row align-center generic-banner">
		<component
			:is="currentWrapperComponent"
			:to="trimmedLink"
			:href="trimmedLink"
			:target="isExternalLink ? '_blank' : '_self'"
			:class="{ 'banner-link' : trimmedLink, 'banner-wrapper' : !trimmedLink}"
			v-kv-track-event="handleTracking"
		>
			<kv-icon :name="iconKey" :class="`${iconKey}-icon icon`" />
			<div class="content" v-html="promoBannerContent.richText">
			</div>
		</component>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
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
				};
			}
		},
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
		trimmedLink() {
			return this.promoBannerContent?.link?.trim() ?? '';
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

.content {
	text-align: center;
	display: block;
	// contentful rich text content is wrapped in a p tag, this removes all styles from it
	::v-deep p {
		display: inline;
		margin: 0;
		padding: 0;
	}
}

.generic-banner {
	background-image: url('~@/assets/images/backgrounds/tipbar-bg-small.jpg');
	background-position: bottom;

	.icon {
		flex-shrink: 0;
	}

	& [class*="-icon"] {
		display: block;
		height: rem-calc(22);
		width: rem-calc(22);
		margin-right: rem-calc(10);
		margin-top: -0.2rem;
		fill: $kiva-icon-green;
	}

	.icon-corporate,
	.icon-iwd {
		fill: inherit;
	}

	.banner-link,
	.banner-wrapper {
		display: flex;
		align-items: center;
		color: $kiva-icon-green;
		text-decoration: none;
		text-align: center;
		padding: 0.365rem;
		line-height: 1.25;
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
