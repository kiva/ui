<template>
	<www-page
		id="instant-lending-processor"
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
					<div>
						<h1
							v-if="headline"
							class="tw-text-h2 tw-mb-2 tw-text-center"
							v-html="headline"
						></h1>
						<h3 v-if="subHeadline" class="tw-mb-2 tw-text-center" v-html="subHeadline"></h3>
						<div v-if="bodyCopy" class="tw-mb-5 tw-prose" v-html="bodyCopy"></div>

						<div v-if="contentfulCta && contentfulCta.linkText" class="tw-flex tw-justify-center tw-mb-5">
							<kv-button
								:href="contentfulCta.href"
								v-kv-track-event="contentfulCta.analytics"
								class="tw-mb-2 tw-w-full md:tw-w-auto"
							>
								{{ contentfulCta.linkText }}
							</kv-button>
						</div>
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
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const instantLendingErrorContent = gql`query instantLendingContent {
	contentful {
		entries(contentKey:"instant-lending-loan-error-cg", contentType: "contentGroup")
	}
}`;

export default {
	name: 'InstantLendingError',
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		return {
			title: 'Instant Lending Error'
		};
	},
	components: {
		KvButton,
		KvContentfulImg,
		KvGrid,
		KvPageContainer,
		WwwPage
	},
	apollo: {
		query: instantLendingErrorContent,
		preFetch: true,
		result({ data }) {
			const contentfulData = data?.contentful?.entries?.items ?? null;
			this.contentfulContent = contentfulData ? formatContentGroupsFlat(contentfulData) : {};
			this.loan = data?.lend?.loan ?? {};
		}
	},
	computed: {
		bodyCopy() {
			const defaultContent = 'It looks like this loan isn\'t available anymore.';
			const contentfulRichText = this.genericContentBlock?.bodyCopy ?? null;
			const bodyCopy = contentfulRichText ? richTextRenderer(contentfulRichText) : defaultContent;
			return bodyCopy;
		},
		contentfulCta() {
			return {
				analtyics: this.genericContentBlock.primaryCtaKvTrackEvent ?? [],
				href: this.genericContentBlock.primaryCtaLink ?? '#',
				linkText: this.genericContentBlock.primaryCtaText ?? null,
			};
		},
		errorType() {
			return this.$route?.query?.instantLending ?? null;
		},
		genericContentBlock() {
			return this.contentfulContent?.instantLendingLoanErrorCg?.contents?.[0] ?? {};
		},
		headline() {
			const contentfulHeadline = this.genericContentBlock?.headline ?? 'Oops!';
			return contentfulHeadline;
		},
		loanFunded() {
			return this.errorType?.indexOf('loan-funded') !== -1;
		},
		loanNotFound() {
			return this.errorType?.indexOf('missing-loanid') !== -1
			|| this.errorType?.indexOf('failed-to-add-loan') !== -1;
		},
		mediaProperties() {
			const media = this.contentfulContent?.instantLendingLoanErrorCg?.media?.[0] ?? {};
			return {
				description: media?.description ?? '',
				title: media?.title ?? '',
				width: media?.file?.details?.image?.width ?? null,
				height: media?.file?.details?.image?.height ?? null,
				url: media?.file?.url ?? null
			};
		},
		subHeadline() {
			return this.genericContentBlock.subHeadline ?? null;
		},
		tokenValidationFailed() {
			return this.errorType?.indexOf('validation-failed') !== -1;
		}
	}
};
</script>
