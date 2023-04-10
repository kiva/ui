import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KivaCreditStats from '@/pages/Portfolio/ImpactDashboard/KivaCreditStats';

import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

const data = (loans, deposits) => ({
	data: {
		my: {
			userStats: {
				amount_of_loans: loans,
			},
			lendingStats: {
				id: 1234,
				totalAmountDeposited: deposits,
			},
		},
	}
});

const template = `
	<kv-page-container class="tw-bg-secondary">
		<kv-grid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
			<div class="tw-col-span-12 md:tw-col-span-9 tw-pt-3">
				<kiva-credit-stats />
			</div>
		</kv-grid>
	</kv-page-container>
`;

export default {
	title: 'Page/Portfolio/Kiva Credit Stats',
	component: KivaCreditStats,
};

export const Loading = () => ({
	components: { KivaCreditStats, KvGrid, KvPageContainer },
	mixins: [apolloStoryMixin({ loading: true }), cookieStoreStoryMixin()],
	template,
});

export const OneLoanOneDeposit = () => ({
	components: { KivaCreditStats, KvGrid, KvPageContainer },
	mixins: [apolloStoryMixin({ queryResult: data('25.00', '25.00') }), cookieStoreStoryMixin()],
	template,
});

export const NoLoansNoDeposits = () => ({
	components: { KivaCreditStats, KvGrid, KvPageContainer },
	mixins: [apolloStoryMixin({ queryResult: data('0.00', '0.00') }), cookieStoreStoryMixin()],
	template,
});

export const LoansWithNoDeposits = () => ({
	components: { KivaCreditStats, KvGrid, KvPageContainer },
	mixins: [apolloStoryMixin({ queryResult: data('50.00', '0.00') }), cookieStoreStoryMixin()],
	template,
});

export const DepositsWithNoLoans = () => ({
	components: { KivaCreditStats, KvGrid, KvPageContainer },
	mixins: [apolloStoryMixin({ queryResult: data('0.00', '75.00') }), cookieStoreStoryMixin()],
	template,
});

export const MoreLoansThanDeposits = () => ({
	components: { KivaCreditStats, KvGrid, KvPageContainer },
	mixins: [apolloStoryMixin({ queryResult: data('856235.57', '2346.67') }), cookieStoreStoryMixin()],
	template,
});

export const MoreDepositsThanLoans = () => ({
	components: { KivaCreditStats, KvGrid, KvPageContainer },
	mixins: [apolloStoryMixin({ queryResult: data('8662.00', '35752.45') }), cookieStoreStoryMixin()],
	template,
});
