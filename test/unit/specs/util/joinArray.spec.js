import {
	joinArray
} from '#src/util/joinArray';

const testArray = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
describe('joinArray.js', () => {
	test('Should join array with default conjunction', () => {
		expect(joinArray(testArray)).toEqual('First Item, Second Item, Third Item and Fourth Item');
	});
	test('Should join array with custom conjunction', () => {
		expect(joinArray(testArray, 'or')).toEqual('First Item, Second Item, Third Item or Fourth Item');
	});
	test('Should join array with no conjunction', () => {
		expect(joinArray(testArray, '')).toEqual('First Item, Second Item, Third Item, Fourth Item');
	});
	test('Should return array as string if it only contains a single item', () => {
		expect(joinArray(['Single Item'])).toEqual('Single Item');
	});
	test('Should return array as string if it only contains a single item, even if conjunction is included', () => {
		expect(joinArray(['Single Item'], 'and')).toEqual('Single Item');
	});
	test('Should return empty string if array is empty', () => {
		expect(joinArray([], 'and')).toEqual('');
	});
	test('Should throw error if param is not array', () => {
		expect(() => {
			joinArray('Not Array');
		}).toThrow('Passed value is not of array type.');
	});
});
