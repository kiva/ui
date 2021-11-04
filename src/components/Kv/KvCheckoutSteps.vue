<template>
	<div class="kv-checkout-steps">
		<ol class="checkout-step-list">
			<li
				v-for="(step, index) in steps"
				:key="`step-${index}`"
				:id="`${step}-step` | changeCase('paramCase')"
				class="step	tw-font-medium tw-text-tertiary"
			>
				<p
					class="step-name tw-text-small tw-font-medium"
					:class="{'tw-text-brand': isActive(index)}"
				>
					{{ step }}
				</p>
				<span
					v-if="index + 1 !== steps.length"
					class="step-icon number-icon tw-w-3 tw-h-3 tw-rounded-full"
					:class="[
						{'tw-fill-current tw-bg-brand tw-text-white tw-border-brand tw-border': isActive(index)},
						{'tw-bg-secondary tw-text-tertiary tw-border tw-border-tertiary': !isActive(index)},
					]"
				>
					{{ index + 1 }}
				</span>
				<span
					v-else
					class="step-icon tw-w-3 tw-h-3 tw-rounded-full tw-border"
					:class="[
						{'tw-bg-brand tw-border-brand': isActive(index)},
						{'tw-bg-secondary tw-border-tertiary': !isActive(index)}
					]"
				>
					<kv-material-icon
						class="tw-w-2 tw-h-2 tw-fill-current"
						:class="[
							{'tw-text-white': isActive(index)},
							{'tw-text-tertiary': !isActive(index)},
						]"
						:icon="mdiCheckBold"
					/>
				</span>
			</li>
		</ol>
	</div>
</template>

<script>
import { mdiCheckBold } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	props: {
		steps: {
			type: Array,
			required: true
		},
		currentStepIndex: {
			type: Number,
			default: 0,
			validator(value) {
				return value >= 0 && Number.isInteger(value);
			}
		}
	},
	components: {
		KvMaterialIcon,
	},
	data() { return { mdiCheckBold }; },
	methods: {
		isActive(stepIndex) {
			return stepIndex === this.currentStepIndex;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-checkout-steps {
	width: 100%;

	.checkout-step-list {
		display: flex;
		align-items: center;
		margin: 0 auto;
	}

	.step {
		text-align: center;
		flex: 1;
		z-index: 10;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			border-top: 1px dashed rgb(var(--text-tertiary));
			bottom: 0.7rem;
			left: 50%;
			right: -50%;
			z-index: -1;
		}

		&:last-child {
			&::before {
				border: none;
			}
		}

		.step-name {
			margin-bottom: 0.3rem;
		}

		.step-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto;

			&.number-icon {
				font-weight: 700;
			}
		}
	}
}
</style>
