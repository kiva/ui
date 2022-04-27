<template>
	<section class="share hide-for-print">
		<h2 class="share__title">
			Help by sharing
		</h2>
		<div class="share__social social">
			<a
				data-testid="share-facebook-button"
				class="social__btn social__btn--facebook"
				:href="facebookShareUrl"
				v-kv-track-event="['Borrower Profile', 'Social-Share-Lightbox', 'click-Facebook-share']"
			>
				<kv-icon name="facebook" title="Facebook" class="social__icon" />
			</a>
			<a
				data-testid="share-twitter-button"
				class="social__btn social__btn--twitter"
				:href="twitterShareUrl"
				target="_blank"
				rel="noopener"
				v-kv-track-event="['Borrower Profile', 'Social-Share-Lightbox', 'click-Twitter-share']"
				@click="$showTipMsg('Thanks for tweeting!')"
			>
				<kv-icon name="twitter" title="Twitter" class="social__icon" />
			</a>
			<a
				data-testid="share-email-button"
				class="social__btn social__btn--email"
				:href="emailShareUrl"
				target="_blank"
				rel="noopener"
				v-kv-track-event="['Borrower Profile', 'Social-Share-Lightbox', 'click-Email-share']"
				@click="$showTipMsg('Thanks for sharing!')"
			>
				<kv-icon name="email" title="Email" class="social__icon" />
			</a>
			<a
				data-testid="share-copy-link-button"
				class="social__btn social__btn--link"
				:disabled="copyStatus.disabled"
				v-kv-track-event="['Borrower Profile', 'Social-Share-Lightbox', 'click-Copy-link-share']"
				@click="copyLink"
			>
				<kv-icon name="link" tile="Copy Link" class="social__icon" />
				<span
					class="social__tooltip tw-p-1 tw-text-small"
					:class="copyStatus.class"
				>
					{{ this.copyStatus.text }}
				</span>
			</a>
		</div>
	</section>
</template>

<script>
import _map from 'lodash/map';
import clipboardCopy from 'clipboard-copy';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	inject: ['apollo'],
	components: {
		KvIcon
	},
	props: {
		borrowerName: {
			type: String,
			default: ''
		},
		sector: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			copyStatus: {
				class: '',
				disabled: false,
				text: ''
			},
			shareMessage: '',
			shareLink: `https://${this.$appConfig.host}${this.$route.path}`
		};
	},
	computed: {
		facebookShareUrl() {
			return this.getFullUrl('https://www.facebook.com/dialog/share', {
				app_id: this.$appConfig.fbApplicationId,
				display: 'page',
				href: `${this.shareLink}?utm_source=facebook.com&utm_medium=social&utm_campaign=social_share_checkout`,
				redirect_uri: `${this.shareLink}?kiva_transaction_id=${this.$route.query.kiva_transaction_id}`,
				quote: this.shareMessage,
			});
		},
		emailShareUrl() {
			return this.getFullUrl('Mailto:', {
				Subject: `Help fund ${this.borrowerName} 's ${this.sector} loan through Kiva!`,
				// eslint-disable-next-line max-len
				Body: `Hello,\n\nI thought you might be interested in supporting this Kiva loan, ${this.shareLink}.\n\n`
					+ `Even a small amount could help fund ${this.borrowerName}'s loan. And if you can't make a `
					+ 'donation, it would be great if you could share the fundraiser to help spread the word.'
					+ '\n\nThanks for taking a look!.',
			});
		},
		twitterShareUrl() {
			return this.getFullUrl('https://twitter.com/intent/tweet', {
				text: this.shareMessage,
				url: `${this.shareLink}?utm_source=t.co&utm_medium=social&utm_campaign=social_share_checkout`,
				via: 'Kiva',
			});
		},
	},
	methods: {
		getFullUrl(base, args) {
			const querystring = _map(args, (val, key) => `${key}=${encodeURIComponent(val)}`).join('&');
			return `${base}?${querystring}`;
		},
		handleFacebookResponse() {
			// Check for the route hash that facebook adds to the request
			if (this.$route.hash === '#_=_') {
				// Check for an error
				const { error_code: code, error_message: message } = this.$route.query;
				if (code) {
					// The 4201 error code means the user pressed 'Cancel', so can be ignored
					if (code !== '4201') {
						this.$showTipMsg(`There was a problem sharing to Facebook: ${message}`, 'warning');
					}
				} else {
					this.$showTipMsg('Thanks for sharing to Facebook!');
				}
			}
		},
		async copyLink() {
			const url = `${this.shareLink}?utm_source=social_share_link&utm_campaign=social_share_checkout`;
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
						text: ''
					};
				}, 2500);
			}
		}
	},
	mounted() {
		this.handleFacebookResponse();
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import "foundation";

$color-facebook: #3b5998;
$color-twitter: #08a0e9;
$color-email: #AB4147;
$color-clipboard: #DEB13C;

// layout of blocks
.share {
	width: 100%;
	max-width: rem-calc(600);
	margin: rem-calc(21) auto;
	padding: 0 rem-calc(15) 0 rem-calc(15);

	@include breakpoint(large) {
		background: white;
		padding: 32px;
		border-radius: 14px;
	}

	&__title {
		display: none;
		@include breakpoint(large) {
			display: block;
			margin-bottom: rem-calc(24);
		}
	}
}

// blocks

.social {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;

	&__icon {
		width: rem-calc(28);
		height: rem-calc(28);
		flex-shrink: 0;
		fill: #fff;
	}

	&__tooltip {
		visibility: hidden;
		position: absolute;
		margin-bottom: rem-calc(69);
		margin-left: rem-calc(-15);
	}

	&__btn {
		display: flex;
		align-items: center;
		border-radius: 100%;
		padding: rem-calc(12);
		font-weight: $button-font-weight;
		line-height: 1;

		&:nth-child(2n) {
			margin-right: 0;
		}

		&--facebook {
			@include button-style($color-facebook, auto, #fff);
		}

		&--twitter {
			@include button-style($color-twitter, auto, #fff);
		}

		&--email {
			@include button-style($color-email, auto, #fff);
		}

		&--link {
			@include button-style($color-clipboard, auto, #fff);
			transition:
				background-color 0.25s ease-in,
				border-color 0.25s ease-in,
				color 0.25s ease-in;

			.social__icon {
				fill: $medium-gray;
				transition: fill 0.25s ease-in;
			}
		}

		&--success {
			background-color: rgb(var(--bg-brand));
			border-color: rgb(var(--bg-brand));
			z-index: 10;
		}

		&--error {
			background-color: rgb(var(--bg-danger));
			border-color: rgb(var(--bg-danger));
		}

		&--success,
		&--error {
			color: #000;
			background-color: white;
			cursor: default;
			visibility: visible;
			box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
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

</style>
