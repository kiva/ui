<template>
	<div class="tw-flex tw-items-center tw-text-brand tw-relative">
		<div>
			<div
				class="tw-h-3.5 tw-rounded-full tw-w-3.5"
				:class="[
					{ 'tw-bg-brand': !isLastStep },
					{ 'tw-bg-transparent tw-border-2 tw-border-brand': isLastStep }
				]"
			>
				<kv-icon
					v-if="!isLastStep"
					class="tw-fill-current tw-inline-flex tw-max-h-full tw-ml-1 tw-mt-1 tw-text-white tw-w-1.5"
					name="checkmark"
				/>
			</div>
			<p
				class="tw-text-small tw-absolute tw-font-medium tw-mt-0.5 tw-text-center tw-uppercase"
				:style="{ marginLeft: -0.25 * (step + 1) + 'rem' }"
			>
				{{ text }}
			</p>
		</div>
		<div v-if="!isLastStep" class="tw-w-8 tw-border-t-2 tw-border-brand"></div>
	</div>
</template>
<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'ShareStepperStep',
	components: { KvIcon },
	props: {
		step: {
			type: Number,
			default: 0
		},
		isLastStep: {
			type: Boolean,
			default: false
		},
		iconName: {
			type: String,
			default: ''
		},
		text: {
			type: String,
			default: ''
		}
	}
};
</script>
