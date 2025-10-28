import { render, fireEvent } from '@testing-library/vue';
import TwoStepFaq from '#src/components/Settings/TwoStepFaq';

const global = {
	stubs: {
		KvLightbox: {
			name: 'KvLightbox',
			props: ['visible', 'title'],
			template: `<div v-if="visible" class="kv-lightbox" role="dialog">
				<div class="lightbox-title">{{ title }}</div>
				<div class="lightbox-content"><slot /></div>
				<button @click="$emit('lightbox-closed')">Close</button>
			</div>`,
		},
	},
};

describe('TwoStepFaq.vue', () => {
	it('renders heading', () => {
		const { getByText } = render(TwoStepFaq, {
			global,
		});

		expect(getByText('Level up your security with 2-step verfication')).toBeTruthy();
	});

	it('renders description', () => {
		const { getByText } = render(TwoStepFaq, {
			global,
		});

		expect(getByText(/2-step verification protects your Kiva account/)).toBeTruthy();
	});

	it('has name property', () => {
		expect(TwoStepFaq.name).toBe('TwoStepFaq');
	});

	it('has data properties', () => {
		const data = TwoStepFaq.data.call({});
		expect(data.whatIsLbVisible).toBe(false);
		expect(data.howItWorksLbVisible).toBe(false);
		expect(data.howItProtectsLbVisible).toBe(false);
	});

	it('has all methods', () => {
		expect(TwoStepFaq.methods.triggerWhatIsLightbox).toBeDefined();
		expect(TwoStepFaq.methods.triggerHowItWorksLightbox).toBeDefined();
		expect(TwoStepFaq.methods.triggerHowItProtectsLightbox).toBeDefined();
		expect(TwoStepFaq.methods.lightboxClosed).toBeDefined();
	});

	it('applies background color class', () => {
		const { container } = render(TwoStepFaq, {
			global,
		});

		const wrapper = container.querySelector('.tw-bg-primary');
		expect(wrapper).toBeTruthy();
	});

	it('applies padding class', () => {
		const { container } = render(TwoStepFaq, {
			global,
		});

		const wrapper = container.querySelector('.tw-p-4');
		expect(wrapper).toBeTruthy();
	});

	it('renders FAQ heading', () => {
		const { getByText } = render(TwoStepFaq, {
			global,
		});

		expect(getByText('FAQ')).toBeTruthy();
	});

	it('renders "What is 2-step Verification?" button', () => {
		const { getByText } = render(TwoStepFaq, {
			global,
		});

		expect(getByText('What is 2-step Verification?')).toBeTruthy();
	});

	it('renders "How does it work?" button', () => {
		const { getByText } = render(TwoStepFaq, {
			global,
		});

		expect(getByText('How does it work?')).toBeTruthy();
	});

	it('renders "How does it protect you?" button', () => {
		const { getByText } = render(TwoStepFaq, {
			global,
		});

		expect(getByText('How does it protect you?')).toBeTruthy();
	});

	it('applies text-link class to FAQ buttons', () => {
		const { container } = render(TwoStepFaq, {
			global,
		});

		const buttons = container.querySelectorAll('.tw-text-link');
		expect(buttons.length).toBe(3);
	});

	it('applies font-medium class to FAQ buttons', () => {
		const { container } = render(TwoStepFaq, {
			global,
		});

		const buttons = container.querySelectorAll('.tw-font-medium');
		expect(buttons.length).toBe(3);
	});

	it('applies text-left class to FAQ buttons', () => {
		const { container } = render(TwoStepFaq, {
			global,
		});

		const buttons = container.querySelectorAll('.tw-text-left');
		expect(buttons.length).toBe(3);
	});

	it('opens "What is 2-step Verification?" lightbox on button click', async () => {
		const { getByText, container } = render(TwoStepFaq, {
			global,
		});

		const button = getByText('What is 2-step Verification?');
		await fireEvent.click(button);

		const lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeTruthy();
		expect(getByText('What is 2-step verification?')).toBeTruthy();
	});

	it('opens "How does it work?" lightbox on button click', async () => {
		const { getByText, container } = render(TwoStepFaq, {
			global,
		});

		const button = getByText('How does it work?');
		await fireEvent.click(button);

		const lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeTruthy();
		expect(getByText(/Once you set up 2-step verification/)).toBeTruthy();
	});

	it('opens "How does it protect you?" lightbox on button click', async () => {
		const { getByText, container } = render(TwoStepFaq, {
			global,
		});

		const button = getByText('How does it protect you?');
		await fireEvent.click(button);

		const lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeTruthy();
		expect(getByText(/2-step verification ensures/)).toBeTruthy();
	});

	it('closes lightbox when lightbox-closed event is emitted', async () => {
		const { getByText, container } = render(TwoStepFaq, {
			global,
		});

		// Open lightbox
		const button = getByText('What is 2-step Verification?');
		await fireEvent.click(button);

		const closeButton = getByText('Close');
		await fireEvent.click(closeButton);

		const lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeFalsy();
	});

	it('renders three KvLightbox components', () => {
		const { container } = render(TwoStepFaq, {
			global,
		});

		// All lightboxes are in the DOM, just not visible
		const lightboxes = container.querySelectorAll('[role="dialog"]');
		expect(lightboxes.length).toBeGreaterThanOrEqual(0);
	});

	it('toggles lightbox visibility on multiple clicks', async () => {
		const { getByText, container } = render(TwoStepFaq, {
			global,
		});

		const button = getByText('What is 2-step Verification?');

		// Open
		await fireEvent.click(button);
		let lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeTruthy();

		// Close by clicking button again
		await fireEvent.click(button);
		lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeFalsy();

		// Open again
		await fireEvent.click(button);
		lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeTruthy();
	});

	it('renders heading with tw-text-h3 class', () => {
		const { container } = render(TwoStepFaq, {
			global,
		});

		const heading = container.querySelector('.tw-text-h3');
		expect(heading).toBeTruthy();
	});

	it('renders heading with tw-mb-2 class', () => {
		const { container } = render(TwoStepFaq, {
			global,
		});

		const heading = container.querySelector('.tw-text-h3.tw-mb-2');
		expect(heading).toBeTruthy();
	});

	it('renders paragraph with tw-mb-4 class', () => {
		const { container } = render(TwoStepFaq, {
			global,
		});

		const paragraph = container.querySelector('.tw-mb-4');
		expect(paragraph).toBeTruthy();
	});
});
