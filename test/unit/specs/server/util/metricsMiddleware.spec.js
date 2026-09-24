// @vitest-environment node
import express from 'express';
import promClient from 'prom-client';
import createMetricsMiddleware from '#server/util/metricsMiddleware';

describe('metricsMiddleware', () => {
	let server;
	let baseUrl;

	beforeAll(async () => {
		const app = express();
		app.use(createMetricsMiddleware());
		app.get('*', (req, res) => res.send('ok'));
		await new Promise(resolve => {
			server = app.listen(0, resolve);
		});
		baseUrl = `http://localhost:${server.address().port}`;
	});

	afterAll(() => {
		server.close();
		promClient.register.clear();
	});

	it('exposes one request duration series per method and status code across paths', async () => {
		await fetch(`${baseUrl}/lend/123`);
		await fetch(`${baseUrl}/lender/some-lender`);
		await fetch(`${baseUrl}/checkout`);

		const metrics = await (await fetch(`${baseUrl}/metrics`)).text();

		expect(metrics).not.toMatch(/^http_request_duration_seconds_\w+\{[^}]*path=/m);
		expect(metrics).toContain('http_request_duration_seconds_count{status_code="200",method="GET"} 3');
	});
});
