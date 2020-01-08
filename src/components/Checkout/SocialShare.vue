<template>
	<div class="thanks">
		<section class="share">
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
				<button class="social__btn social__btn--facebook">
					<icon-facebook class="social__icon" />
					<span>Share</span>
				</button>
				<button class="social__btn social__btn--twitter">
					<icon-twitter class="social__icon" />
					<span>Tweet</span>
				</button>
				<button class="social__btn social__btn--linkedin">
					<icon-linkedin class="social__icon" />
					<span>Share</span>
				</button>
				<button class="social__btn social__btn--link">
					<span>Copy Link</span>
				</button>
			</div>
		</section>
	</div>
</template>

<script>
import IconFacebook from '@/assets/inline-svgs/social/facebook.svg';
import IconLinkedin from '@/assets/inline-svgs/social/linkedin.svg';
import IconTwitter from '@/assets/inline-svgs/social/twitter.svg';

export default {
	components: {
		IconFacebook,
		IconLinkedin,
		IconTwitter
	},
	props: {
		loans: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			selectedLoanIndex: 0,
			message: '',
			maxMessageLength: 280
		};
	},
	computed: {
		placeholderMessage() {
			return `Why did you lend to ${this.loans[this.selectedLoanIndex].name}?`;
		},
		suggestedMessage() {
			const selectedLoan = this.loans[this.selectedLoanIndex];
			const { name } = selectedLoan;
			const location = selectedLoan.geocode.city || selectedLoan.geocode.country.name;
			return `Kiva is an easy way to make a real difference in someone's life. Will you join me in helping ${name} in ${location} to pursue their dream?`; // eslint-disable-line max-len
		},
		isSuggestedMessage() {
			return this.message.trim() === this.suggestedMessage;
		}
	},
	methods: {
		setSelectedLoanIndex(index) {
			const usingSuggested = this.isSuggestedMessage;
			this.selectedLoanIndex = index;
			if (usingSuggested) {
				this.useSuggestedMessage();
			}
		},
		useSuggestedMessage() {
			this.message = this.suggestedMessage;
		},
		printReceipt() {
			if (typeof window !== 'undefined') {
				window.print();
			}
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
		height: 17rem;
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

	&__btn {
		display: flex;
		align-items: center;
		color: #fff;
		width: calc(50% - 0.5rem);
		margin: 0 1rem 1rem 0;
		padding: 1rem;

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

			&:hover,
			&:focus {
				text-decoration: $anchor-text-decoration-hover;
				color: $anchor-color-hover;
			}
		}
	}

	&__icon {
		width: rem-calc(24);
		height: rem-calc(24);
		flex-shrink: 0;
		margin-right: 1rem;
	}
}
</style>
