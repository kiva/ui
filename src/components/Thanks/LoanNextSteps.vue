<template>
	<div class="tw-flex tw-flex-col">
		<ul class="steps-list tw-flex tw-flex-col tw-justify-end tw-gap-1">
			<li
				v-for="(step, index) in steps"
				:key="index"
				class="step-item"
				:class="{ 'completed': index < currentStep,
					'!tw-opacity-full !tw-animation-none': noAnimation }"
				:style="getDelayStyle(index)"
			>
				<div class="step" :class="{'!tw-border-dashed !tw-border !tw-border-brand': index === currentStep}">
					<span v-if="index < currentStep" class="tw-flex">
						<kv-material-icon class="tw-text-white tw-w-1.5 tw-h-1.5" :icon="mdiCheckBold" />
					</span>
				</div>
				<div class="step-text">
					<span v-html="step.text"></span>
				</div>
				<div
					v-if="index > 0 && index < steps.length" class="line"
					:class="{ 'completed': index < currentStep, 'next': index === currentStep }"
				></div>
			</li>
		</ul>
	</div>
</template>

<script>
import { mdiCheckBold } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';

export default {
	name: 'LoanNextSteps',
	components: {
		KvMaterialIcon
	},
	props: {
		weeksToRepay: {
			type: String,
			default: ''
		},
		currentStep: {
			type: Number,
			default: 1
		},
		noAnimation: {
			type: Boolean,
			default: false
		},
		repaymentsStarted: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			mdiCheckBold,
			steps: [
				{ text: 'Your contribution is received ' },
				{ text: 'Their loan is funded' },
				{ text: 'They use the money to improve their life' },
				// eslint-disable-next-line max-len
				{ text: `${this.repaymentsStarted ? 'Their next repayment is coming in' : 'They start repaying you in'} <span class="tw-text-action"> ${this.weeksToRepay} </span>` }
			]
		};
	},
	methods: {
		getDelayStyle(index) {
			return {
				animationDelay: `${index * 1}s`
			};
		}
	}
};
</script>

<style lang="postcss" scoped>
.steps-list {
	@apply tw-list-none tw-p-0 tw-relative;
}

.step-item {
	animation: fadeIn 1s forwards;
	@apply tw-flex tw-items-center tw-relative tw-opacity-0 tw-h-6;
}

.step {
	transition: background-color 1s ease;
	background-color: #ECE4D5;
	@apply tw-w-2.5 tw-h-2.5 tw-rounded-full tw-border-stone tw-border
		tw-flex tw-items-center tw-justify-center tw-font-medium tw-relative tw-z-1 tw-min-w-2.5;
}

.step-text {
	font-size: 1.2rem;
	@apply tw-ml-1 tw-text-base;
}

.line {
	transition: background-color 1s ease;
	animation: fadeIn 1s forwards;
	background-color: #ECE4D5;
	@apply tw-absolute tw-w-0.5 tw-h-6 tw-bottom-3 tw-left-1 tw-opacity-0;
}

.completed .step {
	@apply tw-bg-brand tw-border-none;
}

.line.next {
	background: linear-gradient(180deg, #2AA967, #ECE4D5);
}

.line.completed {
	@apply tw-bg-brand;
}

.buttons button {
	margin: 10px;
}

@keyframes fadeIn {
	to {
		opacity: 1;
	}
}
</style>
