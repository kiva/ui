<template>
	<div class="monthly-good-explained">
		<div class="row">
			<h1 class="column small-12 text-center">
				How does Monthly Good work?
			</h1>
			<div class="column small-12 medium-6 large-3 number">
				1
				<kv-icon name="hp-mg-1-signup mg-image" />
				<h2>
					Sign up
				</h2>
				to automatically help a borrower every month
			</div>
			<div class="column small-12 medium-6 large-3 number">
				2
				<kv-icon name="hp-mg-2-choose mg-image" />
				<h2>
					Choose
				</h2>
				how much and who you want to lend to - Kiva's got it from here
			</div>
			<div class="column small-12 medium-6 large-3 number">
				3
				<kv-icon name="hp-mg-3-receive mg-image" />
				<h2>
					Receive
				</h2>
				a personalized report on your impact once a month
			</div>
			<div class="column small-12 medium-6 large-3 number">
				4
				<kv-icon name="hp-mg-4-multiply mg-image" />
				<h2>
					Multiply
				</h2>
				your impact as Kiva continues to re-lend your repayments
			</div>
			<p class="column large-12 text-center learn-more-wrap">
				<router-link
					:to="`/monthly-good`"
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
			</p>
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
}

h1,
.learn-more-text,
.number {
	color: $white;
}

h1 {
	padding: 1.6rem 0;
}

.learn-more-wrap {
	margin: 2rem 0 2rem;
}

</style>
