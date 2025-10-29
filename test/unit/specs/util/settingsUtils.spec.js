import {
	readJSONSetting, hashCode, readBoolSetting, readDateSetting
} from '../../../../src/util/settingsUtils';

describe('settingsUtils.js', () => {
	describe('readJSONSetting', () => {
		it('returns null for empty setting', () => {
			expect(readJSONSetting())
				.toBe(null);
		});

		it('returns null for malformed setting', () => {
			const malformedSetting = {
				key: 'uiexp.algolia_search',
				value: '""{\\"name\\"}""',
				__typename: 'Setting'
			};
			expect(readJSONSetting(malformedSetting, 'value'))
				.toBe(null);
		});

		it('converts a double escaped string into JSON', () => {
			const sampleSetting = {
				key: 'uiexp.algolia_search',
				// eslint-disable-next-line
				value: '"{\\\"name\\\": \\\"AlgoliaSearch\\\",\\\"enabled\\\": true,\\\"startTime\\\": \\\"2018-08-29T00:00\\\",\\\"endTime\\\": \\\"2020-02-16T15:00\\\",\\\"control\\\": {\\\"key\\\": \\\"variant-a\\\",\\\"name\\\": \\\"Control (variant-a)\\\"},\\\"variants\\\": {\\\"variant-b\\\": {\\\"name\\\": \\\"Algolia Search Enabled\\\"}},\\\"distribution\\\": {\\\"variant-a\\\": 0,\\\"variant-b\\\": 1}}\"',
				__typename: 'Setting'
			};
			const settingResult = {
				name: 'AlgoliaSearch',
				enabled: true,
				startTime: '2018-08-29T00:00',
				endTime: '2020-02-16T15:00',
				control: { key: 'variant-a', name: 'Control (variant-a)' },
				variants: { 'variant-b': { name: 'Algolia Search Enabled' } },
				distribution: { 'variant-a': 0, 'variant-b': 1 }
			};
			expect(readJSONSetting(sampleSetting, 'value'))
				.toEqual(settingResult);
		});
	});

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
			expect(hashCode(simpleString)).toEqual(472388848);
		});

		it('converts a complex string including digits into a 32bit integer', () => {
			// eslint-disable-next-line
			const simpleString = '{"name":"SampleExpName","enabled":true,"startTime":"2018-12-14T10:00","endTime":"2025-01-02T10:00","control":{"key":"control","name":"Control"},"distribution":{"control":0.5,"shown":0.5}}';
			expect(hashCode(simpleString)).toEqual(555929809);
		});

		it('converts a JSON stringified object into a hash', () => {
			// eslint-disable-next-line
			const stringifiedObj = '"{\"name\":\"AlgoliaSearch\",\"enabled\":true,\"startTime\":\"2018-08-29T00:00\",\"endTime\":\"2020-02-16T15:00\",\"control\":{\"key\":\"variant-a\",\"name\":\"Control (variant-a)\"},\"variants\":{\"variant-b\":{\"name\":\"Algolia Search Enabled\"}},\"distribution\":{\"variant-a\":0,\"variant-b\":1}}"';
			expect(hashCode(stringifiedObj)).toEqual(157042145);
		});
	});

	describe('readBoolSetting', () => {
		it('returns false if key is missing from data', () => {
			expect(readBoolSetting({}, 'missingKey')).toEqual(null);
		});
		it('returns false if key is string false', () => {
			expect(readBoolSetting({
				stringKey: 'false'
			}, 'stringKey')).toEqual(false);
		});
		it('returns false if key is boolean false', () => {
			expect(readBoolSetting({
				booleanKey: false
			}, 'booleanKey')).toEqual(false);
		});
		it('returns true if key is string true', () => {
			expect(readBoolSetting({
				stringKey: 'true'
			}, 'stringKey')).toEqual(true);
		});
		it('returns true if key is boolean true', () => {
			expect(readBoolSetting({
				booleanKey: true
			}, 'booleanKey')).toEqual(true);
		});
	});

	describe('readDateSetting', () => {
		it('returns null when value is undefined or missing', () => {
			expect(readDateSetting({}, 'missingKey')).toBeNull();
			expect(readDateSetting({ key: undefined }, 'key')).toBeNull();
		});

		it('returns null when value is null', () => {
			expect(readDateSetting({ dateKey: null }, 'dateKey')).toBeNull();
		});

		it('returns null when value is empty string', () => {
			expect(readDateSetting({ dateKey: '' }, 'dateKey')).toBeNull();
		});

		it('parses a valid date string', () => {
			const dateString = '2023-01-15T10:00:00';
			const result = readDateSetting({ dateKey: dateString }, 'dateKey');
			expect(result).toBeInstanceOf(Date);
			expect(result.getFullYear()).toBe(2023);
		});

		it('cleans quotes and slashes from date strings', () => {
			const dateStringWithQuotes = '"2023-01-15T10:00:00"';
			const result = readDateSetting({ dateKey: dateStringWithQuotes }, 'dateKey');
			expect(result).toBeInstanceOf(Date);
			expect(result.getFullYear()).toBe(2023);
		});
	});
});
