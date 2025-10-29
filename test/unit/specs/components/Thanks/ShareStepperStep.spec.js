import { render } from '@testing-library/vue';
import ShareStepperStep from '../../../../../src/components/Thanks/ShareStepperStep';

// Mock child components
vi.mock('#src/components/Kv/KvIcon', () => ({
	default: {
		name: 'KvIcon',
		template: '<span class="mock-kv-icon" :name="name"><slot /></span>',
		props: ['name', 'class']
	}
}));

const renderComponent = (props = {}) => {
	return render(ShareStepperStep, {
		props: {
			step: 0,
			isLastStep: false,
			iconName: '',
			text: '',
			...props
		}
	});
};

describe('ShareStepperStep', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(ShareStepperStep.name).toBe('ShareStepperStep');
		});

		it('should define expected props with correct types and defaults', () => {
			expect(ShareStepperStep.props).toMatchObject({
				step: {
					type: Number,
					default: 0
				},
				isLastStep: {
					type: Boolean,
					default: false
				},
				iconName: {
					type: String,
					default: ''
				},
				text: {
					type: String,
					default: ''
				}
			});
		});

		it('should register KvIcon component', () => {
			expect(ShareStepperStep.components).toHaveProperty('KvIcon');
		});
	});

	describe('Step Indicator Styling', () => {
		it('should render step indicator with brand background when not last step', () => {
			const { container } = renderComponent({
				step: 1,
				isLastStep: false
			});

			const indicator = container.querySelector('.tw-h-3\\.5.tw-rounded-full.tw-w-3\\.5');
			expect(indicator).toBeTruthy();
			expect(indicator.className).toContain('tw-bg-brand');
			expect(indicator.className).not.toContain('tw-bg-transparent');
		});

		it('should render step indicator with transparent background and border when last step', () => {
			const { container } = renderComponent({
				step: 2,
				isLastStep: true
			});

			const indicator = container.querySelector('.tw-h-3\\.5.tw-rounded-full.tw-w-3\\.5');
			expect(indicator).toBeTruthy();
			expect(indicator.className).toContain('tw-bg-transparent');
			expect(indicator.className).toContain('tw-border-2');
			expect(indicator.className).toContain('tw-border-brand');
			expect(indicator.className).not.toContain('tw-bg-brand');
		});
	});

	describe('Checkmark Icon', () => {
		it('should render checkmark icon when not last step', () => {
			const { container } = renderComponent({
				step: 0,
				isLastStep: false
			});

			const icon = container.querySelector('.mock-kv-icon[name="checkmark"]');
			expect(icon).toBeTruthy();
		});

		it('should not render checkmark icon when last step', () => {
			const { container } = renderComponent({
				step: 2,
				isLastStep: true
			});

			const icon = container.querySelector('.mock-kv-icon[name="checkmark"]');
			expect(icon).toBeFalsy();
		});
	});

	describe('Step Text Display', () => {
		it('should render text when provided', () => {
			const { getByText } = renderComponent({
				step: 1,
				isLastStep: false,
				text: 'Complete'
			});

			expect(getByText('Complete')).toBeTruthy();
		});

		it('should not render text element when text prop is empty', () => {
			const { container } = renderComponent({
				step: 1,
				isLastStep: false,
				text: ''
			});

			const textElement = container.querySelector('.tw-text-small.tw-absolute');
			expect(textElement).toBeFalsy();
		});

		it('should apply correct styling to text', () => {
			const { getByText } = renderComponent({
				step: 1,
				text: 'Done'
			});

			const textElement = getByText('Done');
			expect(textElement.className).toContain('tw-text-small');
			expect(textElement.className).toContain('tw-absolute');
			expect(textElement.className).toContain('tw-font-medium');
			expect(textElement.className).toContain('tw-uppercase');
		});

		it('should calculate margin-left based on step number', () => {
			const { getByText } = renderComponent({
				step: 2,
				text: 'Final'
			});

			const textElement = getByText('Final');
			// step = 2, so marginLeft = -0.25 * (2 + 1) = -0.75rem
			expect(textElement.style.marginLeft).toBe('-0.75rem');
		});

		it('should calculate different margin-left for different step numbers', () => {
			const { getByText } = renderComponent({
				step: 0,
				text: 'Start'
			});

			const textElement = getByText('Start');
			// step = 0, so marginLeft = -0.25 * (0 + 1) = -0.25rem
			expect(textElement.style.marginLeft).toBe('-0.25rem');
		});
	});

	describe('Connector Line', () => {
		it('should render connector line when not last step', () => {
			const { container } = renderComponent({
				step: 0,
				isLastStep: false
			});

			const connector = container.querySelector('.tw-w-8.tw-border-t-2.tw-border-brand');
			expect(connector).toBeTruthy();
		});

		it('should not render connector line when last step', () => {
			const { container } = renderComponent({
				step: 2,
				isLastStep: true
			});

			const connector = container.querySelector('.tw-w-8.tw-border-t-2.tw-border-brand');
			expect(connector).toBeFalsy();
		});
	});

	describe('Complete Step Scenarios', () => {
		it('should render first step correctly', () => {
			const { container, getByText } = renderComponent({
				step: 0,
				isLastStep: false,
				text: 'Lend'
			});

			// Should have filled indicator with checkmark
			const indicator = container.querySelector('.tw-bg-brand');
			expect(indicator).toBeTruthy();

			// Should have checkmark icon
			const icon = container.querySelector('.mock-kv-icon[name="checkmark"]');
			expect(icon).toBeTruthy();

			// Should have text
			expect(getByText('Lend')).toBeTruthy();

			// Should have connector line
			const connector = container.querySelector('.tw-w-8.tw-border-t-2');
			expect(connector).toBeTruthy();
		});

		it('should render middle step correctly', () => {
			const { container, getByText } = renderComponent({
				step: 1,
				isLastStep: false,
				text: 'Share'
			});

			// Should have filled indicator with checkmark
			expect(container.querySelector('.tw-bg-brand')).toBeTruthy();
			expect(container.querySelector('.mock-kv-icon[name="checkmark"]')).toBeTruthy();
			expect(getByText('Share')).toBeTruthy();
			expect(container.querySelector('.tw-w-8.tw-border-t-2')).toBeTruthy();
		});

		it('should render last step correctly', () => {
			const { container, getByText } = renderComponent({
				step: 2,
				isLastStep: true,
				text: 'Invite'
			});

			// Should have hollow indicator (transparent with border)
			const indicator = container.querySelector('.tw-bg-transparent.tw-border-2');
			expect(indicator).toBeTruthy();

			// Should NOT have checkmark icon
			const icon = container.querySelector('.mock-kv-icon[name="checkmark"]');
			expect(icon).toBeFalsy();

			// Should have text
			expect(getByText('Invite')).toBeTruthy();

			// Should NOT have connector line
			const connector = container.querySelector('.tw-w-8.tw-border-t-2');
			expect(connector).toBeFalsy();
		});

		it('should render step without text', () => {
			const { container } = renderComponent({
				step: 1,
				isLastStep: false,
				text: ''
			});

			// Should have indicator and checkmark
			expect(container.querySelector('.tw-bg-brand')).toBeTruthy();
			expect(container.querySelector('.mock-kv-icon[name="checkmark"]')).toBeTruthy();

			// Should NOT have text element
			expect(container.querySelector('.tw-text-small.tw-absolute')).toBeFalsy();

			// Should have connector
			expect(container.querySelector('.tw-w-8.tw-border-t-2')).toBeTruthy();
		});
	});

	describe('Container Structure', () => {
		it('should render with correct container classes', () => {
			const { container } = renderComponent();

			const wrapper = container.firstChild;
			expect(wrapper.className).toContain('tw-flex');
			expect(wrapper.className).toContain('tw-items-center');
			expect(wrapper.className).toContain('tw-text-brand');
			expect(wrapper.className).toContain('tw-relative');
		});
	});
});
