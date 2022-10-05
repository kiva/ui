<template>
	<div class="donate-right-col tw-border tw-border-tertiary tw-rounded row">
		<div class="donate-right-col__meter small-12 medium-5 large-12 columns" v-if="showMeter">
			<donation-meter :content="progressMeterEntry" />
		</div>
		<div class="donate-right-col__callouts small-12 medium-7 large-12 columns">
			<ul>
				<li v-for="(callout, index) in donationCallouts" :key="index">
					<kv-contentful-img
						v-if="callout.imageUrl"
						class="donate-right-col__callouts--icon"
						style="width: 10rem;"
						:contentful-src="callout.imageUrl"
						:alt="callout.imageTitle"
						fallback-format="png"
						:width="65"
						:height="65"
					/>
					<div class="donate-right-col__callouts--copy">
						<h3 class="donate-right-col__callouts--header tw-mb-1">
							{{ callout.title }}
						</h3>
						<div class="donate-right-col__callouts--subhead" v-html="callout.subHead"></div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import DonationMeter from '@/pages/Donate/DonationMeter';
import { settingEnabled } from '@/util/settingsUtils';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	name: 'DonateSupportUsRightRail',
	components: {
		DonationMeter,
		KvContentfulImg,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		content: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {};
	},
	computed: {
		donationCallouts() {
			const callouts = [];
			const textEntries = this.content?.contents?.filter(
				item => item.contentType === 'richTextContent'
			) || [];
			const mediaEntries = this.content?.media ?? [];

			textEntries.forEach((entry, index) => {
				callouts.push({
					title: entry?.name || '',
					subHead: documentToHtmlString(entry?.richText) || '',
					imageTitle: mediaEntries[index]?.title || '',
					imageUrl: mediaEntries[index]?.file?.url || '',
				});
			});

			return callouts;
		},
		progressMeterEntry() {
			return this.content.contents?.find(item => item.name === 'Progress Meter Image') || {};
		},
		showMeter() {
			const showMeterSetting = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'uiSetting' : false;
			});
			if (showMeterSetting) {
				return settingEnabled(showMeterSetting, 'active', 'startDate', 'endDate');
			}
			return false;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.donate-right-col {
	padding: rem-calc(40) 1rem 1rem;
	margin: 0;

	&__meter {
		margin-bottom: rem-calc(40);

		@include breakpoint('medium') {
			padding-left: 0;
		}

		@include breakpoint('large') {
			padding-left: inherit;
		}
	}

	&__callouts {
		ul {
			margin: 0 auto;
			padding: 0;
			list-style-type: none;

			li {
				display: block;
				margin: 0 auto rem-calc(32);
				text-align: center;

				@include breakpoint('medium') {
					display: flex;
					text-align: left;
				}
			}
		}
	}

	&__callouts--header {
		text-transform: inherit;
	}

	&__callouts--icon {
		display: block;
		margin-bottom: 0.75rem;

		@include breakpoint('medium') {
			margin-right: 1rem;
		}
	}
}
</style>
