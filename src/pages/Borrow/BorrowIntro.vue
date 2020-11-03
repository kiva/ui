<template>
	<div>
		<div class="intro row">
			<h2 class="intro__title text-center small-12 columns">
				Let’s get started.
			</h2>
			<p class="intro__body small-12 columns text-center">
				There are three steps to applying for a loan on Kiva.<br>
				You’ll need at least 35 minutes to complete your application, but it might take longer.
			</p>
		</div>
		<ol class="three-steps row">
			<li class="three-steps__step-wrapper column small-12 large-4">
				<div class="three-steps__step">
					<div class="three-steps__icon-wrapper">
						<borrow-step-1 class="three-steps__icon" />
					</div>
					<h3 class="three-steps__title">
						Step 1: <span class="no-wrap">Pre-check</span>
					</h3>
					<div class="three-steps__description">
						Quick questions to ensure a Kiva loan is a good match
					</div>
					<div class="three-steps__clock">
						<kv-icon name="clock" class="three-steps__clock-icon" />
						<span>5 minutes</span>
					</div>
				</div>
			</li>
			<li class="three-steps__step-wrapper column small-12 large-4">
				<div class="three-steps__step">
					<div class="three-steps__icon-wrapper">
						<borrow-step-2 class="three-steps__icon three-steps__icon--inbox" />
					</div>
					<h3 class="three-steps__title">
						Step 2: New account
					</h3>
					<div class="three-steps__description">
						Create an account and fill out your profile
					</div>
					<div class="three-steps__clock">
						<kv-icon name="clock" class="three-steps__clock-icon" />
						<span>5 minutes</span>
					</div>
				</div>
			</li>
			<li class="three-steps__step-wrapper column small-12 large-4">
				<div class="three-steps__step">
					<div class="three-steps__icon-wrapper">
						<borrow-step-3 class="three-steps__icon" />
					</div>
					<h3 class="three-steps__title">
						Step 3: Application
					</h3>
					<div class="three-steps__description">
						Complete your application and submit it to Kiva
					</div>
					<div class="three-steps__clock">
						<kv-icon name="clock" class="three-steps__clock-icon" />
						<span>25 minutes</span>
					</div>
				</div>
			</li>
		</ol>
		<div class="row">
			<div class="small-6 columns">
				<kv-button href="/my/borrower/application" class="secondary cta-btn">
					Continue my application
				</kv-button>
			</div>
			<div class="small-6 columns">
				<kv-button
					:to="{
						path: '/borrow/pre-application/community',
						query: {
							refid: $route.query.refid
						}
					}"
					class="smaller cta-btn"
				>
					Start Pre-check
				</kv-button>
			</div>
		</div>
	</div>
</template>

<script>
import BorrowStep1 from '@/assets/inline-svgs/borrow/precheck.svg';
import BorrowStep2 from '@/assets/inline-svgs/borrow/newaccount.svg';
import BorrowStep3 from '@/assets/inline-svgs/borrow/application.svg';

import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		BorrowStep1,
		BorrowStep2,
		BorrowStep3,
		KvButton,
		KvIcon,
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.three-steps {
	list-style: none;
	margin-bottom: 2rem;
	padding: 0;

	&__step-wrapper {
		margin-bottom: 2rem;
	}

	&__step {
		border-radius: rem-calc(10);
		box-shadow: $platinum 0 rem-calc(1) rem-calc(5) rem-calc(2);
		height: 100%;
		padding: 2rem;
		text-align: center;
	}

	&__icon-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		margin-bottom: 0.5rem;
	}

	&__icon {
		height: 6.25rem;
		display: block;
	}

	&__title {
		@include featured-text();

		line-height: 1.2;
		margin-bottom: 0.5rem;
		font-weight: 700;
	}

	&__description {
		text-align: center;
		line-height: 1.4;
		margin-bottom: 1rem;
	}

	&__clock {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__clock-icon {
		width: 1.5rem;
		margin-right: 0.5rem;
		fill: $kiva-text-light;
	}
}

</style>
