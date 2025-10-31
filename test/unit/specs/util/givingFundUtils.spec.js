import parseGivingFundCookie from '#src/util/givingFundUtils';

describe('parseGivingFundCookie', () => {
	it('should parse a full cookie string with fundId, uiv, and action', () => {
		const cookieString = '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6|3dae5d91-ef8a-4b8f-bddf-fbd456403c34|edit';

		const result = parseGivingFundCookie(cookieString);

		expect(result).toEqual({
			fundId: '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6',
			uiv: '3dae5d91-ef8a-4b8f-bddf-fbd456403c34',
			action: 'edit'
		});
	});

	it('should parse a cookie string without action (only fundId and uiv)', () => {
		const cookieString = '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6|3dae5d91-ef8a-4b8f-bddf-fbd456403c34';

		const result = parseGivingFundCookie(cookieString);

		expect(result).toEqual({
			fundId: '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6',
			uiv: '3dae5d91-ef8a-4b8f-bddf-fbd456403c34',
			action: null
		});
	});

	it('should return empty object when cookie string is null', () => {
		const result = parseGivingFundCookie(null);

		expect(result).toEqual({});
	});

	it('should return empty object when cookie string is undefined', () => {
		const result = parseGivingFundCookie(undefined);

		expect(result).toEqual({});
	});

	it('should return empty object when cookie string is empty', () => {
		const result = parseGivingFundCookie('');

		expect(result).toEqual({});
	});

	it('should handle cookie string with only fundId', () => {
		const cookieString = '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6';

		const result = parseGivingFundCookie(cookieString);

		expect(result).toEqual({
			fundId: '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6',
			uiv: null,
			action: null
		});
	});

	it('should handle cookie string with empty segments', () => {
		const cookieString = '||';

		const result = parseGivingFundCookie(cookieString);

		expect(result).toEqual({
			fundId: null,
			uiv: null,
			action: null
		});
	});

	it('should handle cookie string with partial empty segments', () => {
		const cookieString = '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6||edit';

		const result = parseGivingFundCookie(cookieString);

		expect(result).toEqual({
			fundId: '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6',
			uiv: null,
			action: 'edit'
		});
	});

	it('should handle cookie string with different action values', () => {
		const cookieString = '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6|3dae5d91-ef8a-4b8f-bddf-fbd456403c34|create';

		const result = parseGivingFundCookie(cookieString);

		expect(result).toEqual({
			fundId: '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6',
			uiv: '3dae5d91-ef8a-4b8f-bddf-fbd456403c34',
			action: 'create'
		});
	});

	it('should handle cookie string with extra segments beyond the expected format', () => {
		const cookieString = '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6|3dae5d91-ef8a-4b8f-bddf-fbd456403c34|'
			+ 'edit|extra|data';

		const result = parseGivingFundCookie(cookieString);

		expect(result).toEqual({
			fundId: '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6',
			uiv: '3dae5d91-ef8a-4b8f-bddf-fbd456403c34',
			action: 'edit'
		});
	});
});
