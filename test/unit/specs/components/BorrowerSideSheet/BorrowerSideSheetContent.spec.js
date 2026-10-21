/* eslint-disable import/no-extraneous-dependencies */
import { computed, ref } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { KvLendCta } from '@kiva/kv-components';
import BorrowerSideSheetContent from '#src/components/BorrowerSideSheet/BorrowerSideSheetContent';
import { globalOptions } from '../../../specUtils';

const preference = vi.hoisted(() => ({ amount: undefined }));

vi.mock('#src/composables/useDefaultLoanShareAmount', () => ({
	default: () => ({ defaultLoanShareAmount: computed(() => preference.amount) }),
}));

vi.mock('#src/composables/useBorrowerProfileData', () => ({
	default: () => ({
		inPfp: ref(false),
		loan: ref({ id: 123, status: 'fundraising', name: 'Maria' }),
		lenders: ref(null),
		pfpMinLenders: ref(0),
		timeLeft: ref(''),
		unreservedAmount: ref('400'),
		fundraisingPercent: ref(0),
		loading: ref(false),
		isGuest: ref(false),
		loadBPData: () => {},
		clearBPData: () => {},
	}),
}));

vi.mock('#src/util/aiLoanPillsUtils', () => ({ fetchAiLoanPills: () => Promise.resolve([]) }));

vi.mock('vue-router', () => ({ useRouter: () => ({ currentRoute: { value: { query: {} } } }) }));

describe('BorrowerSideSheetContent default loan share amount', () => {
	afterEach(() => {
		preference.amount = undefined;
	});

	const mountContent = () => shallowMount(BorrowerSideSheetContent, {
		props: { loanId: 123, isAdding: false, basketItems: [] },
		global: { ...globalOptions, provide: { ...globalOptions.provide, $kvTrackEvent: () => {} } },
	});

	it('passes the lender\'s preferred amount to the lend box', () => {
		preference.amount = 100;

		expect(mountContent().findComponent(KvLendCta).props('defaultLoanShareAmount')).toBe(100);
	});

	it('passes no amount when the lender has no preference', () => {
		expect(mountContent().findComponent(KvLendCta).props('defaultLoanShareAmount')).toBeUndefined();
	});
});
