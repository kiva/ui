<template>
	<div class="steps-container">
		<ul class="steps-list">
			<li
				v-for="(step, index) in steps"
				:key="index"
				class="step-item"
				:class="{ 'completed': index < currentStep }"
				:style="getDelayStyle(index)"
			>
				<div class="step">
					<span v-if="index < currentStep" class="tw-flex">
						<kv-material-icon class="tw-text-white tw-w-1.5 tw-h-1.5" :icon="mdiCheckBold" />
					</span>
				</div>
				<div class="step-text">
					{{ step.text }}
				</div>
				<div v-if="index > 0 && index < steps.length" class="line"></div>
			</li>
		</ul>
	</div>
</template>

<script>
import { mdiCheckBold } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LoanNextSteps',
	components: {
		KvMaterialIcon
	},
	props: {
		weeksToRepay: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			mdiCheckBold,
			currentStep: 1,
			steps: [
				{ text: 'Your contribution is received ' },
				{ text: 'Their is funded' },
				{ text: 'They use the money to improve their life' },
				{ text: `They start repaying you in ${this.weeksToRepay}` }
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
.steps-container {
	@apply tw-flex tw-flex-col;
}

.steps-list {
	@apply tw-list-none tw-p-0 tw-relative;
}

.step-item {
	animation: fadeIn 1s forwards;
	@apply tw-flex tw-items-center tw-relative tw-opacity-0 tw-h-6;
}

.step {
	transition: background-color 1s ease;
	@apply tw-w-2.5 tw-h-2.5 tw-mt-2.5 tw-rounded-full tw-bg-tertiary
		tw-flex tw-items-center tw-justify-center tw-font-medium tw-relative tw-z-1;
}

.step-text {
	@apply tw-ml-1 tw-mt-2.5 tw-text-small;
}

@screen md {
	.step-text {
		@apply tw-text-base;
	}
}

.line {
	transition: background-color 1s ease;
	animation: fadeIn 1s forwards;
	@apply tw-absolute tw-w-0.5 tw-h-3.5 tw-bottom-3 tw-bg-tertiary tw-left-1 tw-opacity-0;
}

.completed .step {
	@apply tw-bg-brand;
}

.completed .line {
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
