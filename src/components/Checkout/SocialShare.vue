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
				<textarea
					class="message__textbox"
					v-model="message"
					:maxlength="maxMessageLength"
				></textarea>
				<button
					class="message__suggested-btn"
					v-if="message !== suggestedMessage"
					@click="setSuggestedMessage"
				>
					Suggested message
				</button>
				<div class="message__charcount">{{ suggestedMessage.length }}/{{ maxMessageLength }}</div>
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
				<button class="social__btn social__btn--email">
					<span>Link to email</span>
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
		suggestedMessage() {
			const selectedLoan = this.loans[this.selectedLoanIndex];
			return `Kiva is an easy way to make a real difference in someone's life. Will you join me in helping ${selectedLoan.name} in ${selectedLoan.geocode.city} to pursue their dream?`; // eslint-disable-line max-len
		}
	},
	methods: {
		setSelectedLoanIndex(index) {
			this.selectedLoanIndex = index;
			this.setSuggestedMessage();
		},
		setSuggestedMessage() {
			this.message = this.suggestedMessage;
		},
		printReceipt() {
			if (typeof window !== 'undefined') {
				window.print();
			}
		}
	},
	mounted() {
		this.setSuggestedMessage();
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.thanks {
	&__headline {
		@include impact-text();

		text-align: center;
	}

	&__subhead {
		@include featured-text();

		text-align: center;
	}
}

.loans {
	display: flex;
	justify-content: space-between;

	@include breakpoint(medium) {
		justify-content: center;
	}

	@include breakpoint(large) {
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}

	&__img {
		opacity: 0.3;
	}

	&__circle {
		width: rem-calc(70px);
		height: rem-calc(70px);
		border-radius: 50%;
		overflow: hidden;

		@include breakpoint(medium) {
			margin: 0 0.5rem;
		}

		@include breakpoint(large) {
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

	&__textbox {
		resize: none;
		height: 17rem;
		font-style: italic;
		margin: 0;
		padding: 1rem 1rem 3rem 1rem;
	}

	&__charcount {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		line-height: 1;
	}

	&__suggested-btn {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		line-height: 1;
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

		@include breakpoint(medium) {
			width: calc(25% - 0.75rem);

			&:nth-child(2n) {
				margin-right: 1rem;
			}

			&:last-child {
				margin-right: 0;
			}
		}

		@include breakpoint(large) {
			width: 100%;
			margin-right: 0;

			&:last-child {
				margin-bottom: 0;
			}
		}

		&--facebook {
			background: #3b5998;
		}

		&--twitter {
			background: #08a0e9;
		}

		&--linkedin {
			background: #0077b5;
		}

		&--email {
			color: $kiva-textlink;
		}
	}

	&__icon {
		width: rem-calc(24px);
		height: rem-calc(24px);
		margin-right: 1rem;
	}
}

.share {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: rem-calc(600px);
	margin: 0 auto;

	@include breakpoint(large) {
		flex-direction: row;
	}

	&__loans {
		@include breakpoint(large) {
			width: rem-calc(85px);
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
			width: rem-calc(135px);
		}
	}
}
</style>
