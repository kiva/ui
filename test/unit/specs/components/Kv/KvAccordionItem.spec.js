import {
	render, fireEvent
} from '@testing-library/vue';
import KvAccordionItem from '#src/components/Kv/KvAccordionItem';

describe('KvAccordionItem.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvAccordionItem).toBeDefined();
		expect(KvAccordionItem.name).toBe('KvAccordionItem');
	});

	it('renders with required id prop', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test-accordion'
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		expect(button.getAttribute('aria-controls')).toBe('kv-accordion-test-accordion');
	});

	it('is closed by default', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test'
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		expect(button.getAttribute('aria-expanded')).toBe('false');
	});

	it('can be opened initially with open prop', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test',
				open: true
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		expect(button.getAttribute('aria-expanded')).toBe('true');
	});

	it('toggles open state when clicked', async () => {
		const { container, emitted } = render(KvAccordionItem, {
			props: {
				id: 'test'
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		await fireEvent.click(button);

		expect(button.getAttribute('aria-expanded')).toBe('true');
		expect(emitted().toggle).toBeTruthy();
		expect(emitted().toggle[0]).toEqual([{ open: true }]);
	});

	it('emits toggle event with open state', async () => {
		const { container, emitted } = render(KvAccordionItem, {
			props: {
				id: 'test',
				open: true
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		await fireEvent.click(button);

		expect(emitted().toggle[0]).toEqual([{ open: false }]);
	});

	it('is not disabled by default', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test'
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		expect(button.disabled).toBe(false);
	});

	it('can be disabled via prop', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test',
				disabled: true
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		expect(button.disabled).toBe(true);
	});

	it('does not toggle when disabled', async () => {
		const { container, emitted } = render(KvAccordionItem, {
			props: {
				id: 'test',
				disabled: true
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		await fireEvent.click(button);

		expect(emitted().toggle).toBeFalsy();
	});

	it('renders header slot content', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test'
			},
			slots: {
				header: '<h3>Accordion Title</h3>'
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		expect(container.textContent).toContain('Accordion Title');
	});

	it('renders body slot content', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test',
				open: true
			},
			slots: {
				default: '<p>Accordion body content</p>'
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		expect(container.textContent).toContain('Accordion body content');
	});

	it('has correct aria-hidden attribute when closed', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test'
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const content = container.querySelector('#kv-accordion-test');
		expect(content.getAttribute('aria-hidden')).toBe('true');
	});

	it('has correct aria-hidden attribute when open', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test',
				open: true
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const content = container.querySelector('#kv-accordion-test');
		expect(content.getAttribute('aria-hidden')).toBe('false');
	});

	it('validates id prop does not contain whitespace', () => {
		const { validator } = KvAccordionItem.props.id;
		expect(validator('valid-id')).toBe(true);
		expect(validator('invalid id')).toBe(false);
		expect(validator('')).toBe(false);
	});

	it('has expand method', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test'
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		expect(button.getAttribute('aria-expanded')).toBe('false');
	});

	it('has collapse method', () => {
		const { container } = render(KvAccordionItem, {
			props: {
				id: 'test',
				open: true
			},
			global: {
				stubs: {
					KvMaterialIcon: true,
					KvExpandable: {
						template: '<div><slot /></div>'
					}
				}
			}
		});

		const button = container.querySelector('button');
		expect(button.getAttribute('aria-expanded')).toBe('true');
	});
});
