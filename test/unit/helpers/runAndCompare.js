/* eslint-disable import/prefer-default-export */

export const runManyTimes = cb => {
	for (let i = 1; i < 100; i += 1) {
		cb();
	}
};

export const runManyTimesAndCompare = cb => {
	const expected = cb();
	runManyTimes(() => {
		expect(cb()).toBe(expected);
	});
};
