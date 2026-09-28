import {
	context as otelContext,
	propagation,
	trace,
} from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import * as mockTrace from '#server/util/mockTrace';
import createMiddleware from '#server/vue-middleware';
import * as vueRender from '#server/vue-render';
import { HOME_PAGE_EXPERIMENT_HEADER } from '#src/util/experiment/fastlyExperimentUtils';

describe('vue-middleware.js', () => {
	let req; let res; let next; let config; let vite; let middleware;
	let vueRenderSpy;

	beforeEach(() => {
		vi.resetAllMocks();
		vueRenderSpy = vi.spyOn(vueRender, 'default');
		req = {
			url: '/test',
			get: vi.fn(header => {
				if (header === 'Cookie') return 'kvls=testcookie';
				if (header === 'User-Agent') return 'TestAgent';
				if (header === 'Fastly-Top-Url') return 'https://test.com';
				if (header === 'Fastly-Noted-Logged-In') return 'true';
				return undefined;
			}),
			headers: { [`${HOME_PAGE_EXPERIMENT_HEADER.toLowerCase()}`]: 'b' },
			user: {},
			locale: 'en',
			session: {},
		};
		res = {
			setHeader: vi.fn(),
			append: vi.fn(),
			send: vi.fn(),
		};
		next = vi.fn();

		config = {
			app: {
				locale: {
					supported: ['en'],
					default: 'en',
				},
			},
			server: {
				simulateCDN: false,
				userAgent: 'TestUserAgent',
				vueWorkerIdleTimeout: 1000,
				minVueWorkers: 1,
				maxVueWorkers: 2,
				vueWorkerRecordTiming: false,
			},
		};

		vite = {
			transformIndexHtml: vi.fn().mockResolvedValue('<html></html>'),
			ssrLoadModule: vi.fn().mockResolvedValue({ default: vi.fn() }),
		};

		vi.spyOn(mockTrace, 'wrap').mockImplementation((name, fn) => {
			// eslint-disable-next-line func-names
			return async function (_req, _res, _next) {
				return fn(_req, _res, _next);
			};
		});

		middleware = createMiddleware({ config, vite });
	});

	it(`should persist fastly "${HOME_PAGE_EXPERIMENT_HEADER}" header`, async () => {
		vueRenderSpy.mockReturnValueOnce({
			html: '<html>Test</html>',
			setCookies: ['cookie1=value1'],
		});

		await middleware(req, res, next);

		expect(vueRenderSpy).toHaveBeenCalledTimes(1);
		expect(vueRenderSpy).toHaveBeenCalledWith(expect.objectContaining({
			context: expect.objectContaining({
				forceHeader: 'b'
			})
		}));
		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html');
		expect(res.append).toHaveBeenCalledWith('Set-Cookie', 'cookie1=value1');
		expect(res.send).toHaveBeenCalledWith('<html>Test</html>');
	});

	it(
		`should not forward forceHeader if fastly "${HOME_PAGE_EXPERIMENT_HEADER}" header is not coming`,
		async () => {
			vueRenderSpy.mockReturnValueOnce({
				html: '<html>Test</html>',
				setCookies: ['cookie1=value1'],
			});
			req = {
				...req,
				headers: {},
			};

			await middleware(req, res, next);

			expect(vueRenderSpy).toHaveBeenCalledTimes(1);
			expect(vueRenderSpy).toHaveBeenCalledWith(expect.objectContaining({
				context: expect.objectContaining({
					forceHeader: undefined
				})
			}));
		}
	);

	describe('trace context', () => {
		const TRACE_ID = '0af7651916cd43dd8448eb211c80319c';
		const SPAN_ID = 'b7ad6b7169203331';

		afterEach(() => {
			trace.disable();
			propagation.disable();
			otelContext.disable();
		});

		it('should hand the render a trace context carrier', async () => {
			new NodeTracerProvider().register();
			vueRenderSpy.mockReturnValueOnce({ html: '<html>Test</html>' });

			await middleware(req, res, next);

			const { context } = vueRenderSpy.mock.calls[0][0];
			expect(context.traceContext.traceparent).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-0[01]$/);
		});

		it('should continue a trace the edge forwarded', async () => {
			new NodeTracerProvider().register();
			req.headers.traceparent = `00-${TRACE_ID}-${SPAN_ID}-01`;
			vueRenderSpy.mockReturnValueOnce({ html: '<html>Test</html>' });

			await middleware(req, res, next);

			const { context } = vueRenderSpy.mock.calls[0][0];
			expect(context.traceContext.traceparent).toContain(TRACE_ID);
		});

		it('should render without trace headers when no tracer provider is registered', async () => {
			vueRenderSpy.mockReturnValueOnce({ html: '<html>Test</html>' });

			await middleware(req, res, next);

			const { context } = vueRenderSpy.mock.calls[0][0];
			expect(context.traceContext).toEqual({});
			expect(res.send).toHaveBeenCalledWith('<html>Test</html>');
		});
	});

	// TODO: Add more tests (as our code coverage is low at the moment)
});
