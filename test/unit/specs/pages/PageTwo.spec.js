import PageTwo from '@/pages/PageTwo';

describe('PageTwo.vue', () => {
	it('asyncData() should dispatch the \'hello\' action', () => {
		const store = {
			dispatch: jest.fn()
		};
		PageTwo.asyncData({ store });
		expect(store.dispatch.mock.calls[0][0]).toBe('hello');
	});
});
