<template>
	<www-page
		id="confirm-instant-donation"
		:header-theme="lightHeader"
		main-class="kv-tailwind"
	>
		<kv-page-container class="
			tw-pt-4 tw-pb-8
			md:tw-pt-6 md:tw-pb-12
			lg:tw-pt-8 lg:tw-pb-16"
		>
			<kv-grid class="tw-grid-cols-12">
				<div class="
					tw-col-span-12
					md:tw-col-start-3 md:tw-col-span-8
					lg:tw-col-start-4 lg:tw-col-span-6"
				>
					<div class="tw-text-center tw-m-0 tw-pb-2">
						<kv-contentful-img
							v-if="mediaProperties.url"
							class=""
							:contentful-src="mediaProperties.url"
							:width="mediaProperties.width"
							:height="mediaProperties.height"
							fallback-format="jpg"
							:alt="mediaProperties.description || mediaProperties.title"
						/>
					</div>
					<h1
						v-if="headline"
						class="tw-text-h2 tw-pb-4 tw-text-center"
						v-html="headline"
					></h1>
					<h3 v-if="subHeadline" class="tw-pb-2 tw-text-center" v-html="subHeadline"></h3>
					<div v-if="bodyCopy" class="tw-text-secondary tw-pb-2 tw-prose" v-html="bodyCopy"></div>
					<hr class="tw-border-tertiary">
					<dl class="tw-pb-2.5">
						<div class="tw-flex tw-justify-between tw-pt-2.5">
							<dt class="tw-flex-1 tw-text-base">
								Donation to Kiva
							</dt>
							<dd>
								{{ amount | numeral('$0.00') }}
							</dd>
						</div>

						<div class="tw-flex tw-justify-between tw-pt-2.5">
							<dt class="tw-flex-1 tw-text-base">
								Kiva credit used
							</dt>
							<dd class="">
								- {{ amount | numeral('$0.00') }}
							</dd>
						</div>
					</dl>
					<hr class="tw-border-tertiary">
					<dl class="tw-pb-8">
						<div class="tw-flex tw-justify-between tw-pt-3.5">
							<dt class="tw-text-h3 tw-flex-1">
								Total payment:
							</dt>
							<dd class="tw-text-h3">
								$0.00
							</dd>
						</div>
					</dl>
				</div>
			</kv-grid>
			<kv-grid class="tw-grid-cols-12">
				<div class="
					tw-col-span-12
					md:tw-col-start-7 md:tw-col-span-4
					lg:tw-col-start-7 lg:tw-col-span-3"
				>
					<div class="tw-text-center">
						<kv-button
							:href="confirmationLink"
							v-kv-track-event="[
								'InstantDonate',
								'click-instant-donate-confirmation',
								'Confirm donation'
							]"
							class="tw-mb-2 tw-w-full"
						>
							Confirm donation
						</kv-button>
						<kv-button
							class="tw-w-full"
							variant="ghost"
							href="/donate/supportus?instantDonation=choose-another-amount"
							v-kv-track-event="[
								'InstantDonate',
								'click-instant-donate-decline',
								'Choose another amount'
							]"
						>
							Choose another amount
						</kv-button>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import { formatContentGroupsFlat } from '@/util/contentfulUtils';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import { lightHeader } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const contentfulContentQuery = gql`query confirmDonationContent {
	contentful {
		entries(contentKey:"confirm-instant-donation-cg", contentType: "contentGroup")
	}
}`;

export default {
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		return {
			title: 'Confirm your donation'
		};
	},
	components: {
		KvButton,
		KvContentfulImg,
		KvGrid,
		KvPageContainer,
		WwwPage,
	},
	props: {
		amount: {
			type: String,
			default: '0'
		},
		token: {
			type: String,
			default: null
		},
	},
	data() {
		return {
			lightHeader,
			contentfulContent: null,
		};
	},
	apollo: {
		query: contentfulContentQuery,
		preFetch: true,
		result({ data }) {
			const contentfulData = data?.contentful?.entries?.items ?? null;
			this.contentfulContent = contentfulData ? formatContentGroupsFlat(contentfulData) : {};
		}
	},
	computed: {
		confirmationLink() {
			if (!this.token || this.amount === '0') {
				return '/donate/supportus?instantDonation=missing-parameters';
			}
			return `/oneclick/donateAmount/${this.token}/${this.amount}`;
		},
		genericContentBlock() {
			return this.contentfulContent?.confirmInstantDonationCg?.contents?.[0] ?? {};
		},
		headline() {
			return this.genericContentBlock?.headline ?? 'Donation Summary';
		},
		mediaProperties() {
			const media = this.contentfulContent?.confirmInstantDonationCg?.media?.[0] ?? {};
			return {
				description: media?.description ?? '',
				title: media?.title ?? '',
				width: media?.file?.details?.image?.width ?? null,
				height: media?.file?.details?.image?.height ?? null,
				url: media?.file?.url ?? null
			};
		},
		bodyCopy() {
			const defaultContent = `By selecting "Confirm donation", you're donating to Kiva's
						operating expenses using existing credit from your Kiva account.`;
			const contentfulRichText = this.genericContentBlock?.bodyCopy ?? null;
			const bodyCopy = contentfulRichText ? richTextRenderer(contentfulRichText) : defaultContent;
			return bodyCopy;
		},
		subHeadline() {
			return this.genericContentBlock.subHeadline ?? '';
		},
	}
};
</script>
