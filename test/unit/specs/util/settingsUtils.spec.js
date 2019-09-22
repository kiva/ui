import { hashCode } from '@/util/settingsUtils';

describe('settingsUtils.js', () => {
	describe('hashCode', () => {

		it('returns 0 if no param is passed', () => {
			expect(hashCode()).toEqual(0);
		});

		it('returns 0 if an empty string is passed', () => {
			expect(hashCode('')).toEqual(0);
		});

		it('converts a simple string into a 32bit integer', () => {
			const simpleString = 'some string';
			expect(hashCode(simpleString)).toEqual(1395333309);
		});

		it('converts a string including digits into a 32bit integer', () => {
			const simpleString = 'some string 12345';
			expect(hashCode(simpleString)).toEqual(-472388848);
		});

		it('converts a complex string including digits into a 32bit integer', () => {
			// eslint-disable-next-line
			const simpleString = '{"name":"SampleExpNae","enabled":true,"startTime":"2018-12-14T10:00","endTime":"2025-01-02T10:00","control":{"key":"control","name":"Control"},"distribution":{"control":0.5,"shown":0.5}}';
			expect(hashCode(simpleString)).toEqual(-1960699776);
		});
	});
});
