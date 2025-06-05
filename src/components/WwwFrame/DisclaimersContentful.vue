<template>
	<div>
		<ol id="disclaimers" class="tw-text-small tw-list-decimal tw-list-outside">
			<li
				v-for="(disclaimer, index) in fullyBuiltDisclaimerText"
				:key="index"
				v-html="disclaimer"
			>
			</li>
		</ol>
	</div>
</template>

<script>
import {
	bannerQuery,
	activePromoBanner,
	inactivePromoBanners,
} from '#src/util/globalPromoBanner';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export default {
	name: 'DisclaimersContentful',
	data() {
		return {
			activePromoBanner: null,
			inactivePromoBanners: [],
		};
	},
	inject: {
		apollo: { default: null },
		cookieStore: { default: null },
	},
	apollo: {
		query: bannerQuery,
		preFetch: true,
		result({ data }) {
			this.activePromoBanner = activePromoBanner(data);
			this.inactivePromoBanners = inactivePromoBanners(data);
		}
	},
	computed: {
		disclaimerContent() {
			const content = [];
			if (this.activePromoBanner) {
				// set the disclaimer text if it exists in active promo banner
				const activeDisclaimerText = this.activePromoBanner.fields.disclaimers ?? null;
				if (activeDisclaimerText) {
					content.push(documentToHtmlString(activeDisclaimerText));
				}
			}
			// go through the inactive promoBanners, and add them if disclaimer text exists
			if (this.inactivePromoBanners?.length > 0) {
				this.inactivePromoBanners.forEach(banner => {
					const disclaimerText = banner?.fields?.disclaimers ?? null;
					if (disclaimerText) {
						content.push(documentToHtmlString(disclaimerText));
					}
				});
			}
			return content;
		},
		// constructing the final form of the disclaimer text for display
		fullyBuiltDisclaimerText() {
			// prepend 'Disclaimer: ' to each disclaimer text
			const builtDisclaimertext = [];
			this.disclaimerContent.forEach(disclaimer => {
				const prependDisclaimer = disclaimer.replace('<p>', '<p>Disclaimer: ');
				builtDisclaimertext.push(prependDisclaimer);
			});
			return builtDisclaimertext;
		},
	},
};
</script>
