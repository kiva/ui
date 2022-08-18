<template>
	<div>
		<div class="message-content">
			<div class="row">
				<div class="thanks__header-h1 tw-text-left large-3 small-1">
					<kv-material-icon
						class="tw-w-3 tw-h-3 tw-my-3 tw-align-middle tw-mr-0.5 message-content__success"
						:icon="mdiCheckAll"
					/>
				</div>
				<div v-if="receipt" class="large-9 small-11 message-content__text">
					<div v-if="isGuest">
						<div>Success, we've emailed your receipt to you.</div>
					</div>
					<div v-else>
						<!-- eslint-disable-next-line max-len -->
						<div>Success, your receipt has been sent to <strong class="fs-mask">{{ lender.email }}</strong></div>
					</div>
				</div>
			</div>
		</div>
		<div class="row page-content">
			<div class="large-2"></div>
			<div class="small-12 large-8 columns thanks">
				<div class="thanks__header hide-for-print">
					<template v-if="receipt">
						<borrower-image
							class="
								tw-w-full
								tw-bg-black
								tw-rounded
								tw--mb-1.5
								md:tw--mb-1
							"
							data-testid="bp-story-borrower-image"
							:alt="loan.name"
							:aspect-ratio="1 / 2"
							:default-image="{ width: 612 }"
							:hash="loan.image.hash"
							:images="[
								{ width: 612, viewSize: 1024 },
								{ width: 580, viewSize: 768 },
								{ width: 416, viewSize: 480 },
								{ width: 374, viewSize: 414 },
								{ width: 335, viewSize: 375 },
								{ width: 280 },
							]"
						/>
						<div class="tw-flex-auto tw-mb-2">
							<figure>
								<figcaption class="tw-flex progress">
									<template>
										<div class="tw-flex-auto tw-text-left">
											<p
												class="tw-text-h3 tw-m-0 progress__to-go"
												data-testid="bp-summary-amount-to-go"
											>
												{{ loan.unreservedAmount | numeral('$0,0[.]00') }} TO GO
											</p>
										</div>
										<p
											class="tw-flex-auto tw-text-right progress__days-remaining"
											data-testid="bp-summary-timeleft"
										>
											<span lass="tw-text-h3 tw-block tw-m-0">
												{{ loan.fundraisingTimeLeft }} remaining
											</span>
										</p>
									</template>
								</figcaption>
								<kv-progress-bar
									class="tw-mb-1.5 lg:tw-mb-1 tw-bg-tertiary"
									aria-label="Percent the loan has funded"
									:value="loan.fundraisingPercent * 100"
								/>
							</figure>
						</div>
					</template>
					<template v-if="shareAskCopyVersion === null || shareAskCopyVersion === 'a'">
						<h1	class="thanks__headline-h1 tw-mt-1 tw-mb-3 tw-text-left">
							Get a $25 lending credit by inspiring others.
						</h1>
						<p class="tw-text-h3 tw-m-0 thanks__base-text">
							<!-- eslint-disable-next-line max-len -->
							Introduce someone new to Kiva and we'll give you $25 to support another borrower. Your Kiva Lending Credit will be applied automatically.
						</p>
					</template>
					<template v-else>
						<h1	class="thanks__headline-h1 tw-mt-1 tw-mb-3 tw-text-left">
							<!-- eslint-disable-next-line max-len -->
							<span class="fs-mask">{{ this.lender.firstName }}</span>, can you share this loan with one more person?
						</h1>
						<p class="tw-text-h3 tw-m-0 thanks__base-text">
							<!-- eslint-disable-next-line max-len -->
							<span class="fs-mask">{{ this.loan.name }}</span> only needs {{ calculatePeopleQtyToGoal() }} more people to lend $25 and their loan could be fully funded in a matter of hours!
						</p>
					</template>
					<template>
						<div class="row btn-container">
							<div class="large-2"></div>
							<div class="small-12 large-8 columns">
								<div class="share__social social">
									<a
										data-testid="share-facebook-button"
										class="social__btn social__btn--facebook"
										:href="facebookShareUrl"
										v-kv-track-event="['thanks', 'Social-Share-Lightbox', 'click-Facebook-share']"
									>
										<kv-icon name="facebook-round" title="Facebook" class="social__icon" />
										<span>Share on Facebook</span>
									</a>
									<button
										data-testid="share-copy-link-button"
										class="social__btn social__btn--link tw-text-link tw-border-tertiary tw-border"
										:class="copyStatus.class"
										:disabled="copyStatus.disabled"
										v-kv-track-event="['thanks', 'Social-Share-Lightbox', 'click-Copy-link-share']"
										@click="copyLink"
									>
										<kv-material-icon
											name="clipboard"
											class="social__icon"
											:icon="mdiLink"
										/>
										<span>{{ this.copyStatus.text }}</span>
									</button>
									<a
										data-testid="share-twitter-button"
										class="social__btn social__btn--twitter"
										:href="twitterShareUrl"
										target="_blank"
										rel="noopener"
										v-kv-track-event="['thanks', 'Social-Share-Lightbox', 'click-Twitter-share']"
										@click="$showTipMsg('Thanks for tweeting!')"
									>
										<kv-icon name="twitter" title="Twitter" class="social__icon" />
										<span>Tweet your followers</span>
									</a>
									<a
										data-testid="share-linkedin-button"
										class="social__btn social__btn--linkedin"
										:href="linkedInShareUrl"
										target="_blank"
										rel="noopener"
										v-kv-track-event="['thanks', 'Social-Share-Lightbox', 'click-LinkedIn-share']"
										@click="$showTipMsg('Thanks for sharing to LinkedIn!')"
									>
										<kv-icon name="linkedin" title="LinkedIn" class="social__icon" />
										<span>Share on LinkedIn</span>
									</a>
								</div>
							</div>
							<div class="large-2"></div>
						</div>
						<div class="continue-link">
							<router-link
								to="/portfolio"
								v-kv-track-event="['Thanks','click-portfolio-cta','No, continue to my portfolio']"
							>
								No, continue to my portfolio
							</router-link>
						</div>
					</template>
				</div>
			</div>
			<div class="large-2"></div>
		</div>
	</div>
</template>

<script>
import clipboardCopy from 'clipboard-copy';
import { mdiCheckAll, mdiLink } from '@mdi/js';
import { getFullUrl } from '@/util/urlUtils';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import KvIcon from '@/components/Kv/KvIcon';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

const imageRequire = require.context('@/assets/images/kiva-classic-illustrations/', true);

export default {
	name: 'ThanksPageShare',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvMaterialIcon,
		BorrowerImage,
		KvProgressBar,
		KvIcon,
	},
	props: {
		receipt: {
			type: Object,
			default: () => ({}),
		},
		lender: {
			type: Object,
			default: () => ({}),
		},
		loan: {
			type: Object,
			default: () => ({}),
		},
		simpleSocialShareVersion: {
			type: String,
			default: ''
		},
		shareCardLanguageVersion: {
			type: String,
			default: ''
		},
		shareAskCopyVersion: {
			type: String,
			default: 'a'
		},
	},
	metaInfo() {
		return {
			title: 'Thank you!'
		};
	},
	data() {
		return {
			imageRequire,
			isGuest: false,
			mdiCheckAll,
			mdiLink,
			message: '',
			copyStatus: {
				class: '',
				disabled: false,
				text: 'Copy Link'
			},
		};
	},
	computed: {
		suggestedMessage() {
			if (this.loan.name) {
				const location = this.loan?.geocode?.city || this.loan?.geocode?.country?.name;
				return `Kiva is an easy way to make a real difference in someone's life. Will you join me in helping ${this.loan.name} ${location ? `in ${location} ` : ''}to pursue their dream?`; // eslint-disable-line max-len
			}
			return '';
		},
		isSuggestedMessage() {
			return this.message.trim() === this.suggestedMessage;
		},
		shareMessage() {
			return this.message.trim() || this.suggestedMessage;
		},
		utmContent() {
			if (this.isGuest) return 'guest';
			if (this.lender?.public && this.lender?.inviterName) return this.lender?.inviterName;
			return 'anonymous';
		},
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			if (this.loan.id) {
				return `${base}/invitedby/${this.lender.inviterName}/for/${this.loan.id}?utm_content=${this.utmContent}`; // eslint-disable-line max-len
			}

			return `${base}?utm_content=${this.utmContent}&utm_campaign=social_share_checkout_variant_scle_${this.shareCardLanguageVersion}`; // eslint-disable-line max-len
		},
		facebookShareUrl() {
			const pageUrl = `https://${this.$appConfig.host}${this.$route.path}`;
			return getFullUrl('https://www.facebook.com/dialog/share', {
				app_id: this.$appConfig.fbApplicationId,
				display: 'page',
				href: `${this.shareLink}&utm_source=facebook.com&utm_medium=social&utm_campaign=social_share_checkout_variant_scle_${this.shareCardLanguageVersion}`, // eslint-disable-line max-len
				redirect_uri: `${pageUrl}?kiva_transaction_id=${this.$route.query.kiva_transaction_id}`,
				quote: this.shareMessage,
			});
		},
		linkedInShareUrl() {
			return getFullUrl('https://www.linkedin.com/shareArticle', {
				mini: 'true',
				source: `https://${this.$appConfig.host}`,
				summary: this.shareMessage.substring(0, 256),
				title: `A loan for ${this.loan.name}`,
				url: `${this.shareLink}&utm_source=linkedin.com&utm_medium=social&utm_campaign=social_share_checkout_variant_scle_${this.shareCardLanguageVersion}` // eslint-disable-line max-len
			});
		},
		twitterShareUrl() {
			return getFullUrl('https://twitter.com/intent/tweet', {
				text: this.shareMessage,
				url: `${this.shareLink}&utm_source=t.co&utm_medium=social&utm_campaign=social_share_checkout_variant_scle_${this.shareCardLanguageVersion}`, // eslint-disable-line max-len
				via: 'Kiva',
			});
		},
	},
	methods: {
		handleFacebookResponse() {
			// Check for the route hash that facebook adds to the request
			if (this.$route.hash === '#_=_') {
				// Check for an error
				const { error_code: code, error_message: message } = this.$route.query;
				if (code) {
					// The 4201 error code means the user pressed 'Cancel', so can be ignored
					if (code !== '4201') {
						this.$kvTrackEvent(
							'thanks',
							'click-Facebook-share',
							'error-Social-Share-Lightbox'
						);
						this.$showTipMsg(`There was a problem sharing to Facebook: ${message}`, 'warning');
					} else {
						this.$kvTrackEvent(
							'thanks',
							'click-Facebook-share',
							'error-Social-Share-Lightbox'
						);
					}
				} else {
					this.$kvTrackEvent(
						'thanks',
						'click-Facebook-share',
						'error-Social-Share-Lightbox'
					);
					this.$showTipMsg('Thanks for sharing to Facebook!');
				}
			}
		},
		async copyLink() {
			const url = `${this.shareLink}&utm_source=social_share_link&utm_campaign=social_share_checkout_variant_scle_${this.shareCardLanguageVersion}`; // eslint-disable-line max-len
			try {
				await clipboardCopy(url);
				this.copyStatus = {
					class: 'social__btn--success',
					disabled: true,
					text: 'Copied!'
				};
			} catch (err) {
				this.copyStatus = {
					class: 'social__btn--error',
					disabled: true,
					text: 'Error'
				};
			} finally {
				setTimeout(() => {
					this.copyStatus = {
						class: '',
						disabled: false,
						text: 'Copy Link'
					};
				}, 500);
			}
		},
		calculatePeopleQtyToGoal() {
			const remainingAmount = parseFloat(this.loan.unreservedAmount);
			return remainingAmount === 0 ? 0 : Math.ceil(remainingAmount / 25);
		}
	},
	mounted() {
		if (this.receipt) {
			this.handleFacebookResponse();
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';
@import "foundation";

$color-facebook: #3b5998;
$color-twitter: #08a0e9;
$color-linkedin: #0077b5;
$color-copy-link: #2B7C5F;
$color-text: #212121;

$loan-circle-size: rem-calc(70);
$loan-circle-margin: 1rem;
$loan-triangle-size: rem-calc(12);

.page-content {
	padding: 0 10px;

	@media print {
		padding: 0;
	}
}

.message-content {
	background-color: #F4FBF7;
	margin-bottom: 15px;

	&__success {
		color: #1B6E43;
		float: right;
		margin-right: 0;

		@include breakpoint(medium) {
			margin-right: 40px;
		}
	}

	&__text {
		font-size: 15px;
		margin-top: 15px;
		padding-left: 15px;

		@include breakpoint(medium) {
			margin-top: 22px;
			padding-left: 0;
		}
	}
}

.progress {
	&__to-go {
		font-size: 14px;
		margin-top: 15px;
		margin-bottom: 5px;
		color: #212121;
		font-weight: bold;
	}

	&__days-remaining {
		font-size: 14px;
		margin-top: 15px;
		margin-bottom: 5px;
		color: $color-text;
		text-transform: uppercase;
		font-weight: bold;
	}
}

.thanks {
	&__header {
		text-align: left;
		margin-bottom: 2.5rem;

		@include breakpoint(medium) {
			text-align: center;
		}
	}

	&__headline {
		text-align: left;
	}

	&__base-text {
		font-weight: 300;
		font-size: 25px;
		text-align: left;
		line-height: 1.4;
	}

	&__social-share {
		margin-bottom: 0.5rem;
	}
}

.share {
	width: 100%;
	max-width: rem-calc(600);
	margin: 0 auto;

	&__social {
		@include breakpoint(large) {
			width: rem-calc(135);
		}
	}
}

.btn-container {
	margin-top: 25px;
}

.social {
	width: 100%;
	flex-wrap: wrap;
	flex-shrink: 0;

	@include breakpoint(large) {
		flex-direction: column;
	}

	&__icon {
		width: rem-calc(24);
		height: rem-calc(24);
		flex-shrink: 0;
		margin-right: rem-calc(9);
		fill: #fff;
	}

	&__btn {
		align-items: center;
		margin: 0 0 1rem 0;
		padding: 1rem rem-calc(9) 1rem 1rem;
		font-weight: $button-font-weight;
		line-height: 1;
		flex-shrink: 0;

		&:nth-child(2n) {
			margin-right: 0;
		}

		@include breakpoint(large) {
			width: 100%;
			margin-right: 0;

			&:last-child {
				margin-bottom: 0;
			}
		}

		&--facebook {
			display: flex;
			justify-content: center;
			border-radius: 15px;
			@include button-style($color-facebook, auto, #fff);
		}

		&--twitter {
			display: flex;
			justify-content: center;
			border-radius: 15px;
			color: $color-text;
			border: 1px solid $color-twitter;

			.social__icon {
				fill: $color-twitter;
			}
		}

		&--linkedin {
			display: flex;
			justify-content: center;
			border-radius: 15px;
			color: $color-text;
			border: 1px solid $color-linkedin;

			.social__icon {
				fill: $color-linkedin;
			}
		}

		&--link {
			display: flex;
			justify-content: center;
			border-radius: 15px;
			color: $color-text;
			border: 1px solid $color-copy-link;
			width: 100%;
			transition:
				background-color 0.25s ease-in,
				border-color 0.25s ease-in,
				color 0.25s ease-in;

			.social__icon {
				color: $color-copy-link;
				transition: fill 0.25s ease-in;
			}
		}

		&--success {
			background-color: rgb(var(--bg-brand));
			border-color: rgb(var(--bg-brand));
		}

		&--error {
			background-color: rgb(var(--bg-danger));
			border-color: rgb(var(--bg-danger));
		}

		&--success,
		&--error {
			color: #fff;
			cursor: default;
			transition:
				background-color 0.25s ease-out,
				border-color 0.25s ease-out,
				color 0.25s ease-out;

			&:hover {
				color: #fff;
				text-decoration: none;
			}

			.social__icon {
				transition: fill 0.25s ease-out;
				fill: #fff;
			}
		}
	}
}

.continue-link {
	margin-top: 25px;
	text-align: center;
	text-decoration: underline;
	text-underline-offset: 3px;
}
</style>
