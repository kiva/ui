import { render, screen } from '@testing-library/vue';
import KvIcon from '#src/components/Kv/KvIcon';

describe('KvIcon.vue', () => {
	describe('fromSprite mode', () => {
		it('should render icon from sprite', () => {
			const { container } = render(KvIcon, {
				props: {
					name: 'test-icon',
					fromSprite: true
				}
			});

			const svgUseElement = container.querySelector('use');
			expect(svgUseElement).toBeTruthy();
			expect(svgUseElement.getAttribute('xlink:href')).toBe('#icon-test-icon');
		});

		it('should render title when provided', () => {
			render(KvIcon, {
				props: {
					name: 'test-icon',
					title: 'Test Icon Title',
					fromSprite: true
				}
			});

			const title = screen.getByText('Test Icon Title');
			expect(title.tagName.toLowerCase()).toBe('title');
		});

		it('should not render title when not provided', () => {
			const { container } = render(KvIcon, {
				props: {
					name: 'test-icon',
					fromSprite: true
				}
			});

			const title = container.querySelector('title');
			expect(title).toBeFalsy();
		});

		it('should apply icon class with name', () => {
			const { container } = render(KvIcon, {
				props: {
					name: 'my-custom-icon',
					fromSprite: true
				}
			});

			const svg = container.querySelector('svg');
			expect(svg.classList.contains('icon-my-custom-icon')).toBe(true);
		});

		it('should have proper styling', () => {
			const { container } = render(KvIcon, {
				props: {
					name: 'test-icon',
					fromSprite: true
				}
			});

			const svg = container.querySelector('svg');
			expect(svg.getAttribute('style')).toContain('backface-visibility: hidden');
		});
	});

	describe('inline mode (fromSprite=false)', () => {
		it('should render icon from inline svg file', () => {
			const { container } = render(KvIcon, {
				props: {
					name: 'question',
					fromSprite: false
				}
			});

			// Line 60: iconFile computed property is called
			// Line 18: branch for !fromSprite (v-else)
			const span = container.querySelector('span');
			expect(span).toBeTruthy();
		});

		it('should render title as screen-reader-only text in inline mode', () => {
			const { container } = render(KvIcon, {
				props: {
					name: 'question',
					title: 'Help Icon',
					fromSprite: false
				}
			});

			// Line 17: v-if="title" in inline mode renders as sr-only span
			const srOnlySpan = container.querySelector('.tw-sr-only');
			expect(srOnlySpan).toBeTruthy();
			expect(srOnlySpan.textContent).toBe('Help Icon');
		});

		it('should apply icon class in inline mode', async () => {
			const { container } = render(KvIcon, {
				props: {
					name: 'question',
					fromSprite: false
				}
			});

			// Wait for async component to load
			await vi.waitFor(() => {
				const iconContainer = container.querySelector('[class*="icon-"]');
				expect(iconContainer).toBeTruthy();
			});
		});

		it('should default to fromSprite=false when prop not provided', () => {
			const { container } = render(KvIcon, {
				props: {
					name: 'question'
				}
			});

			// Should render inline mode by default (fromSprite defaults to false)
			const span = container.querySelector('span');
			expect(span).toBeTruthy();
		});
	});
});
