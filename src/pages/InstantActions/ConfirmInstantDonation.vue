<template>
	<www-page
		id="confirm-instant-donation"
		main-class="kv-tailwind"
	>
		<kv-page-container class="tw-pt-5 tw-pb-8">
			<div class="tw-w-full tw-mx-auto md:tw-w-3/4 lg:tw-w-1/2">
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
					class="tw-text-h2 tw-mb-2"
					v-html="headline"
				></h1>
				<h2 v-if="subHeadline" class="tw-text-h3 tw-mb-2" v-html="subHeadline"></h2>
				<div v-if="bodyCopy" class="tw-mb-2 tw-prose" v-html="bodyCopy"></div>
				<hr class="tw-border-tertiary">
				<dl class="tw-mb-2">
					<div class="tw-flex tw-justify-between tw-mt-2">
						<dt class="tw-flex-1 tw-text-base">
							Donation to Kiva
						</dt>
						<dd>
							{{ amount | numeral('$0.00') }}
						</dd>
					</div>

					<div class="tw-flex tw-justify-between tw-mt-2">
						<dt class="tw-flex-1 tw-text-base">
							Kiva credit used
						</dt>
						<dd class="">
							- {{ amount | numeral('$0.00') }}
						</dd>
					</div>
				</dl>
				<hr class="tw-border-tertiary">
				<dl class="tw-mb-3">
					<div class="tw-flex tw-justify-between tw-mt-2.5">
						<dt class="tw-text-h3 tw-flex-1">
							Total payment:
						</dt>
						<dd class="tw-text-h3">
							$0.00
						</dd>
					</div>
				</dl>
				<div class="tw-text-center">
					<kv-button
						v-if="!missingRequiredParams"
						:href="confirmationLink"
						v-kv-track-event="[
							'InstantDonate',
							'click-instant-donate-confirmation',
							'Confirm donation'
						]"
						class="tw-mb-1 tw-w-full"
					>
						Confirm donation
					</kv-button>
					<kv-button
						v-else
						href="/donate/supportus?instantDonation=missing-parameters"
						v-kv-track-event="[
							'InstantDonate',
							'click-instant-donate-missing-params-link',
							'Choose another amount'
						]"
						class="tw-mb-2 tw-w-full"
					>
						Choose another amount
					</kv-button>
					<kv-button
						v-if="!missingRequiredParams"
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
		</kv-page-container>
	</www-page>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import { formatContentGroupsFlat } from '@/util/contentfulUtils';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const contentfulContentQuery = gql`query confirmDonationContent {
	contentful {
		entries(contentKey:"confirm-instant-donation-cg", contentType: "contentGroup")
	}
}`;

export default {
	name: 'ConfirmInstantDonation',
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		return {
			title: 'Complete your donation'
		};
	},
	components: {
		KvButton,
		KvContentfulImg,
		KvPageContainer,
		WwwPage,
	},
	props: {
		amount: {
			type: String,
			default: '0.00'
		},
		token: {
			type: String,
			default: null
		},
	},
	data() {
		return {
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
			return `/oneclick/donateAmount/${this.token}/${this.formattedAmount}`;
		},
		formattedAmount() {
			return numeral(this.amount).format('0.00');
		},
		genericContentBlock() {
			return this.contentfulContent?.confirmInstantDonationCg?.contents?.[0] ?? {};
		},
		headline() {
			return this.genericContentBlock?.headline ?? 'Complete your donation';
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
		missingRequiredParams() {
			return (!this.token || this.formattedAmount === '0.00');
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
