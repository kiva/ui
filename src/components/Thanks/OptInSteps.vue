<template>
	<div class="steps-container">
		<ul class="steps-list">
			<li v-for="(step, index) in steps" :key="index" class="step-item" :class="{ 'completed': index < currentStep }">
				<div class="step">
					<span v-if="index < currentStep" class="tw-flex">
						<kv-material-icon class="tw-text-white tw-w-1.5 tw-h-1.5" :icon="mdiCheckBold" />
					</span>
				</div>
				<div class="step-text">
					{{ step.text }}
				</div>
				<div v-if="index < steps.length - 1" class="line"></div>
			</li>
		</ul>
	</div>
</template>

<script>
import { mdiCheckBold } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'OptInSteps',
	components: {
		KvMaterialIcon
	},
	props: {
		weeksToRepay: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			mdiCheckBold,
			currentStep: 1,
			steps: [
				{ text: 'Your contribution is received ' },
				{ text: 'Their loan is fully funded' },
				{ text: 'They use the money to improve their life' },
				{ text: `They start repaying you in ${this.weeksToRepay} weeks` }
			]
		};
	},
};
</script>

<style lang="postcss" scoped>
.steps-container {
  display: flex;
  flex-direction: column;
}

.steps-list {
  list-style: none;
  padding: 0;
  position: relative;
}

.step-item {
  display: flex;
  align-items: center;
  position: relative;
}

.step {
  width: 20px;
  height: 20px;
  margin-top: 20px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  z-index: 1;
}

.step-text {
  margin-left: 10px;
  margin-top: 20px;
  @apply tw-text-small;
}

@screen md {
  .step-text {
    @apply tw-text-base;
  }
}

.line {
  position: absolute;
  width: 5px;
  height: 40px;
  background-color: #ccc;
  top: 40px;
  left: 8px;
  z-index: 0;
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
</style>
