/* eslint-disable import/no-extraneous-dependencies */
import { mount, flushPromises } from '@vue/test-utils';
import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';
import { globalOptions } from '../../../specUtils';

// A solution as returned by the salesforceQuery operation.
const salesforceSolution = {
	name: 'Why is this anonymous?',
	note: '<p>For the borrower\'s privacy.</p>',
};

async function mountSummaryCard({ anonymizationLevel, query }) {
	const wrapper = mount(SummaryCard, {
		global: {
			...globalOptions,
			mocks: {
				...globalOptions.mocks,
				$route: { params: { id: '12345' } },
			},
			provide: {
				...globalOptions.provide,
				apollo: {
					...globalOptions.provide.apollo,
					query,
				},
			},
			stubs: {
				// Expose lightbox visibility/content via simple markup for assertions.
				KvLightbox: {
					name: 'KvLightbox',
					props: ['visible', 'title'],
					template: '<div v-if="visible" data-testid="stub-lightbox"><slot /></div>',
				},
			},
		},
	});
	// anonymizationLevel is populated by the apollo result() handler in the running app;
	// set it directly so the relevant trigger renders for this behavior test.
	await wrapper.setData({ isLoading: false, anonymizationLevel, use: 'A loan of $600 helps...' });
	return wrapper;
}

describe('SummaryCard', () => {
	it('opens the lightbox with the PII solution when the info icon is clicked', async () => {
		const query = vi.fn().mockResolvedValue({
			data: { general: { salesforceSolution } },
		});
		const wrapper = await mountSummaryCard({ anonymizationLevel: 'pii', query });

		await wrapper.find('[data-testid="bp-summary-pii-info"]').trigger('click');
		await flushPromises();

		expect(query).toHaveBeenCalledWith(
			expect.objectContaining({ variables: { id: '501US00000NRTYa' } })
		);
		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('visible')).toBe(true);
		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('title')).toBe(salesforceSolution.name);
		expect(wrapper.find('[data-testid="stub-lightbox"]').exists()).toBe(true);
		expect(wrapper.get('[data-testid="stub-lightbox"]').html()).toContain(salesforceSolution.note);
	});

	it('opens the lightbox with the anonymous-loan solution when "Learn more" is clicked', async () => {
		const query = vi.fn().mockResolvedValue({
			data: { general: { salesforceSolution } },
		});
		const wrapper = await mountSummaryCard({ anonymizationLevel: 'full', query });

		await wrapper.find('[data-testid="bp-summary-anonymous-learn-more"]').trigger('click');
		await flushPromises();

		expect(query).toHaveBeenCalledWith(
			expect.objectContaining({ variables: { id: '50150000000SXVz' } })
		);
		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('visible')).toBe(true);
		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('title')).toBe(salesforceSolution.name);
		expect(wrapper.find('[data-testid="stub-lightbox"]').exists()).toBe(true);
		expect(wrapper.get('[data-testid="stub-lightbox"]').html()).toContain(salesforceSolution.note);
	});
});
