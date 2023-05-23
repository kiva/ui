<template>
	<section class="share hide-for-print">
		<div>
			<h2 class="share__headline" data-testid="share-headline">
				Help {{ selectedLoan.name }} spread the word.
			</h2>
			<p class="share__small__message">
				{{ shareSubtitle }}
			</p>
		</div>
		<div class="share__social social">
			<button
				data-testid="share-facebook-button"
				class="social__btn social__btn--facebook"
				@click="showSharePopUp(
					facebookShareUrl({utmCampaign, utmContent}),
					'Thanks for sharing to Facebook!')"
				v-kv-track-event="[
					'post-checkout',
					'share',
					'facebook',
					utmCampaign,
					selectedLoanId]"
			>
				<kv-icon name="facebook-round" title="Facebook" class="social__icon" />
				<span>Share</span>
			</button>
			<button
				data-testid="share-twitter-button"
				class="social__btn social__btn--twitter"
				@click="showSharePopUp(
					twitterShareUrl({utmCampaign, utmContent}),
					'Thanks for tweeting!')"
				v-kv-track-event="[
					'post-checkout',
					'share',
					'twitter',
					utmCampaign,
					selectedLoanId]"
			>
				<kv-icon name="twitter" title="Twitter" class="social__icon" />
				<span>Tweet</span>
			</button>
			<button
				data-testid="share-linkedin-button"
				class="social__btn social__btn--linkedin"
				@click="showSharePopUp(
					linkedInShareUrl({utmCampaign, utmContent}),
					'Thanks for sharing to LinkedIn!')"
				v-kv-track-event="[
					'post-checkout',
					'share',
					'linkedin',
					utmCampaign,
					selectedLoanId]"
			>
				<kv-icon name="linkedin" title="LinkedIn" class="social__icon" />
				<span>Share</span>
			</button>
			<button
				data-testid="share-copy-link-button"
				class="social__btn social__btn--link tw-text-link tw-border-tertiary tw-border"
				:class="copyStatus.class"
				:disabled="copyStatus.disabled"
				v-kv-track-event="[
					'post-checkout',
					'share',
					'copy-link',
					utmCampaign,
					selectedLoanId]"
				@click="copyLink({utmCampaign, utmContent}, copyStatus.text)"
			>
				<kv-icon name="clipboard" class="social__icon" />
				<span>{{ copyStatus.text }}</span>
			</button>
		</div>
	</section>
</template>

<script>
import orderBy from 'lodash/orderBy';
import KvIcon from '@/components/Kv/KvIcon';
import socialSharingMixin from '@/plugins/social-sharing-mixin';

export default {
	name: 'SocialShareV2',
	inject: ['apollo'],
	components: {
		KvIcon
	},
	props: {
		lender: {
			type: Object,
			required: true
		},
		loans: {
			type: Array,
			required: true
		},
		isGuest: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			copyStatus: {
				class: '',
				disabled: false,
				text: 'Copy Link'
			},
			isTeamInvitation: false,
			maxMessageLength: 280,
			message: '',
			selectedLoanIndex: 0,
			utmCampaign: 'social_share_checkout'
		};
	},
	mixins: [socialSharingMixin],
	computed: {
		selectedLoan() {
			const orderedLoans = orderBy(this.loans, ['unreservedAmount'], ['desc']);
			return orderedLoans[0] || {};
		},
		selectedLoanId() {
			return this.selectedLoan?.id ?? undefined;
		},
		placeholderMessage() {
			return this.selectedLoan.name ? `Why did you lend to ${this.selectedLoan.name}?` : '';
		},
		suggestedMessage() {
			if (this.selectedLoan.name) {
				const location = this.selectedLoan?.geocode?.city || this.selectedLoan?.geocode?.country?.name;
				return `Kiva is an easy way to make a real difference in someone's life. Will you join me in helping ${this.selectedLoan.name} ${location ? `in ${location} ` : ''}to pursue their dream?`; // eslint-disable-line max-len
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
			if (this.selectedLoanId) {
				return `${base}/invitedby/${this.lender.inviterName}/for/${this.selectedLoanId}`; // eslint-disable-line max-len
			}

			return base; // eslint-disable-line max-len
		},
		shareSubtitle() {
			return `You can make change happen faster for ${this.selectedLoan.name} by getting the word out. Share their loan with others and have an even bigger impact.`; // eslint-disable-line max-len
		}
	},
	methods: {
		onLoanSelect(index) {
			// are we currently using the suggested message?
			const isUsingSuggestedMessage = this.isSuggestedMessage;

			// update the selected loan which will change the suggestedMessage
			this.selectedLoanIndex = index;

			// if we were using the suggested message for the previous loan, use the suggested message for the new one.
			if (isUsingSuggestedMessage) {
				this.useSuggestedMessage();
			}
		},
		useSuggestedMessage() {
			this.message = this.suggestedMessage;
		},
	},
	mounted() {
		this.handleFacebookResponse('post-checkout');
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
	width: 100%;
	max-width: rem-calc(600);
	margin: 0 auto;

	&__wrapper {
		display: flex;
		flex-direction: column;

		@include breakpoint(large) {
			flex-direction: row;
			flex-wrap: wrap;
		}
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
			margin: 0 1rem 1rem 1rem;
		}
	}

	&__social {
		@include breakpoint(large) {
			width: rem-calc(135);
		}
	}

	&__teams {
		flex-basis: 100%;
		justify-content: center;
	}

	&__headline {
		text-align: center !important;
		margin-bottom: 1.5rem;
		margin-top: 1rem;
	}

	&__small__message {
		font-size: 1em;
		line-height: 1.5rem;
		margin-bottom: 1.5rem;
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
	}

	&__charcount,
	&__suggested-btn {
		position: absolute;
		bottom: 1rem;
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
			border-color: transparent transparent rgb(var(--bg-primary)) transparent;
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
				border-color: transparent rgb(var(--bg-primary)) transparent transparent;
			}

			// triangle border
			&::before {
				top: $loan-triangle-size - rem-calc(1);
				left: unset;
				border-color: transparent rgb(var(--border-tertiary)) transparent transparent;
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
		width: 100% !important;
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
			@include button-style($color-facebook, auto, #fff);
		}

		&--twitter {
			display: flex;
			justify-content: center;
			@include button-style($color-twitter, auto, #fff);
		}

		&--linkedin {
			display: flex;
			justify-content: center;
			@include button-style($color-linkedin, auto, #fff);
		}

		&--link {
			display: flex;
			justify-content: center;
			transition:
				background-color 0.25s ease-in,
				border-color 0.25s ease-in,
				color 0.25s ease-in;

			.social__icon {
				fill: $medium-gray;
				transition: fill 0.25s ease-in;
			}
		}
	}
}

.teams {
	display: flex;
	align-items: center;

	&__checkbox {
		margin-right: 1rem;
	}

	&__select-label {
		@include visually-hidden();
	}
}
</style>
