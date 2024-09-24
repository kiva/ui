<template>
	<div class="tw-flex tw-items-center tw-gap-1 tw-py-0.5 tw-px-1 tw-shadow-lg" style="border-radius: 8px;">
		<activity-avatar
			:lender-image-url="lenderImageUrl"
			:lender-name="lenderName"
		/>
		<p class="tw-text-base tw-whitespace-nowrap">
			<span class="data-hj-suppress">{{ lenderName }}</span> contributed ${{ amountLent }}
		</p>
	</div>
</template>

<script>
import ActivityAvatar from '#src/components/Iwd/ActivityAvatar';

export default {
	name: 'ActivityCard',
	components: {
		ActivityAvatar,
	},
	props: {
		activity: {
			type: Object,
			required: true
		}
	},
	computed: {
		lenderName() {
			return this.activity?.lender?.name ?? '';
		},
		lenderImageUrl() {
			return this.activity?.lender?.image?.url ?? '';
		},
		amountLent() {
			const amount = this.activity?.shareAmount ?? 0;
			return parseFloat(amount).toFixed();
		}
	}
};
</script>
