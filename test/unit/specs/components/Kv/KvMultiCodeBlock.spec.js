import {
	render, fireEvent
} from '@testing-library/vue';
import KvMultiCodeBlock from '../../../../../src/components/Kv/KvMultiCodeBlock';

describe('KvMultiCodeBlock.vue', () => {
	const mockCode = [
		{ title: 'JavaScript', snippet: 'const x = 5;' },
		{ title: 'Python', snippet: 'x = 5' },
		{ title: 'Ruby', snippet: 'x = 5' }
	];

	it('exports a valid Vue component', () => {
		expect(KvMultiCodeBlock).toBeDefined();
		expect(KvMultiCodeBlock.name).toBe('KvMultiCodeBlock');
	});

	it('renders tab container', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: true,
					KvHamburgerIcon: true
				}
			}
		});

		expect(container.querySelector('.tab-container')).toBeTruthy();
	});

	it('renders KvCodeBlock component', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: {
						template: '<div class="kv-code-block"><slot /></div>',
						props: ['code', 'nowrap']
					},
					KvHamburgerIcon: true
				}
			}
		});

		expect(container.querySelector('.kv-code-block')).toBeTruthy();
	});

	it('renders KvHamburgerIcon component', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: true,
					KvHamburgerIcon: {
						template: '<div class="kv-hamburger-icon"></div>',
						props: ['open', 'color', 'width']
					}
				}
			}
		});

		expect(container.querySelector('.kv-hamburger-icon')).toBeTruthy();
	});

	it('renders all tabs', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: true,
					KvHamburgerIcon: true
				}
			}
		});

		const tabs = container.querySelectorAll('.tab');
		expect(tabs.length).toBe(3);
	});

	it('displays first tab as active by default', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: true,
					KvHamburgerIcon: true
				}
			}
		});

		const activeTabs = container.querySelectorAll('.tab.active');
		expect(activeTabs.length).toBe(1);
		expect(activeTabs[0].textContent.trim()).toBe('JavaScript');
	});

	it('shows selected code snippet', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: {
						template: '<div class="kv-code-block">{{ code }}</div>',
						props: ['code', 'nowrap']
					},
					KvHamburgerIcon: true
				}
			}
		});

		expect(container.textContent).toContain('const x = 5;');
	});

	it('changes active tab when clicked', async () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: true,
					KvHamburgerIcon: true
				}
			}
		});

		const tabs = container.querySelectorAll('.tab');
		await fireEvent.click(tabs[1]); // Click Python tab

		const activeTabs = container.querySelectorAll('.tab.active');
		expect(activeTabs[0].textContent.trim()).toBe('Python');
	});

	it('tab container is closed by default', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: true,
					KvHamburgerIcon: true
				}
			}
		});

		const tabContainer = container.querySelector('.tab-container');
		expect(tabContainer.classList.contains('open')).toBe(false);
	});

	it('toggles tab container open state when clicked', async () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: true,
					KvHamburgerIcon: true
				}
			}
		});

		const tabContainer = container.querySelector('.tab-container');
		await fireEvent.click(tabContainer);

		expect(tabContainer.classList.contains('open')).toBe(true);
	});

	it('has default nowrap prop as false', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: {
						template: '<div class="kv-code-block" :data-nowrap="nowrap"><slot /></div>',
						props: ['code', 'nowrap']
					},
					KvHamburgerIcon: true
				}
			}
		});

		const codeBlock = container.querySelector('.kv-code-block');
		expect(codeBlock.dataset.nowrap).toBe('false');
	});

	it('passes nowrap prop to KvCodeBlock', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode,
				nowrap: true
			},
			global: {
				stubs: {
					KvCodeBlock: {
						template: '<div class="kv-code-block" :data-nowrap="nowrap"><slot /></div>',
						props: ['code', 'nowrap']
					},
					KvHamburgerIcon: true
				}
			}
		});

		const codeBlock = container.querySelector('.kv-code-block');
		expect(codeBlock.dataset.nowrap).toBe('true');
	});

	it('renders tabs from code array with correct structure', () => {
		const { container } = render(KvMultiCodeBlock, {
			props: {
				code: mockCode
			},
			global: {
				stubs: {
					KvCodeBlock: true,
					KvHamburgerIcon: true
				}
			}
		});

		const tabs = container.querySelectorAll('.tab');
		expect(tabs.length).toBe(3);
		expect(tabs[0].textContent.trim()).toBe('JavaScript');
		expect(tabs[1].textContent.trim()).toBe('Python');
		expect(tabs[2].textContent.trim()).toBe('Ruby');
	});
});
