import KvCheckoutSteps from '@/components/Kv/KvCheckoutSteps';
import { array, number } from '@storybook/addon-knobs';

export default {
	title: 'Kv/KvCheckoutSteps',
	component: KvCheckoutSteps
};

export const Default = () => ({
	components: {
		KvCheckoutSteps
	},
	props: {
		steps: {
			type: Array,
			default() {
				return array(
					'steps',
					[
						'Basket',
						'Account',
						'Payment',
						'Thank You!'
					]
				)
			}
		},
		currentStepIndex: {
			default: number('currentStepIndex', 0)
		}
	},
	template: `
		<div>
			<kv-checkout-steps :steps="steps" :current-step-index="currentStepIndex" />
		</div>
	`
});


export const MonthlyGood = () => ({
	components: {
		KvCheckoutSteps
	},
	props: {
		steps: {
			type: Array,
			default() {
				return array(
					'steps',
					[
						'Review',
						'Thank You!'
					]
				)
			}
		},
		currentStepIndex: {
			default: number('currentStepIndex', 0)
		}
	},
	template: `
		<div>
			<kv-checkout-steps :steps="steps" :current-step-index="currentStepIndex" />
		</div>
	`
});
