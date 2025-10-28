import { render } from '@testing-library/vue';
import KvFrequentlyAskedQuestions from '#src/components/Kv/KvFrequentlyAskedQuestions';

// Mock child components
const KvExpandableQuestion = {
	name: 'KvExpandableQuestion',
	template: '<div class="kv-expandable-question"><slot /></div>',
	props: ['title', 'content', 'id', 'active'],
};

const KvGrid = {
	name: 'KvGrid',
	template: '<div class="kv-grid"><slot /></div>',
};

// Helper to create proper Contentful rich text structure
const createRichTextQuestion = name => ({
	name,
	richText: {
		nodeType: 'document',
		data: {},
		content: [
			{
				nodeType: 'paragraph',
				data: {},
				content: [
					{
						nodeType: 'text',
						value: `This is the answer to ${name}`,
						marks: [],
						data: {},
					},
				],
			},
		],
	},
});

// Mock global properties
const global = {
	mocks: {
		$route: {
			hash: '',
		},
		$filters: {
			changeCase: str => str.toLowerCase().replace(/\s+/g, '-'),
		},
	},
	stubs: {
		KvExpandableQuestion,
		KvGrid,
	},
};

describe('KvFrequentlyAskedQuestions.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvFrequentlyAskedQuestions).toBeDefined();
		expect(KvFrequentlyAskedQuestions.name).toBe('KvFrequentlyAskedQuestions');
	});

	it('renders KvGrid wrapper', () => {
		const { container } = render(KvFrequentlyAskedQuestions, {
			props: {
				questions: [createRichTextQuestion('Test Question')],
			},
			global,
		});

		const grid = container.querySelector('.kv-grid');
		expect(grid).toBeTruthy();
	});

	it('renders headline when provided', () => {
		const { getByText } = render(KvFrequentlyAskedQuestions, {
			props: {
				headline: 'Frequently Asked Questions',
				questions: [],
			},
			global,
		});

		expect(getByText('Frequently Asked Questions')).toBeTruthy();
	});

	it('renders h2 for headline', () => {
		const { container } = render(KvFrequentlyAskedQuestions, {
			props: {
				headline: 'FAQ',
				questions: [],
			},
			global,
		});

		const h2 = container.querySelector('h2');
		expect(h2).toBeTruthy();
		expect(h2.textContent).toBe('FAQ');
	});

	it('does not render headline when not provided', () => {
		const { container } = render(KvFrequentlyAskedQuestions, {
			props: {
				questions: [],
			},
			global,
		});

		const h2 = container.querySelector('h2');
		expect(h2).toBeFalsy();
	});

	it('has default empty headline', () => {
		expect(KvFrequentlyAskedQuestions.props.headline.default).toBe('');
	});

	it('has default empty questions array', () => {
		expect(KvFrequentlyAskedQuestions.props.questions.default()).toEqual([]);
	});

	it('renders KvExpandableQuestion for each question', () => {
		const { container } = render(KvFrequentlyAskedQuestions, {
			props: {
				questions: [
					createRichTextQuestion('Question 1'),
					createRichTextQuestion('Question 2'),
				],
			},
			global,
		});

		const questions = container.querySelectorAll('.kv-expandable-question');
		expect(questions).toHaveLength(2);
	});

	it('applies divider styling', () => {
		const { container } = render(KvFrequentlyAskedQuestions, {
			props: {
				questions: [
					createRichTextQuestion('Question 1'),
					createRichTextQuestion('Question 2'),
				],
			},
			global,
		});

		const divider = container.querySelector('.tw-divide-y');
		expect(divider).toBeTruthy();
	});

	it('renders with no questions', () => {
		const { container } = render(KvFrequentlyAskedQuestions, {
			props: {
				questions: [],
			},
			global,
		});

		const grid = container.querySelector('.kv-grid');
		expect(grid).toBeTruthy();
	});

	it('has activeAccordion data property', () => {
		expect(KvFrequentlyAskedQuestions.data).toBeDefined();
	});

	it('has convertFromRichTextToHtml method', () => {
		expect(KvFrequentlyAskedQuestions.methods.convertFromRichTextToHtml).toBeDefined();
	});

	it('has setActiveAccordion method', () => {
		expect(KvFrequentlyAskedQuestions.methods.setActiveAccordion).toBeDefined();
	});
});
