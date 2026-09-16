/* eslint-disable import/no-extraneous-dependencies */
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent } from 'vue';
import FundraisersSection from '#src/components/MyKiva/FundraisersSection';

const mockFetchMyGivingFundsData = vi.fn();

vi.mock('#src/composables/useGivingFund', () => ({
	default: () => ({
		fetchMyGivingFundsData: mockFetchMyGivingFundsData,
	}),
}));

const stub = (name, props = []) => defineComponent({
	name,
	props,
	template: `<div class="${name}-stub" />`,
});

const mountComponent = () => mount(FundraisersSection, {
	global: {
		provide: { apollo: {} },
		stubs: {
			FundraisersCarousel: stub('FundraisersCarousel'),
			YourFundraisersSection: stub('YourFundraisersSection', ['fund']),
		},
	},
});

const fundOwnedOn = date => ({ id: `fund-${date}`, createdDate: date });

describe('FundraisersSection', () => {
	beforeEach(() => {
		mockFetchMyGivingFundsData.mockReset();
	});

	it('renders nothing until the owned-funds lookup resolves', () => {
		mockFetchMyGivingFundsData.mockReturnValue(new Promise(() => {}));
		const wrapper = mountComponent();
		expect(wrapper.find('.FundraisersCarousel-stub').exists()).toBe(false);
		expect(wrapper.find('.YourFundraisersSection-stub').exists()).toBe(false);
	});

	it('shows the occasion carousel when the lender owns no fund', async () => {
		mockFetchMyGivingFundsData.mockResolvedValue({ givingFunds: { values: [] } });
		const wrapper = mountComponent();
		await flushPromises();
		expect(wrapper.find('.FundraisersCarousel-stub').exists()).toBe(true);
		expect(wrapper.find('.YourFundraisersSection-stub').exists()).toBe(false);
	});

	it('shows the owner state when the lender owns a fund', async () => {
		mockFetchMyGivingFundsData.mockResolvedValue({
			givingFunds: { values: [fundOwnedOn('2026-01-01')] },
		});
		const wrapper = mountComponent();
		await flushPromises();
		expect(wrapper.find('.YourFundraisersSection-stub').exists()).toBe(true);
		expect(wrapper.find('.FundraisersCarousel-stub').exists()).toBe(false);
	});

	it('passes the most recently created fund when the lender owns several', async () => {
		mockFetchMyGivingFundsData.mockResolvedValue({
			givingFunds: {
				values: [
					fundOwnedOn('2024-05-01'),
					fundOwnedOn('2026-03-01'),
					fundOwnedOn('2025-07-01'),
				],
			},
		});
		const wrapper = mountComponent();
		await flushPromises();
		expect(wrapper.findComponent({ name: 'YourFundraisersSection' }).props('fund').id)
			.toBe('fund-2026-03-01');
	});

	it('falls back to the carousel when the lookup fails', async () => {
		mockFetchMyGivingFundsData.mockResolvedValue(undefined);
		const wrapper = mountComponent();
		await flushPromises();
		expect(wrapper.find('.FundraisersCarousel-stub').exists()).toBe(true);
	});
});
