<template>
	<div class="tw-flex tw-flex-col tw-w-full">
		<div class="tw-flex tw-pt-2 md:tw-gap-6 lg:tw-gap-12">
			<div>
				<h1 style="line-height: 1;" class="md:tw-pb-3">
					Help us fund 4,000 women for Women’s Day!
				</h1>
				<div class="tw-flex md:tw-hidden tw-py-0.5 tw-items-center">
					<img :src="iWD2024Badge" alt="IWD Badge" style="width: 114px;">
					<!-- <iwd-progress-campaign class="tw-pr-2 tw-grow" /> -->
				</div>
				<!-- eslint-disable max-len -->
				<p class="tw-pb-3">
					To celebrate International Women’s Day, we’re aiming to fund 4,000 women this week. That’s 4,000 more women who could have the resources they need to thrive — and invest in their communities.
				</p>
				<p>We need you to make it happen. Help us reach our goal and earn your exclusive International Women’s Day badge!</p>
				<!-- eslint-enable max-len -->
			</div>
			<div class="tw-shrink-0 tw-hidden md:tw-block">
				<img :src="iWD2024Badge" alt="IWD Badge">
				<!-- <iwd-progress-campaign /> -->
			</div>
		</div>
		<div class="tw-pt-2">
			<activity-feed />
		</div>
	</div>
</template>

<script>
import ActivityFeed from '@/components/Iwd/ActivityFeed';
import iWD2024Badge from '@/assets/images/achievements/iwd_2024_badge.png';

export default {
	name: 'IwdCategoryHeader',
	components: {
		ActivityFeed,
	},
	data() {
		return {
			iWD2024Badge,
		};
	},
};
</script>
