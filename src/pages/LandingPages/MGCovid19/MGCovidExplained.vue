<template>
	<div>
		<div class="mg-explained row">
			<h2 class="tw-mb-2 tw-text-center small-12 columns">
				Three Steps to Impact
			</h2>
			<p class="mg-explained__body small-12 columns tw-text-center">
				Set your commitment once, Kiva will make sure every dollar
				is lent to COVID-19 impacted individuals and businesses.
			</p>
		</div>
		<ol class="three-steps row">
			<li class="three-steps__step-wrapper column small-12 large-4">
				<div class="tw-text-center">
					<div class="three-steps__icon-wrapper">
						<img
							class="three-steps__icon"
							src="@/assets/images/covid-response/choose.png"
							srcset="@/assets/images/covid-response/choose_2x.png 2x"
							alt=""
							width="102"
							height="151"
							loading="lazy"
						>
					</div>
					<h3 class="tw-mb-1">
						Choose
					</h3>
					<div class="tw-text-center">
						Choose a monthly amount to go toward COVID-19 relief that
						works <span class="no-wrap">for you.</span>
					</div>
				</div>
			</li>
			<li class="three-steps__step-wrapper column small-12 large-4">
				<div class="tw-text-center">
					<div class="three-steps__icon-wrapper">
						<img
							class="three-steps__icon"
							src="@/assets/images/covid-response/check.png"
							srcset="@/assets/images/covid-response/check_2x.png 2x"
							alt=""
							width="119"
							height="150"
							loading="lazy"
						>
					</div>
					<h3 class="tw-mb-1">
						Check
					</h3>
					<div class="text-center">
						Receive a monthly impact report explaining how <span class="no-wrap">your money helped.</span>
					</div>
				</div>
			</li>
			<li class="three-steps__step-wrapper column small-12 large-4">
				<div class="tw-text-center">
					<div class="three-steps__icon-wrapper">
						<img
							class="three-steps__icon"
							src="@/assets/images/covid-response/grow.png"
							srcset="@/assets/images/covid-response/grow_2x.png 2x"
							alt=""
							width="105"
							height="150"
							loading="lazy"
						>
					</div>
					<h3 class="tw-mb-1">
						Grow
					</h3>
					<div class="text-center">
						As you get repaid, Kiva will re-lend your money and
						multiply <span class="no-wrap">your impact.</span>
					</div>
				</div>
			</li>
		</ol>
	</div>
</template>

<style lang="scss" scoped>
@import 'settings';

.three-steps {
	list-style: none;
	margin-bottom: 0;
	padding: 0;

	&__step-wrapper {
		margin-bottom: 2rem;
	}

	&__icon-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	&__icon {
		height: rem-calc(150);
		display: block;
	}
}

.mg-explained {
	&__body {
		max-width: 30rem;
		margin: 0 auto 2.5rem auto;
	}
}

</style>
