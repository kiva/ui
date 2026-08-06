import { render, fireEvent } from '@testing-library/vue';
import GoalInReviewFeedbackForm from '#src/components/MyKiva/GoalInReview/GoalInReviewFeedbackForm';
import { globalOptions } from '../../../../specUtils';

// Stub the library FA component: expose props via data-attrs and buttons that
// re-emit each lifecycle event so we can assert the wrapper's forwarding.
vi.mock('@kiva/kv-components', () => ({
	KvFormAssemblyForm: {
		name: 'KvFormAssemblyForm',
		props: ['formAssemblyId', 'title'],
		emits: ['fa-form-submitted'],
		template: `
			<div
				data-testid="kv-fa-stub"
				:data-form-id="formAssemblyId"
				:data-title="title"
			>
				<button
					type="button"
					data-testid="emit-submitted"
					@click="$emit('fa-form-submitted', { valid: true })"
				>submit</button>
				<button
					type="button"
					data-testid="emit-invalid"
					@click="$emit('fa-form-submitted', { valid: false })"
				>bad</button>
			</div>
		`,
	},
}));

const renderForm = () => render(GoalInReviewFeedbackForm, { global: globalOptions });

describe('GoalInReviewFeedbackForm', () => {
	it('renders the FA form with a numeric form id and an accessible title', () => {
		const { getByTestId } = renderForm();
		const stub = getByTestId('kv-fa-stub');
		expect(Number(stub.getAttribute('data-form-id'))).toBeGreaterThan(0);
		expect(stub.getAttribute('data-title')).toBe('Goals feedback survey');
	});

	it('exposes a stable feedback-form test id', () => {
		const { getByTestId } = renderForm();
		getByTestId('goal-in-review-feedback-form');
	});

	it('forwards the submitted event on a valid fa-form-submitted', async () => {
		const { getByTestId, emitted } = renderForm();
		await fireEvent.click(getByTestId('emit-submitted'));
		expect(emitted().submitted).toHaveLength(1);
	});

	it('does not forward the submitted event when the submission is invalid', async () => {
		const { getByTestId, emitted } = renderForm();
		await fireEvent.click(getByTestId('emit-invalid'));
		expect(emitted().submitted).toBeUndefined();
	});
});
