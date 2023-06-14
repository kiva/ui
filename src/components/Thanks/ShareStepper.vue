<template>
	<div class="tw-my-2 tw-px-2">
		<div style="width: 136px;" class="tw-mx-auto tw-px-1">
			<div class="tw-flex tw-items-center">
				<template v-for="step in steps">
					<ShareStepperStep
						:key="step.key"
						:step="step.key"
						:is-last-step="step.key === steps.length - 1"
						:text="!commentsMode ? step.text : ''"
					/>
				</template>
			</div>
		</div>
		<p class="tw-text-center tw-mt-4 tw-text-subhead" data-testid="thanks-message">
			<template v-if="showLenderName || !calculatePeopleQtyToGoal">
				<span v-if="commentsMode">
					<span class="data-hj-suppress">{{ lenderName }}</span>, go the extra mile
				</span>
				<span v-else>
					<!-- eslint-disable-next-line max-len -->
					<span class="data-hj-suppress">{{ lenderName }}</span>, complete your support by sharing {{ subject }}
				</span>
			</template>
			<template v-else>
				Complete your support by sharing {{ subject }}
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
		commentsMode: {
			type: Boolean,
			default: false
		},
		calculatePeopleQtyToGoal: {
			type: Number,
			default: 0
		}
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
	},
	computed: {
		subject() {
			if (this.calculatePeopleQtyToGoal) {
				return 'this loan.';
			}
			return 'Kiva\'s mission!';
		}
	}
};
</script>
