<template>
	<div class="kv-checkout-steps">
		<ul class="checkout-step-list">
			<li
				v-for="(step, index) in steps"
				:key="`step-${index}`"
				:id="`${step}-step` | changeCase('paramCase')"
				class="step"
				:class="isActive(index)"
			>
				<p class="step-name">
					{{ step }}
				</p>
				<span
					class="step-icon number-icon"
					v-if="index + 1 !== steps.length"
				>
					{{ index + 1 }}
				</span>
				<span v-else class="step-icon checkmark">
					<kv-icon class="checkmark-icon" name="confirmation" />
				</span>
			</li>
		</ul>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

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
		KvIcon
	},
	methods: {
		isActive(stepIndex) {
			return stepIndex === this.currentStepIndex ? 'active' : '';
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-checkout-steps {
	width: 100%;

	.checkout-step-list {
		list-style: none;
		display: flex;
		align-items: center;
		max-width: 40rem;
		margin: 0 auto 2rem;
	}

	.step {
		text-align: center;
		flex: 1;
		z-index: 10;
		font-weight: $global-weight-bold;
		color: $kiva-stroke-gray;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			border-top: 1px dashed $kiva-stroke-gray;
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
			font-size: 0.875rem;
			font-weight: 400;
		}

		.step-icon {
			display: block;
			margin: 0 auto;
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 50%;

			&.number-icon {
				background: $kiva-bg-lightgray;
				color: $kiva-stroke-gray;
				border: 1px solid $kiva-stroke-gray;
				font-size: 1rem;
				text-align: center;
				line-height: 1.325rem;
				font-weight: 700;
			}

			&.checkmark {
				width: 1.5rem;
				height: 1.5rem;
				background: #fff;
				border: 1px solid $kiva-stroke-gray;
				overflow: hidden;
			}

			.checkmark-icon {
				background: $kiva-stroke-gray;
				fill: $kiva-bg-lightgray;
				width: 100%;
			}
		}

		&.active {
			color: $kiva-green;

			.step-icon {
				fill: $kiva-green;

				&.number-icon {
					background: $kiva-green;
					color: $white;
					border: 1px solid $kiva-green;
				}

				&.checkmark {
					border: 0;
				}

				.checkmark-icon {
					background: #fff;
					fill: $kiva-green;
				}
			}
		}
	}
}
</style>
