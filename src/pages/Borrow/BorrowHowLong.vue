<template>
	<div>
		<div class="intro">
			<intro-graphic class="intro__graphic" />
			<p class="intro__subtitle">
				Step 1: Pre-check
			</p>
			<h1 class="intro__title text-center small-12 columns">
				How long and how much?
			</h1>
			<div class="intro__body small-12 large-8 columns text-center">
				<p>
					We're often asked, "How much can I borrow and how long will it take to fund?"
					It’s different for everyone, as loans can range from $1,000 - $15,000. We’ve seen
					that borrowers who take action and reach out to their community receive
					their loan as quickly as one week. The average time to complete the process is a few weeks.
				</p>
				<p>
					Start by deciding exactly how much you’ll need to borrow. With the right
					preparation, you can get funded very quickly on our platform.
				</p>
				<p>
					Need help getting started?
					<a href="https://www.kivaushub.org/borrower">Check out this useful guide</a>.
				</p>
			</div>
		</div>
		<!-- eslint-disable max-len -->
		<kv-button
			:href="`/my/borrower/application?refid=${trusteeId}`"
			class="cta-btn"
		>
			I understand, let’s create an account
		</kv-button>
		<!-- eslint-enable max-len -->
	</div>
</template>

<script>
import IntroGraphic from '@/assets/inline-svgs/borrow/howlong.svg';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		IntroGraphic,
		KvButton,
	},
	computed: {
		trusteeId() {
			return this.$route.query.refid || '';
		}
	},
};
</script>

<style lang="scss" scoped>

</style>
