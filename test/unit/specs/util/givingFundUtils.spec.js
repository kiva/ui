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

	describe('URL decoding behavior', () => {
		it('should decode URL-encoded pipe characters (%7C) in cookie string', () => {
			const cookieString = '9a599bcb-57b5-475d-915c-f3e2d9c76642%7Cbd5e44d1-6e27-46db-bbb2-fbfc8828e7b0%7Cedit';

			const result = parseGivingFundCookie(cookieString);

			expect(result).toEqual({
				fundId: '9a599bcb-57b5-475d-915c-f3e2d9c76642',
				uiv: 'bd5e44d1-6e27-46db-bbb2-fbfc8828e7b0',
				action: 'edit'
			});
		});

		it('should decode URL-encoded space characters (%20) in cookie values', () => {
			const cookieString = 'test%20fund%7Cuser%20id%7Ccreate%20action';

			const result = parseGivingFundCookie(cookieString);

			expect(result).toEqual({
				fundId: 'test fund',
				uiv: 'user id',
				action: 'create action'
			});
		});

		it('should handle mixed encoded and non-encoded characters', () => {
			const cookieString = 'normal-id%7C3dae5d91-ef8a-4b8f-bddf-fbd456403c34%7Cedit';

			const result = parseGivingFundCookie(cookieString);

			expect(result).toEqual({
				fundId: 'normal-id',
				uiv: '3dae5d91-ef8a-4b8f-bddf-fbd456403c34',
				action: 'edit'
			});
		});

		it('should handle already decoded cookie strings without issues', () => {
			const cookieString = '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6|3dae5d91-ef8a-4b8f-bddf-fbd456403c34|edit';

			const result = parseGivingFundCookie(cookieString);

			expect(result).toEqual({
				fundId: '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6',
				uiv: '3dae5d91-ef8a-4b8f-bddf-fbd456403c34',
				action: 'edit'
			});
		});

		it('should decode other common URL-encoded characters', () => {
			const cookieString = 'fund%2Bid%7Cuser%40domain%7Caction%3Dcreate';

			const result = parseGivingFundCookie(cookieString);

			expect(result).toEqual({
				fundId: 'fund+id',
				uiv: 'user@domain',
				action: 'action=create'
			});
		});

		it('should handle partially encoded cookie with only some segments encoded', () => {
			const cookieString = '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6%7C3dae5d91-ef8a-4b8f-bddf-fbd456403c34|edit';

			const result = parseGivingFundCookie(cookieString);

			expect(result).toEqual({
				fundId: '1ad925e1-1841-4ea3-b7a5-95853fdd2ee6',
				uiv: '3dae5d91-ef8a-4b8f-bddf-fbd456403c34',
				action: 'edit'
			});
		});
	});
});
