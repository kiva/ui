/* eslint-disable no-new */
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { SHARE_ENV } from 'worker_threads';
import { Piscina, FixedQueue } from 'piscina';
import promClient from 'prom-client';

let pool;
export default function createWorkerPool({
	idleTimeout,
	minWorkers,
	maxWorkers,
	workerData
} = {}) {
	// Terminate the existing pool if it was created
	if (pool) {
		pool.destroy();
	}

	// Create pool of worker threads for Vue rendering
	pool = new Piscina({
		filename: resolve(dirname(fileURLToPath(import.meta.url)), 'vue-worker.js'),
		taskQueue: new FixedQueue(),
		idleTimeout,
		minThreads: minWorkers,
		maxThreads: maxWorkers,
		workerData,
		env: SHARE_ENV,
	});

	// Track worker pool metrics
	if (!promClient.register.getSingleMetric('vue_total_workers')) {
		new promClient.Gauge({
			name: 'vue_total_workers',
			help: 'Total number of vue worker threads, both busy and idle',
			collect() {
				this.set(pool.threads.length);
			}
		});
	}
	// if (!promClient.register.getSingleMetric('vue_idle_workers')) {
	// 	new promClient.Gauge({
	// 		name: 'vue_idle_workers',
	// 		help: 'Number of idle vue worker threads',
	// 		collect() {
	// 			this.set(pool.stats().idleWorkers);
	// 		}
	// 	});
	// }
	// if (!promClient.register.getSingleMetric('vue_busy_workers')) {
	// 	new promClient.Gauge({
	// 		name: 'vue_busy_workers',
	// 		help: 'Number of busy vue worker threads',
	// 		collect() {
	// 			this.set(pool.stats().busyWorkers);
	// 		}
	// 	});
	// }
	if (!promClient.register.getSingleMetric('vue_pending_tasks')) {
		new promClient.Gauge({
			name: 'vue_pending_tasks',
			help: 'Total number of pending tasks in the vue worker pool',
			collect() {
				this.set(pool.queueSize);
			}
		});
	}
	// if (!promClient.register.getSingleMetric('vue_active_tasks')) {
	// 	new promClient.Gauge({
	// 		name: 'vue_active_tasks',
	// 		help: 'Total number of active tasks in the vue worker pool',
	// 		collect() {
	// 			this.set(pool.stats().activeTasks);
	// 		}
	// 	});
	// }

	// TODO: could be tracking completed, duration, needsDrain, runTime, utilization, waitTime
	// see https://github.com/piscinajs/piscina

	return pool;
}
