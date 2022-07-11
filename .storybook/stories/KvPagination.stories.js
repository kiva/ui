import KvPagination from '@/components/Kv/KvPagination';

export default {
	title: 'Kv/KvPagination',
	component: KvPagination,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvPagination },
		template: `<kv-pagination
			:limit="limit"
			:total="total"
			:offset="offset"
			:extra-pages="extraPages"
			:scroll-to-top="scrollToTop" />`,
	})
	template.args = args;
	return template;
};

export const Default = story({ limit: 10, total: 0 });

export const FewerPages = story({ limit: 10, total: 30 });

export const MorePages = story({ limit: 10, total: 1000 });

export const SecondSelected = story({ limit: 10, total: 1000, offset: 10 });

export const ThirdSelected = story({ limit: 10, total: 1000, offset: 20 });

export const FourthSelected = story({ limit: 10, total: 1000, offset: 30 });

export const LastSelected = story({ limit: 10, total: 1000, offset: 990 });

export const SecondToLastSelected = story({ limit: 10, total: 1000, offset: 980 });

export const ThirdToLastSelected = story({ limit: 10, total: 1000, offset: 970 });

export const FourthToLastSelected = story({ limit: 10, total: 1000, offset: 960 });

export const MoreExtraPages = story({ limit: 10, total: 1000, extraPages: 6 });
