import PageTwo from '@/pages/PageTwo';
import WwwPage from '@/components/WwwFrame/WwwPage';
import getDeepComponents from '@/util/getDeepComponents';

describe('getDeepComponents', () => {
	it('returns a list of all the components in the tree', () => {
		const result = getDeepComponents([PageTwo]);
		expect(result).toEqual(expect.arrayContaining([PageTwo, WwwPage]));
	});
});
