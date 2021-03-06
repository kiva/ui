<template>
	<div class="donate-right-col row">
		<div class="donate-right-col__meter small-12 medium-5 large-12 columns" v-if="showMeter">
			<donation-meter :content="progressMeterEntry" />
		</div>
		<div class="donate-right-col__callouts small-12 medium-7 large-12 columns">
			<ul>
				<li v-for="(callout, index) in donationCallouts" :key="index">
					<kv-contentful-img
						v-if="callout.imageUrl"
						class="donate-right-col__callouts--icon"
						:contentful-src="callout.imageUrl"
						:alt="callout.imageTitle"
						fallback-format="png"
						:width="49"
						:height="48"
					/>
					<div class="donate-right-col__callouts--copy">
						<h4 class="donate-right-col__callouts--header">
							{{ callout.title }}
						</h4>
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

			const makeLoansHappenCopy = this.content?.contents?.find(
				item => item.key === 'web-donate-support-us-callout-1'
			) || {};
			const makeLoansHappenImage = this.content?.media?.find(
				image => image.title === 'homepage-stats-icon-1'
			);
			callouts.push({
				title: makeLoansHappenCopy.name || '',
				subHead: documentToHtmlString(makeLoansHappenCopy.richText) || '',
				imageTitle: makeLoansHappenImage.title || '',
				imageUrl: makeLoansHappenImage.file?.url || '',
			});

			const fundInnovationCopy = this.content?.contents?.find(
				item => item.key === 'web-donate-support-us-callout-2'
			) || {};
			const fundInnovationImage = this.content?.media?.find(
				image => image.title === 'Globe Grid Illustration'
			);
			callouts.push({
				title: fundInnovationCopy.name || '',
				subHead: documentToHtmlString(fundInnovationCopy.richText) || '',
				imageTitle: fundInnovationImage.title || '',
				imageUrl: fundInnovationImage.file?.url || '',
			});

			return callouts;
		},
		progressMeterEntry() {
			return this.content.contents?.find(item => item.name === 'Progress Meter Image') || {};
		},
		showMeter() {
			const showMeterSetting = this.content?.contents?.find(
				item => item.key === 'web-donate-support-us-show-donation-meter'
			);
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
	border-radius: 1rem;
	border: 1px solid #C4C4C4;

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
				max-width: rem-calc(225);
				text-align: center;

				@include breakpoint('medium') {
					display: flex;
					text-align: left;
					max-width: rem-calc(275);
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
			min-width: rem-calc(48);
			margin-right: 1rem;
		}
	}
}
</style>
