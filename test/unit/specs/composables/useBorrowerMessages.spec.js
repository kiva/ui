import { ref } from 'vue';
import useBorrowerMessages from '#src/composables/useBorrowerMessages';

const mockResult = ref(null);

vi.mock('#src/composables/useApolloQuery', () => ({
	default: () => ({ result: mockResult, loading: ref(false), error: ref(null) }),
}));

vi.mock('vue-router', () => ({
	useRoute: () => ({ query: {} }),
}));

describe('useBorrowerMessages', () => {
	describe('suggestedLoansEnabled', () => {
		const setting = value => ({
			general: { suggestedLoansEnabled: { key: 'ui.borrower_messages_suggested_loans', value } },
		});

		it('is true when the setting is true', () => {
			mockResult.value = setting('true');

			expect(useBorrowerMessages().suggestedLoansEnabled.value).toBe(true);
		});

		it.each([
			['false', setting('false')],
			['missing', { general: { suggestedLoansEnabled: null } }],
			['not loaded', null],
		])('is false when the setting is %s', (_, result) => {
			mockResult.value = result;

			expect(useBorrowerMessages().suggestedLoansEnabled.value).toBe(false);
		});
	});
});
