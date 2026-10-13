/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import HowKivaWorksLightbox from '#src/components/BorrowerProfile/HowKivaWorksLightbox';
import { globalOptions } from '../../../specUtils';

function mountLightbox(props = {}) {
	return mount(HowKivaWorksLightbox, {
		props,
		global: {
			...globalOptions,
			stubs: {
				// Always renders its slot, as the real lightbox does (it toggles with v-show), so the
				// assertions below exercise this component's own v-if on the animation.
				KvLightbox: {
					name: 'KvLightbox',
					props: ['visible', 'title'],
					emits: ['lightbox-closed'],
					template: '<div data-testid="stub-lightbox"><slot /></div>',
				},
				RevolvingFundAnimation: {
					name: 'RevolvingFundAnimation',
					template: '<div data-testid="stub-animation"></div>',
				},
				// Render Teleport content in place so it stays within the wrapper's query scope.
				teleport: true,
			},
		},
	});
}

describe('HowKivaWorksLightbox', () => {
	it('is hidden and leaves the animation unmounted by default', () => {
		const wrapper = mountLightbox();

		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('visible')).toBe(false);
		expect(wrapper.find('[data-testid="stub-animation"]').exists()).toBe(false);
	});

	it('shows the title, copy and animation when visible', () => {
		const wrapper = mountLightbox({ visible: true });

		const lightbox = wrapper.findComponent({ name: 'KvLightbox' });
		expect(lightbox.props('visible')).toBe(true);
		expect(lightbox.props('title')).toBe('How it works');
		expect(wrapper.get('[data-testid="stub-lightbox"]').text()).toContain('Helping one person after another');
		expect(wrapper.get('[data-testid="stub-lightbox"]').text()).toContain('lend that money again');
		expect(wrapper.find('[data-testid="stub-animation"]').exists()).toBe(true);
	});

	it('re-emits lightbox-closed when the lightbox closes', async () => {
		const wrapper = mountLightbox({ visible: true });

		await wrapper.findComponent({ name: 'KvLightbox' }).vm.$emit('lightbox-closed');

		expect(wrapper.emitted('lightbox-closed')).toHaveLength(1);
	});
});
