<template>
	<div class="kv-checkout-steps hide-for-print">
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
					<kv-icon name="confirmation" />
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
			default: 0
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

<style lang="scss">
@import 'settings';

.kv-checkout-steps {
	display: block;
	width: 100%;
	padding: 0  0 1.2rem;

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

			&.number-icon {
				background: $kiva-bg-lightgray;
				color: $kiva-stroke-gray;
				border: 1px solid $kiva-stroke-gray;
				border-radius: 0.8rem;
				font-size: 1rem;
				text-align: center;
				line-height: 1.325rem;
				font-weight: 700;
			}

			.icon {
				width: 1.4rem;
				height: 1.4rem;
				fill: $kiva-bg-lightgray;
			}
		}

		.checkmark {
			background: $kiva-stroke-gray;
			border-radius: 1.5rem;
			border: 1px solid $kiva-stroke-gray;
		}

		&.active {
			color: $kiva-green;

			.step-icon {
				.icon {
					width: 2rem;
					height: 2rem;
					fill: $kiva-green;
				}

				&.number-icon {
					background: $kiva-green;
					color: $white;
					border: 1px solid $kiva-green;
				}

				&.checkmark {
					background: #fff;
					border: 0;

					.icon {
						width: 1.5rem;
						height: 1.5rem;
					}
				}
			}
		}
	}
}
</style>
