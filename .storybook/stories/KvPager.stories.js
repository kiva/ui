import KvPager from '@/components/Kv/KvPager';

export default {
	title: 'Kv/KvPager',
	component: KvPager,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvPager },
		template: `<kv-pager
			:page-size="pageSize"
			:total="total"
			:current="current"
			:extra-pages="extraPages"
			:scroll-to-top="scrollToTop" />`,
	})
	template.args = args;
	return template;
};

export const Default = story({ pageSize: 10, total: 0 });

export const FewerPages = story({ pageSize: 10, total: 30 });

export const MorePages = story({ pageSize: 10, total: 1000 });

export const SecondSelected = story({ pageSize: 10, total: 1000, current: 1 });

export const ThirdSelected = story({ pageSize: 10, total: 1000, current: 2 });

export const FourthSelected = story({ pageSize: 10, total: 1000, current: 3 });

export const LastSelected = story({ pageSize: 10, total: 1000, current: 99 });

export const SecondToLastSelected = story({ pageSize: 10, total: 1000, current: 98 });

export const ThirdToLastSelected = story({ pageSize: 10, total: 1000, current: 97 });

export const FourthToLastSelected = story({ pageSize: 10, total: 1000, current: 96 });

export const MoreExtraPages = story({ pageSize: 10, total: 1000, extraPages: 6 });
