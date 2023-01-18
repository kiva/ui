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

					<h1
						v-if="headline"
						class="tw-text-h2 tw-mb-2 tw-text-center"
						v-html="headline"
					></h1>
					<h3 v-if="subHeadline" class="tw-mb-2 tw-text-center" v-html="subHeadline"></h3>
					<div v-if="bodyCopy" class="tw-mb-5 tw-text-center tw-prose" v-html="bodyCopy"></div>

					<div class="tw-flex tw-justify-center tw-mb-5">
						<kv-loading-spinner />
						<br>
						<div v-if="contentfulCta && contentfulCta.linkText" class="tw-mt-2 tw-text-right">
							<kv-button
								:href="contentfulCta.href"
								v-kv-track-event="contentfulCta.analytics"
								class="tw-mb-2"
							>
								{{ contentfulCta.linkText }}
							</kv-button>
						</div>
					</div>

					<div
						v-if="loan && imageHash"
						class="tw-relative tw-flex tw-mx-auto tw-mb-8"
						style="max-width: 26rem;"
					>
						<borrower-image
							class="
							tw-relative
							tw-w-full
							tw-bg-black
							tw-rounded
						"
							:alt="'photo of ' + loan.name"
							:aspect-ratio="3 / 4"
							:default-image="{ width: 336 }"
							:hash="imageHash"
							:images="[
								{ width: 416, viewSize: 480 },
								{ width: 335, viewSize: 375 },
								{ width: 280 },
							]"
						/>
						<div v-if="countryName">
							<summary-tag
								class="tw-absolute tw-bottom-1 tw-left-1 tw-text-primary"
								:city="city"
								:state="state"
								:country-name="countryName"
							>
								<kv-material-icon
									class="tw-h-2.5 tw-w-2.5 tw-mr-0.5"
									:icon="mdiMapMarker"
								/>
								{{ formattedLocation }}
							</summary-tag>
						</div>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import { mdiMapMarker } from '@mdi/js';
import { gql } from '@apollo/client';
import numeral from 'numeral';
import * as Sentry from '@sentry/vue';
import logFormatter from '@/util/logFormatter';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import { formatContentGroupsFlat } from '@/util/contentfulUtils';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import WwwPage from '@/components/WwwFrame/WwwPage';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import SummaryTag from '@/components/BorrowerProfile/SummaryTag';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvLoadingSpinner from '~/@kiva/kv-components/vue/KvLoadingSpinner';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const processInstantLendingContent = gql`query instantLendingContent($loanId: Int!) {
	contentful {
		entries(contentKey:"process-instant-lending-cg", contentType: "contentGroup")
	}
	lend {
		loan(id: $loanId) {
			id
			geocode {
				city
				state
				country {
					name
				}
			}
			image {
				id
				hash
			}
			loanAmount
			loanFundraisingInfo {
				fundedAmount
				reservedAmount
				isExpiringSoon
			}
			name
			status
		}
	}
}`;

export default {
	name: 'ProcessInstantLending',
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		return {
			title: 'Instant Lending: Adding loan to basket.'
		};
	},
	components: {
		BorrowerImage,
		KvButton,
		KvGrid,
		KvContentfulImg,
		KvLoadingSpinner,
		KvMaterialIcon,
		KvPageContainer,
		SummaryTag,
		WwwPage
	},
	props: {
		errorType: {
			type: String,
			default: ''
		},
		loanId: {
			type: Number,
			default: 0
		},
		lendAmount: {
			type: Number,
			default: 25
		},
	},
	data() {
		return {
			loading: false,
			loan: () => {},
			loanAdded: false,
			mdiMapMarker,
			showError: false
		};
	},
	apollo: {
		query: processInstantLendingContent,
		preFetch: true,
		preFetchVariables({ route }) {
			return { loanId: parseInt(route.params.loanId, 10) };
		},
		variables() {
			return { loanId: parseInt(this.$route.params.loanId, 10) };
		},
		result({ data }) {
			const contentfulData = data?.contentful?.entries?.items ?? null;
			this.contentfulContent = contentfulData ? formatContentGroupsFlat(contentfulData) : {};
			this.loan = data?.lend?.loan ?? {};
		}
	},
	computed: {
		bodyCopy() {
			const defaultContent = 'We\'re getting you ready to checkout now!';
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
		countryName() {
			return this.loan?.geocode?.country?.name || '';
		},
		city() {
			return this.loan?.geocode?.city || '';
		},
		formattedLocation() {
			if (this.distributionModel === 'direct') {
				const formattedString = `${this.city}, ${this.state}, ${this.countryName}`;
				return formattedString;
			}
			if (this.countryName === 'Puerto Rico') {
				const formattedString = `${this.city}, PR`;
				return formattedString;
			}
			return this.countryName;
		},
		genericContentBlock() {
			return this.contentfulContent?.processInstantLendingCg?.contents?.[0] ?? {};
		},
		headline() {
			// default headline
			let headlineCopy = 'Adding loan to basket';
			// Patch in contentful + loan name if available
			if (this.loan && this.loan.name) {
				headlineCopy = `${this.genericContentBlock?.headline} ${this.loan.name}`;
			}
			return headlineCopy;
		},
		imageHash() {
			return this.loan?.image?.hash ?? '';
		},
		loanNotFound() {
			return this.errorType === 'loan-not-found';
		},
		mediaProperties() {
			const media = this.contentfulContent?.processInstantLendingCg?.media?.[0] ?? {};
			return {
				description: media?.description ?? '',
				title: media?.title ?? '',
				width: media?.file?.details?.image?.width ?? null,
				height: media?.file?.details?.image?.height ?? null,
				url: media?.file?.url ?? null
			};
		},
		state() {
			return this.loan?.geocode?.state || '';
		},
		subHeadline() {
			return this.genericContentBlock.subHeadline ?? null;
		},
		tokenValidationFailed() {
			return this.errorType === 'token-validation-failed';
		}
	},
	methods: {
		addToBasket() {
			this.loading = true;
			this.apollo.mutate({
				mutation: updateLoanReservation,
				variables: {
					loanid: this.loanId,
					price: numeral(this.lendAmount).format('0.00'),
				},
			}).then(({ errors }) => {
				if (typeof errors !== 'undefined' && errors.length) {
					// Handle errors from adding to basket
					errors.forEach(error => {
						logFormatter(error, 'error');
						try {
							this.$kvTrackEvent(
								'Instant Lending',
								'Add-to-Basket',
								`Failed: ${error.message.substring(0, 40)}...`
							);
							Sentry.captureMessage(`Add to Basket: ${error.message}`);
						} catch (e) {
							// no-op
						}
						// Set error state
						this.showError = true;
						this.handleErrorRedirect();
					});
				} else {
					try {
						// track facebook add to basket
						if (typeof window !== 'undefined' && typeof fbq === 'function') {
							window.fbq('track', 'AddToCart', { content_category: 'Loan' });
						}
					} catch (e) {
						// no-op
					}
					// signify loan added to basket
					this.loanAdded = true;
					// start redirect process
					this.handleRedirect();
				}
			}).catch(error => {
				console.log(error);
				logFormatter(error, 'error');
				this.$kvTrackEvent('Instant Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');

				// Set error state
				this.showError = true;

				Sentry.captureException(error);
				this.handleErrorRedirect();
			}).finally(() => {
				this.loading = false;
			});
		},
		handleRedirect() {
			// redirect to checkout
			this.$router.push({ path: '/checkout', query: { instantLending: 'loan-added' } });
		},
		handleErrorRedirect() {
			// redirect to error page
			this.$router.push({ path: '/instant-lending-error', query: { instantLending: 'failed-to-add-loan' } });
		}
	},
	mounted() {
		// check for loan id, attempt to add to basket
		if (this.loanId !== 0) {
			this.addToBasket();
		}

		// start timer for redirecting to checkout or error state
		const redirectInterval = setInterval(() => {
			if (this.loanAdded) {
				clearInterval(redirectInterval);
				this.handleRedirect();
			} else if (this.showError) {
				clearInterval(redirectInterval);
				this.handleErrorRedirect();
			}
		}, 5500);
	},
};
</script>
