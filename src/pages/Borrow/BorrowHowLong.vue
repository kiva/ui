<template>
	<div>
		<div class="intro">
			<intro-graphic class="intro__graphic" />
			<h2 class="intro__title text-center small-12 columns">
				How long and how much?
			</h2>

			<div class="intro__body small-12 columns text-center">
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
					Need help getting started? Check out this useful guide.
				</p>
			</div>
		</div>
		<!-- eslint-disable max-len -->
		<kv-button
			href="https://kivaportal.force.com/portal/secur/CommunitiesSelfRegUi?startURL=%2Fportal%2Fs%2F%3Fref%3Dbam%26refid%3D"
			class="cta-btn"
		>
			I understand
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
};
</script>


<style lang="scss" scoped>

</style>
