import createContentfulPreviewLink from '../../../../src/api/ContentfulPreviewLink';

vi.mock('@apollo/client/core/index', () => ({
	ApolloLink: vi.fn(handler => ({ handler, request: handler }))
}));

describe('ContentfulPreviewLink.js', () => {
	let mockRoute;
	let mockOperation;
	let mockForward;

	beforeEach(() => {
		mockRoute = {
			query: {}
		};

		mockOperation = {
			operationName: 'contentfulQuery',
			variables: {}
		};

		mockForward = vi.fn(op => op);

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should create an ApolloLink', () => {
		const link = createContentfulPreviewLink({ route: mockRoute });

		expect(link).toBeDefined();
		expect(link.handler).toBeDefined();
	});

	it('should add preview variable when route query has preview=true', () => {
		mockRoute.query.preview = 'true';
		const link = createContentfulPreviewLink({ route: mockRoute });

		link.request(mockOperation, mockForward);

		expect(mockOperation.variables.preview).toBe(true);
		expect(mockForward).toHaveBeenCalledWith(mockOperation);
	});

	it('should not add preview variable when preview is not true', () => {
		mockRoute.query.preview = 'false';
		const link = createContentfulPreviewLink({ route: mockRoute });

		link.request(mockOperation, mockForward);

		expect(mockOperation.variables.preview).toBeUndefined();
		expect(mockForward).toHaveBeenCalledWith(mockOperation);
	});

	it('should not add preview variable when operation is not contentful', () => {
		mockRoute.query.preview = 'true';
		mockOperation.operationName = 'userQuery';
		const link = createContentfulPreviewLink({ route: mockRoute });

		link.request(mockOperation, mockForward);

		expect(mockOperation.variables.preview).toBeUndefined();
		expect(mockForward).toHaveBeenCalledWith(mockOperation);
	});

	it('should not override existing truthy preview variable', () => {
		mockRoute.query.preview = 'true';
		mockOperation.variables.preview = true;
		const link = createContentfulPreviewLink({ route: mockRoute });

		link.request(mockOperation, mockForward);

		expect(mockOperation.variables.preview).toBe(true);
		expect(mockForward).toHaveBeenCalledWith(mockOperation);
	});

	it('should forward operation when route is not provided', () => {
		const link = createContentfulPreviewLink({});

		link.request(mockOperation, mockForward);

		expect(mockOperation.variables.preview).toBeUndefined();
		expect(mockForward).toHaveBeenCalledWith(mockOperation);
	});

	it('should handle lowercase contentful in operation name', () => {
		mockRoute.query.preview = 'true';
		mockOperation.operationName = 'getcontentfulData';
		const link = createContentfulPreviewLink({ route: mockRoute });

		link.request(mockOperation, mockForward);

		expect(mockOperation.variables.preview).toBe(true);
	});
});
