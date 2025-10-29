import {
	render, fireEvent
} from '@testing-library/vue';
import KvExpandableQuestion from '../../../../../src/components/Kv/KvExpandableQuestion';

// Mock $route
const mockRoute = {
	hash: ''
};

// Mock $kvTrackEvent
const mockKvTrackEvent = vi.fn();

describe('KvExpandableQuestion.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvExpandableQuestion).toBeDefined();
		expect(KvExpandableQuestion.name).toBe('KvExpandableQuestion');
	});

	it('renders button element', () => {
		const { container } = render(KvExpandableQuestion, {
			props: {
				title: 'Test Question'
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		expect(container.querySelector('button')).toBeTruthy();
	});

	it('renders title prop', () => {
		const { container } = render(KvExpandableQuestion, {
			props: {
				title: 'What is the question?'
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		expect(container.textContent).toContain('What is the question?');
	});

	it('renders content prop as HTML', () => {
		const { container } = render(KvExpandableQuestion, {
			props: {
				title: 'Question',
				content: '<p>This is the <strong>answer</strong></p>'
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		const contentDiv = container.querySelector('.tw-prose');
		expect(contentDiv.innerHTML).toContain('<strong>answer</strong>');
	});

	it('is closed by default', () => {
		const { container } = render(KvExpandableQuestion, {
			props: {
				title: 'Question'
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		const content = container.querySelector('.tw-prose').parentElement;
		expect(content.style.display).toBe('none');
	});

	it('can be opened initially with active prop', () => {
		const { container } = render(KvExpandableQuestion, {
			props: {
				title: 'Question',
				active: true
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		const content = container.querySelector('.tw-prose').parentElement;
		expect(content.style.display).not.toBe('none');
	});

	it('toggles open state when button clicked', async () => {
		const { container, emitted } = render(KvExpandableQuestion, {
			props: {
				title: 'Question'
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		const button = container.querySelector('button');
		await fireEvent.click(button);

		expect(emitted().toggle).toBeTruthy();
		expect(emitted().toggle[0]).toEqual([{ title: 'Question' }]);
	});

	it('has default empty title', () => {
		expect(KvExpandableQuestion.props.title.default).toBe('');
	});

	it('has default empty content', () => {
		expect(KvExpandableQuestion.props.content.default).toBe('');
	});

	it('has default analyticsCategory of Faq', () => {
		expect(KvExpandableQuestion.props.analyticsCategory.default).toBe('Faq');
	});

	it('has default active as false', () => {
		expect(KvExpandableQuestion.props.active.default).toBe(false);
	});

	it('emits toggle event with title', async () => {
		const { container, emitted } = render(KvExpandableQuestion, {
			props: {
				title: 'Test Title'
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		const button = container.querySelector('button');
		await fireEvent.click(button);

		expect(emitted().toggle[0]).toEqual([{ title: 'Test Title' }]);
	});

	it('applies prose styling to content', () => {
		const { container } = render(KvExpandableQuestion, {
			props: {
				title: 'Question',
				content: '<p>Answer</p>'
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		const contentDiv = container.querySelector('.tw-prose');
		expect(contentDiv).toBeTruthy();
	});

	it('renders h3 for title', () => {
		const { container } = render(KvExpandableQuestion, {
			props: {
				title: 'Question Title'
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		const h3 = container.querySelector('h3');
		expect(h3).toBeTruthy();
		expect(h3.textContent).toBe('Question Title');
	});

	it('watches active prop changes', async () => {
		const { container, rerender } = render(KvExpandableQuestion, {
			props: {
				title: 'Question',
				active: false
			},
			global: {
				stubs: {
					KvExpandable: {
						template: '<div><slot /></div>'
					},
					KvMaterialIcon: true
				},
				mocks: {
					$route: mockRoute,
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});

		await rerender({ active: true });

		const content = container.querySelector('.tw-prose').parentElement;
		expect(content.style.display).not.toBe('none');
	});
});
