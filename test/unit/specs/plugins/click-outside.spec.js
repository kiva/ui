import clickOutside from '../../../../src/plugins/click-outside';

describe('click-outside.js', () => {
	let mockElement;
	let mockBinding;
	let mockEvent;

	beforeEach(() => {
		// Mock document first
		const mockTargetElement = { nodeType: 1 };

		global.document = {
			body: {
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			},
			createElement: vi.fn(() => mockTargetElement),
		};

		mockElement = {
			clickOutsideEvent: null,
			contains: vi.fn(),
		};

		mockBinding = {
			value: vi.fn(),
		};

		mockEvent = {
			target: mockTargetElement,
		};
	});

	describe('clickOutside directive', () => {
		it('should have a clickOutside directive', () => {
			expect(clickOutside.directives).toBeDefined();
			expect(clickOutside.directives.clickOutside).toBeDefined();
		});

		describe('beforeMount', () => {
			it('should add click event listener to document.body', () => {
				clickOutside.directives.clickOutside.beforeMount(mockElement, mockBinding);

				expect(global.document.body.addEventListener).toHaveBeenCalledWith(
					'click',
					expect.any(Function),
				);
			});

			it('should store the event handler on the element', () => {
				clickOutside.directives.clickOutside.beforeMount(mockElement, mockBinding);

				expect(mockElement.clickOutsideEvent).toBeDefined();
				expect(typeof mockElement.clickOutsideEvent).toBe('function');
			});

			it('should call binding.value when click is outside element', () => {
				mockElement.contains.mockReturnValue(false);

				clickOutside.directives.clickOutside.beforeMount(mockElement, mockBinding);

				// Simulate click event
				mockElement.clickOutsideEvent(mockEvent);

				expect(mockBinding.value).toHaveBeenCalledWith(mockEvent, mockElement);
			});

			it('should not call binding.value when click is on the element', () => {
				mockEvent.target = mockElement;

				clickOutside.directives.clickOutside.beforeMount(mockElement, mockBinding);

				// Simulate click event
				mockElement.clickOutsideEvent(mockEvent);

				expect(mockBinding.value).not.toHaveBeenCalled();
			});

			it('should not call binding.value when click is on a child element', () => {
				mockElement.contains.mockReturnValue(true);

				clickOutside.directives.clickOutside.beforeMount(mockElement, mockBinding);

				// Simulate click event
				mockElement.clickOutsideEvent(mockEvent);

				expect(mockBinding.value).not.toHaveBeenCalled();
			});
		});

		describe('unmounted', () => {
			it('should remove click event listener from document.body', () => {
				// First mount the directive to create the event handler
				clickOutside.directives.clickOutside.beforeMount(mockElement, mockBinding);

				const eventHandler = mockElement.clickOutsideEvent;

				// Then unmount it
				clickOutside.directives.clickOutside.unmounted(mockElement);

				expect(global.document.body.removeEventListener).toHaveBeenCalledWith(
					'click',
					eventHandler,
				);
			});
		});
	});
});
