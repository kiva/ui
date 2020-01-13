<template>
	<div class="monthly-good-explained">
		<div class="row">
			<h1 class="column small-12 text-center">
				How does Monthly Good work?
			</h1>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					1
				</span>
				<kv-icon name="hp-mg-1-signup" class="mg-image" />
				<h2>
					Sign up
				</h2>
				<div class="description-text">
					to automatically help a borrower every month
				</div>
			</div>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					2
				</span>
				<kv-icon name="hp-mg-2-choose" class="mg-image" />
				<h2>
					Choose
				</h2>
				<div class="description-text">
					how much and who you want to lend to - Kiva's got it from here
				</div>
			</div>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					3
				</span>
				<kv-icon name="hp-mg-3-receive" class="mg-image" />
				<h2>
					Receive
				</h2>
				<div class="description-text">
					a personalized report on your impact once a month
				</div>
			</div>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					4
				</span>
				<kv-icon name="hp-mg-4-multiply" class="mg-image" />
				<h2>
					Multiply
				</h2>
				<div class="description-text">
					your impact as Kiva continues to re-lend your repayments
				</div>
			</div>
			<div class="column large-12 text-center learn-more-wrapper">
				<router-link
					:to="`/monthlygood`"
					class="learn-more-text"
					v-kv-track-event="[
						'homepage',
						'click-monthly-good-Learn more',
						'homepage-monthly-good-learn-more-link',
						'true'
					]"
				>
					Learn more
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.monthly-good-explained {
	background-color: $kiva-green;
	margin-bottom: 6rem;

	h1,
	h2,
	.learn-more-text,
	.number,
	.description-text {
		color: $white;
	}

	h2,
	.description-text {
		text-align: center;

		@include breakpoint(medium) {
			text-align: unset;
		}
	}

	h1 {
		padding: 1.6rem 0;
	}

	.step-wrapper {
		margin-bottom: 2.5rem;
	}

	.number {
		padding-left: 5.3rem;

		@include breakpoint(medium) {
			padding-left: unset;
		}
	}

	.description-text {
		max-width: 12.5rem;
		margin: 0 auto;

		@include breakpoint(medium) {
			margin: unset;
		}
	}

	.mg-image {
		width: 45%;
		max-height: 6.25rem;
		display: block;
		margin: 0 auto 1rem auto;

		@include breakpoint(medium) {
			text-align: unset;
			margin-left: 1.25rem;
		}
	}

	.learn-more-wrapper {
		margin-bottom: 2rem;
	}
}

</style>
