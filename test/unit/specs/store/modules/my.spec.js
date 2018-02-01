import createMyModule from '@/store/modules/my';
import * as types from '@/store/mutation-types';

describe('my.js', () => {
	const myModule = createMyModule();

	describe('mutations', () => {
		it('RECEIVE_MY_KIVA_INFO should update userAccount and lender', () => {
			const state = { userAccount: {}, lender: {} };
			const updates = {
				userAccount: { id: 1234, balance: 25 },
				lender: { image: { url: 'http://www.kiva.org' } }
			};
			myModule.mutations[types.RECEIVE_MY_KIVA_INFO](state, updates);
			expect(state.userAccount.id).to.equal(updates.userAccount.id);
			expect(state.userAccount.balance).to.equal(updates.userAccount.balance);
			expect(state.lender.image.url).to.equal(updates.lender.image.url);
		});

		it('SIGN_OUT should reset to initial state', () => {
			const state = {};
			myModule.mutations[types.SIGN_OUT](state);
			expect(state.userAccount.id).to.equal(null);
			expect(state.userAccount.balance).to.equal(0);
			expect(state.lender.image.url).to.equal('');
		});
	});
});
