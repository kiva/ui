<template>
	<www-page
		id="confirm-instant-donation"
		main-class="kv-tailwind"
	>
		<kv-page-container
			class="
			tw-pt-4 tw-pb-8
			md:tw-pt-6 md:tw-pb-12
			lg:tw-pt-8 lg:tw-pb-16"
		>
			<kv-grid class="tw-grid-cols-12">
				<div
					class="
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
					<div
						v-if="userConfirmation"
						class="data-hj-suppress tw-pb-2 tw-prose"
						v-html="userConfirmation"
					></div>
					<div v-if="bodyCopy" class="tw-pb-8 tw-prose" v-html="bodyCopy"></div>
					<div v-if="contentfulCta && contentfulCta.linkText" class="tw-text-right">
						<kv-button
							:href="contentfulCta.href"
							v-kv-track-event="contentfulCta.analytics"
							class="tw-mb-2"
						>
							{{ contentfulCta.linkText }}
						</kv-button>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import { gql } from '@apollo/client';
import { formatContentGroupsFlat } from '@/util/contentfulUtils';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const contentfulContentQuery = gql`query instantDonationThanksContent {
	contentful {
		entries(contentKey:"instant-donation-thanks-cg", contentType: "contentGroup")
	}
}`;

export default {
	name: 'InstantDonationThanks',
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		return {
			title: 'Thanks for your donation!'
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
		result: {
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
		resultData() {
			const resultDecoded = this.result ? atob(this.result) : '';
			const resultArray = resultDecoded.split('|');
			return {
				amount: resultArray?.[0],
				user: resultArray?.[1],
				transactionId: resultArray?.[2],
			};
		},
		contentfulCta() {
			return {
				analtyics: this.genericContentBlock.primaryCtaKvTrackEvent ?? [],
				href: this.genericContentBlock.primaryCtaLink ?? '#',
				linkText: this.genericContentBlock.primaryCtaText ?? null,
			};
		},
		genericContentBlock() {
			return this.contentfulContent?.instantDonationThanksCg?.contents?.[0] ?? {};
		},
		headline() {
			return this.genericContentBlock?.headline ?? 'You\'re the best!';
		},
		mediaProperties() {
			const media = this.contentfulContent?.instantDonationThanksCg?.media?.[0] ?? {};
			return {
				description: media?.description ?? '',
				title: media?.title ?? '',
				width: media?.file?.details?.image?.width ?? null,
				height: media?.file?.details?.image?.height ?? null,
				url: media?.file?.url ?? null
			};
		},
		bodyCopy() {
			const defaultContent = `Every $25 Kiva loan costs us at least $3 to distribute, so your donations
				are essential to our operations. Your donations also help us build innovative solutions
				for financial inclusion around the world.`;
			const contentfulRichText = this.genericContentBlock?.bodyCopy ?? null;
			const bodyCopy = contentfulRichText ? richTextRenderer(contentfulRichText) : defaultContent;
			return bodyCopy;
		},
		subHeadline() {
			return this.genericContentBlock.subHeadline ?? 'Thanks for supporting our work at Kiva.';
		},
		userConfirmation() {
			const userId = this.resultData?.user ?? null;
			if (userId) {
				return `We've emailed your donation details to ${userId}.`;
			}
			return 'Please check your email for a donation receipt.';
		}
	}
};
</script>
