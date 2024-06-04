<template>
	<div class="steps-container">
		<ul class="steps-list">
			<li v-for="(step, index) in steps" :key="index" class="step-item" :class="{ 'completed': index < currentStep }">
				<div class="step">
					<span v-if="index < currentStep" class="check">
						<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M4.58105 6.85986C4.58105 6.85986 7.31613 3.59315 9.06864 1.5" stroke="white" stroke-width="1.8141" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M1.6665 3.49158C1.6665 3.49158 3.40477 5.49801 4.51858 6.78364" stroke="white" stroke-width="1.8141" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
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
export default {
	name: 'OptInSteps',
	data() {
		return {
			currentStep: 1,
			steps: [
				{ text: 'Your contribution is received ' },
				{ text: 'Their loan is fully funded' },
				{ text: 'They use the money to improve their life' },
				{ text: 'They start repaying you in 00 weeks' }
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

.check svg {
  @apply tw-w-1 tw-h-1;
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

.completed .check svg path {
  fill: white;
}

.completed .line {
  @apply tw-bg-brand;
}

.buttons button {
  margin: 10px;
}
</style>
