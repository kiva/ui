<template>
	<div class="tw-flex tw-flex-col">
		<ul class="steps-list tw-flex tw-flex-col lg:tw-flex-row tw-justify-end tw-gap-1">
			<li
				v-for="(step, index) in steps"
				:key="index"
				class="step-item"
				:class="{ 'completed': index < currentStep,
					'!tw-opacity-full !tw-animation-none': noAnimation }"
				:style="getDelayStyle(index)"
			>
				<div class="step" :class="{'!tw-border-2 !tw-border-action': index === currentStep}">
					<span v-if="index < currentStep" class="tw-flex">
						<kv-material-icon class="tw-text-white tw-w-1.5 tw-h-1.5" :icon="mdiCheckBold" />
					</span>
				</div>
				<div
					v-if="index >= 0 && index < steps.length - 1" class="horizontal-line tw-hidden lg:tw-block"
					:class="{ 'completed': index < currentStep, 'next': index === currentStep }"
				></div>
				<div class="step-text">
					<span v-html="step.text"></span>
				</div>
				<div
					v-if="index > 0 && index < steps.length" class="line lg:tw-hidden"
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
		},
		loanId: {
			type: Number,
			default: null
		},
	},
	data() {
		return {
			mdiCheckBold,
			steps: [
				{ text: 'Your contribution is received' },
				{ text: 'Their loan is funded' },
				{ text: 'They used the money to improve their life' },
				// eslint-disable-next-line max-len
				{ text: `${this.repaymentsStarted ? `First repayment in <span class="tw-text-action"> ${this.weeksToRepay} </span>` : 'They completed their repayments'}` }
			]
		};
	},
	methods: {
		getDelayStyle(index) {
			return {
				animationDelay: `${index * 1}s`
			};
		}
	},
	mounted() {
		this.$kvTrackEvent('borrower-profile', 'view', 'next-steps', this.loanId);
	}
};
</script>

<style lang="postcss" scoped>
.steps-list {
	@apply tw-list-none tw-p-0 tw-relative;
}

.step-item {
	animation: fadeIn 1s forwards;
	@apply tw-flex tw-flex-row lg:tw-flex-col tw-items-center tw-relative tw-opacity-0 lg:tw-h-full tw-h-6 lg:tw-gap-1;

	@screen lg {
		width: 138px;
	}
}

.step {
	transition: background-color 1s ease;
	@apply tw-bg-white tw-w-2.5 tw-h-2.5 tw-rounded-full tw-border-gray-200 tw-border-2
		tw-flex tw-items-center tw-justify-center tw-font-medium tw-relative tw-z-2 tw-min-w-2.5;
}

.step-text {
	font-size: 1.2rem;
	@apply tw-ml-1 tw-text-small lg:tw-text-center lg:tw-ml-0;
}

.line {
	transition: background-color 1s ease;
	animation: fadeIn 1s forwards;
	@apply tw-absolute tw-w-0.5 tw-h-5 tw-bottom-4 tw-left-1 tw-opacity-0 tw-bg-gray-200 tw-z-1;
}

.horizontal-line {
	transition: background-color 1s ease;
	animation: fadeIn 1s forwards;
	width: 138px;
	@apply tw-absolute tw-w-full tw-h-0.5 tw-top-1 tw-left-8 tw-opacity-0 tw-bg-gray-200;
}

.completed .step {
	@apply tw-bg-action tw-border-none;
}

.line.next {
	background: linear-gradient(180deg, #276A43, #E0E0E0);
}

.line.completed, .horizontal-line.completed {
	background: linear-gradient(90deg, #276A43 0%, #E0E0E0 100%);
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
