<template>
	<div>
		<div class="intro">
			<community-graphic class="intro__graphic" />
			<h2 class="intro__title text-center small-12 columns">
				Start with your community
			</h2>

			<div class="intro__body small-12 columns text-center">
				<p>
					To receive your Kiva loan, you’ll need a small amount
					of funding from your community first.
				</p>
				<p>
					We do this because we believe that if your community
					will invest in you, so will our community as Kiva.
				</p>
			</div>
		</div>
		<kv-button to="/borrow/pre-application/how-long" class="cta-btn">
			Got it
		</kv-button>
	</div>
</template>

<script>
import CommunityGraphic from '@/assets/inline-svgs/borrow/community.svg';

import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		CommunityGraphic,
		KvButton,
	},
};
</script>


<style lang="scss" scoped>
@import 'settings';

</style>
