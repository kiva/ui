<template>
	<section class="share hide-for-print">
		<div class="share__loans loans">
			<button
				v-for="(loan, index) in loans.slice(0,3)"
				:key="loan.id"
				class="loans__circle"
				:class="{ 'loans__circle--selected': index === selectedLoanIndex }"
				@click="setSelectedLoanIndex(index)"
			>
				<img
					class="loans__img"
					:src="loan.image.url"
					:alt="`${loan.name} profile image`"
				>
			</button>
		</div>

		<div class="share__message message">
			<div
				class="message__triangle"
				:class="`message__triangle--loan${selectedLoanIndex + 1}`"
			>
			</div>
			<label
				class="message__label"
				for="message-textbox"
			>
				Message
			</label>
			<textarea
				class="message__textbox"
				id="message-textbox"
				:placeholder="placeholderMessage"
				:maxlength="maxMessageLength"
				v-model="message"
			></textarea>
			<transition name="kvfastfade">
				<button
					class="message__suggested-btn"
					v-if="!isSuggestedMessage"
					@click="useSuggestedMessage"
				>
					Suggested message
				</button>
			</transition>
			<div class="message__charcount">
				{{ message.length }}/{{ maxMessageLength }}
			</div>
		</div>

		<div class="share__social social">
			<a :href="facebookShareUrl" class="social__btn social__btn--facebook">
				<icon-facebook class="social__icon" />
				<span>Share</span>
			</a>
			<a
				class="social__btn social__btn--twitter"
				:href="twitterShareUrl"
				target="_blank"
				@click="$showTipMsg('Thanks for tweeting!')"
			>
				<icon-twitter class="social__icon" />
				<span>Tweet</span>
			</a>
			<a class="social__btn social__btn--linkedin"
				:href="linkedInShareUrl"
				target="_blank"
				@click="$showTipMsg('Thanks for sharing to LinkedIn!')"
			>
				<icon-linkedin class="social__icon" />
				<span>Share</span>
			</a>
			<button
				class="social__btn social__btn--link"
				:class="copyStatus.class"
				:disabled="copyStatus.disabled"
				@click="copyLink"
			>
				<icon-clipboard class="social__icon" />
				<span>{{ this.copyStatus.text }}</span>
			</button>
		</div>
	</section>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import clipboardCopy from 'clipboard-copy';
import IconClipboard from '@/assets/inline-svgs/icons/clipboard.svg';
import IconFacebook from '@/assets/inline-svgs/social/facebook.svg';
import IconLinkedin from '@/assets/inline-svgs/social/linkedin.svg';
import IconTwitter from '@/assets/inline-svgs/social/twitter.svg';

export default {
	inject: ['apollo'],
	components: {
		IconClipboard,
		IconFacebook,
		IconLinkedin,
		IconTwitter
	},
	props: {
		lender: {
			type: Object,
			required: true
		},
		loans: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			copyStatus: {
				class: '',
				disabled: false,
				text: 'Copy Link'
			},
			maxMessageLength: 280,
			message: '',
			selectedLoanIndex: 0,
		};
	},
	computed: {
		facebookShareUrl() {
			const pageUrl = `https://${this.$appConfig.host}${this.$route.path}`;
			return this.getFullUrl('https://www.facebook.com/dialog/share', {
				app_id: this.$appConfig.fbApplicationId,
				display: 'page',
				href: `${this.shareLink}?utm_source=facebook.com&utm_medium=social&utm_campaign=social_share_checkout`,
				redirect_uri: `${pageUrl}?kiva_transaction_id=${this.$route.query.kiva_transaction_id}`,
				quote: this.shareMessage,
			});
		},
		isSuggestedMessage() {
			return this.message.trim() === this.suggestedMessage;
		},
		linkedInShareUrl() {
			return this.getFullUrl('https://www.linkedin.com/shareArticle', {
				mini: 'true',
				source: `https://${this.$appConfig.host}`,
				summary: this.shareMessage.substring(0, 256),
				title: `A loan for ${this.selectedLoan.name}`,
				url: `${this.shareLink}?utm_source=linkedin.com&utm_medium=social&utm_campaign=social_share_checkout`
			});
		},
		placeholderMessage() {
			return this.selectedLoan.name ? `Why did you lend to ${this.selectedLoan.name}?` : '';
		},
		selectedLoan() {
			return this.loans[this.selectedLoanIndex] || {};
		},
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			if (this.selectedLoan.id) {
				return `${base}/invitedby/${this.lender.inviterName}/for/${this.selectedLoan.id}`;
			}
			return base;
		},
		shareMessage() {
			return this.message.trim() || this.suggestedMessage;
		},
		suggestedMessage() {
			if (this.selectedLoan.name) {
				const location = _get(this, 'selectedLoan.geocode.city') || _get(this, 'selectedLoan.geocode.country.name'); // eslint-disable-line max-len
				return `Kiva is an easy way to make a real difference in someone's life. Will you join me in helping ${this.selectedLoan.name} ${location ? `in ${location} ` : ''}to pursue their dream?`; // eslint-disable-line max-len
			}
			return '';
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
		setSelectedLoanIndex(index) {
			this.selectedLoanIndex = index;
		},
		useSuggestedMessage() {
			this.message = this.suggestedMessage;
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
						text: 'Copy Link'
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
$color-linkedin: #0077b5;

$loan-circle-size: rem-calc(70);
$loan-circle-margin: 1rem;
$loan-triangle-size: rem-calc(12);

// layout of blocks
.share {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: rem-calc(600);
	margin: 0 auto;

	@include breakpoint(large) {
		flex-direction: row;
	}

	&__loans {
		@include breakpoint(large) {
			width: rem-calc(70);
		}
	}

	&__message {
		flex: 1;
		margin: 1rem 0;

		@include breakpoint(large) {
			margin: 0 1rem;
		}
	}

	&__social {
		@include breakpoint(large) {
			width: rem-calc(135);
		}
	}
}

// blocks
.loans {
	display: flex;

	@include breakpoint(large) {
		flex-direction: column;
	}

	&__img {
		opacity: 0.3;
	}

	&__circle {
		width: $loan-circle-size;
		height: $loan-circle-size;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 $loan-circle-margin 0 0;

		&:focus {
			@include input-focus();

			outline: 0;
		}

		@include breakpoint(large) {
			margin: 0 0 $loan-circle-margin 0;
		}

		&:last-child {
			margin: 0;
		}

		&--selected {
			.loans__img {
				opacity: 1;
			}
		}
	}
}

.message {
	position: relative;

	&__label {
		@include visually-hidden();
	}

	&__textbox {
		resize: none;
		height: rem-calc(274);
		font-style: italic;
		margin: 0;
		padding: 1rem 1rem 3rem 1rem;
		border-color: $subtle-gray;
	}

	&__charcount,
	&__suggested-btn {
		position: absolute;
		bottom: 1rem;
		line-height: 1;
		color: $subtle-gray;
	}

	&__charcount {
		right: 1rem;
		user-select: none;
	}

	&__suggested-btn {
		left: 1rem;
		font-weight: unset;
		text-decoration: underline;
	}

	&__triangle {
		position: absolute;
		top: 0;
		left: 0;
		transition: transform 0.25s ease-in-out;

		// triangles
		&::after,
		&::before {
			content: '';
			display: block;
			position: absolute;
			top: $loan-triangle-size * -2;
			right: 100%;
			width: 0;
			height: 0;
			border-style: solid;
		}

		// triangle fill
		&::after {
			top: $loan-triangle-size * -2 + rem-calc(1);
			left: $loan-triangle-size;
			border-width: $loan-triangle-size;
			border-color: transparent transparent #fff transparent;
		}

		// triangle border
		&::before {
			top: $loan-triangle-size * -2 - rem-calc(1);
			left: $loan-triangle-size - rem-calc(1);
			border-width: $loan-triangle-size + rem-calc(1);
			border-color: transparent transparent $subtle-gray transparent;
		}

		@include breakpoint(large) {
			// triangle fill
			&::after {
				top: $loan-triangle-size;
				left: unset;
				border-color: transparent #fff transparent transparent;
			}

			// triangle border
			&::before {
				top: $loan-triangle-size - rem-calc(1);
				left: unset;
				border-color: transparent $subtle-gray transparent transparent;
			}
		}

		@function circleoffset($index) {
			@return calc(
				#{$loan-circle-size * $index} +
				#{$loan-circle-size / 2} -
				#{$loan-triangle-size * 2} +
				#{$index * $loan-circle-margin}
			);
		}
		$offset: rem-calc(1);

		&--loan1 {
			transform: translate(circleoffset(0), $offset);

			@include breakpoint(large) {
				transform: translate($offset, circleoffset(0));
			}
		}

		&--loan2 {
			transform: translate(circleoffset(1), $offset);

			@include breakpoint(large) {
				transform: translate($offset, circleoffset(1));
			}
		}

		&--loan3 {
			transform: translate(circleoffset(2), $offset);

			@include breakpoint(large) {
				transform: translate($offset, circleoffset(2));
			}
		}
	}
}

.social {
	display: flex;
	flex-wrap: wrap;

	@include breakpoint(large) {
		flex-direction: column;
	}

	&__icon {
		width: rem-calc(24);
		height: rem-calc(24);
		flex-shrink: 0;
		margin-right: rem-calc(9);
	}

	&__btn {
		display: flex;
		align-items: center;
		color: #fff;
		width: calc(50% - 0.5rem);
		margin: 0 1rem 1rem 0;
		padding: 1rem rem-calc(9) 1rem 1rem;
		font-weight: $button-font-weight;
		line-height: 1;

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
			@include button-style($color-facebook, auto, #fff);
		}

		&--twitter {
			@include button-style($color-twitter, auto, #fff);
		}

		&--linkedin {
			@include button-style($color-linkedin, auto, #fff);
		}

		&--link {
			color: $kiva-textlink;
			border: rem-calc(1) solid $subtle-gray;
			transition:
				background-color 0.25s ease-in,
				border-color 0.25s ease-in,
				color 0.25s ease-in;

			&:hover,
			&:focus {
				text-decoration: $anchor-text-decoration-hover;
				color: $anchor-color-hover;
			}

			.social__icon {
				path {
					transition: fill 0.25s ease-in;
					fill: $medium-gray;
				}
			}
		}

		&--success {
			background-color: $kiva-green;
			border-color: $kiva-green;
		}

		&--error {
			background-color: $kiva-accent-red;
			border-color: $kiva-accent-red;
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
				path {
					transition: fill 0.25s ease-out;
					fill: #fff;
				}
			}
		}
	}
}
</style>
