import PageTwo from '@/pages/PageTwo';

describe('PageTwo.vue', () => {
	it('asyncData() should dispatch the \'hello\' action', () => {
		const store = {
			dispatch: sinon.spy()
		};
		PageTwo.asyncData({ store });
		expect(store.dispatch).to.have.been.calledWith('hello');
	});
});
