/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import ContentLightbox from '#src/components/BorrowerProfile/ContentLightbox';
import { globalOptions } from '../../../specUtils';

const solution = {
	title: 'Why is this borrower anonymous?',
	content: '<p>For the borrower\'s privacy.</p>',
};

function mountContentLightbox() {
	return mount(ContentLightbox, {
		global: {
			...globalOptions,
			stubs: {
				// Surface visibility/title/content for assertions.
				KvLightbox: {
					name: 'KvLightbox',
					props: ['visible', 'title'],
					template: '<div v-if="visible" data-testid="stub-lightbox"><slot /></div>',
				},
			},
		},
	});
}

describe('ContentLightbox', () => {
	it('is hidden until open() is called', () => {
		const wrapper = mountContentLightbox();

		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('visible')).toBe(false);
		expect(wrapper.find('[data-testid="stub-lightbox"]').exists()).toBe(false);
	});

	it('shows the title and content passed to open()', async () => {
		const wrapper = mountContentLightbox();

		wrapper.vm.open(solution);
		await wrapper.vm.$nextTick();

		const lightbox = wrapper.findComponent({ name: 'KvLightbox' });
		expect(lightbox.props('visible')).toBe(true);
		expect(lightbox.props('title')).toBe(solution.title);
		expect(wrapper.get('[data-testid="stub-lightbox"]').html()).toContain(solution.content);
	});

	it('hides immediately on close() and clears its content after the close animation', async () => {
		vi.useFakeTimers();
		try {
			const wrapper = mountContentLightbox();
			wrapper.vm.open(solution);
			await wrapper.vm.$nextTick();

			wrapper.vm.close();
			await wrapper.vm.$nextTick();

			// Hidden right away, but content is retained while the modal animates out.
			expect(wrapper.vm.visible).toBe(false);
			expect(wrapper.vm.title).toBe(solution.title);

			vi.advanceTimersByTime(500);
			expect(wrapper.vm.title).toBe('');
			expect(wrapper.vm.content).toBe('');
		} finally {
			vi.useRealTimers();
		}
	});

	it('does not clear content reopened before the previous close timer fires', async () => {
		vi.useFakeTimers();
		try {
			const wrapper = mountContentLightbox();

			// Open the first definition, then close it.
			wrapper.vm.open(solution);
			await wrapper.vm.$nextTick();
			wrapper.vm.close();

			// Reopen with new content partway through the close animation.
			const second = {
				title: 'Why is this loan anonymous?',
				content: '<p>The loan details were removed.</p>',
			};
			vi.advanceTimersByTime(200);
			wrapper.vm.open(second);
			await wrapper.vm.$nextTick();

			// The stale clear timer from the first close must not wipe the reopened content.
			vi.advanceTimersByTime(500);
			await wrapper.vm.$nextTick();

			expect(wrapper.vm.visible).toBe(true);
			expect(wrapper.vm.title).toBe(second.title);
			expect(wrapper.vm.content).toBe(second.content);
		} finally {
			vi.useRealTimers();
		}
	});
});
