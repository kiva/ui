import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import MyKivaCardGrid from '#src/components/MyKiva/MyKivaCardGrid';

vi.mock('#src/composables/useBreakpoints', () => ({
	default: () => ({
		isMobile: ref(false),
	}),
}));

vi.mock('@kiva/kv-components', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		KvCarousel: defineComponent({
			name: 'KvCarousel',
			setup(_, { slots }) {
				return () => {
					const children = Object.keys(slots).sort().map(name => slots[name]?.());
					return children;
				};
			},
		}),
	};
});

const StubCardA = defineComponent({
	name: 'StubCardA',
	props: { title: { type: String, default: '' } },
	template: '<div class="stub-card-a">{{ title }}</div>',
});

const StubCardB = defineComponent({
	name: 'StubCardB',
	template: '<div class="stub-card-b">Card B</div>',
});

describe('MyKivaCardGrid', () => {
	it('renders items in a grid on desktop', () => {
		const items = [
			{ key: 'a', component: StubCardA, props: { title: 'First' } },
			{ key: 'b', component: StubCardB },
		];

		const wrapper = mount(MyKivaCardGrid, {
			props: { items },
		});

		expect(wrapper.find('.stub-card-a').text()).toBe('First');
		expect(wrapper.find('.stub-card-b').text()).toBe('Card B');
		expect(wrapper.findAll('.stub-card-a')).toHaveLength(1);
		expect(wrapper.findAll('.stub-card-b')).toHaveLength(1);
	});

	it('renders empty state when no items provided', () => {
		const wrapper = mount(MyKivaCardGrid, {
			props: { items: [] },
		});

		expect(wrapper.find('.stub-card-a').exists()).toBe(false);
	});

	it('applies custom gridColsClass', () => {
		const wrapper = mount(MyKivaCardGrid, {
			props: {
				items: [{ key: 'a', component: StubCardA }],
				gridColsClass: 'custom-grid',
			},
		});

		expect(wrapper.find('.custom-grid').exists()).toBe(true);
	});

	it('forwards events from items to the rendered component', async () => {
		const handler = vi.fn();
		const ClickableCard = defineComponent({
			name: 'ClickableCard',
			emits: ['card-clicked'],
			template: '<button class="clickable" @click="$emit(\'card-clicked\')">Click</button>',
		});

		const items = [
			{
				key: 'click',
				component: ClickableCard,
				events: { 'card-clicked': handler },
			},
		];

		const wrapper = mount(MyKivaCardGrid, {
			props: { items },
		});

		await wrapper.find('.clickable').trigger('click');
		expect(handler).toHaveBeenCalledTimes(1);
	});
});

describe('MyKivaCardGrid mobile', () => {
	beforeEach(() => {
		vi.doMock('#src/composables/useBreakpoints', () => ({
			default: () => ({
				isMobile: ref(true),
			}),
		}));
	});

	afterEach(() => {
		vi.doUnmock('#src/composables/useBreakpoints');
	});

	it('renders items via KvCarousel on mobile', async () => {
		const { default: MyKivaCardGridMobile } = await import('#src/components/MyKiva/MyKivaCardGrid');
		const items = [
			{ key: 'a', component: StubCardA, props: { title: 'Mobile' } },
		];

		const wrapper = mount(MyKivaCardGridMobile, {
			props: { items },
		});

		expect(wrapper.find('.stub-card-a').text()).toBe('Mobile');
	});
});
