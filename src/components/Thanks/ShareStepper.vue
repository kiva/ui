<template>
	<div class="tw-my-2 tw-px-2">
		<div style="width: 136px;" class="tw-mx-auto tw-px-1">
			<div class="tw-flex tw-items-center">
				<template v-for="step in steps">
					<ShareStepperStep
						:key="step.key"
						:step="step.key"
						:is-last-step="step.key === steps.length - 1"
						:text="step.text"
					/>
				</template>
			</div>
		</div>
		<p class="tw-text-center tw-mt-4 tw-text-subhead">
			<template v-if="showLenderName">
				<span class="fs-mask data-hj-suppress">{{ lenderName }}</span>, complete your support by sharing.
			</template>
			<template v-else>
				Complete your support by sharing.
			</template>
		</p>
	</div>
</template>

<script>
import ShareStepperStep from '@/components/Thanks/ShareStepperStep';

export default {
	name: 'ShareStepper',
	components: { ShareStepperStep },
	props: {
		lenderName: {
			type: String,
			default: ''
		},
		showLenderName: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			steps: [
				{
					key: 0,
					text: 'Lend',
				},
				{
					key: 1,
					text: 'Share',
				},
			]
		};
	}
};
</script>
