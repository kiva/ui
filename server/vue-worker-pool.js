/* eslint-disable no-new */

const path = require('path');
const { SHARE_ENV } = require('worker_threads');
const workerpool = require('workerpool');
const promClient = require('prom-client');

let pool;

module.exports = function createWorkerPool({ minWorkers, maxWorkers, workerData } = {}) {
	// Terminate the existing pool if it was created
	if (pool) {
		pool.terminate();
	}

	// Create pool of worker threads for Vue rendering
	pool = workerpool.pool(path.resolve(__dirname, 'vue-worker.js'), {
		minWorkers,
		maxWorkers,
		workerType: 'thread',
		workerThreadOpts: {
			workerData,
			env: SHARE_ENV,
		},
	});

	// Track worker pool metrics
	if (!promClient.register.getSingleMetric('vue_total_workers')) {
		new promClient.Gauge({
			name: 'vue_total_workers',
			help: 'Total number of vue worker threads, both busy and idle',
			collect() {
				this.set(pool.stats().totalWorkers);
			}
		});
	}
	if (!promClient.register.getSingleMetric('vue_idle_workers')) {
		new promClient.Gauge({
			name: 'vue_idle_workers',
			help: 'Number of idle vue worker threads',
			collect() {
				this.set(pool.stats().idleWorkers);
			}
		});
	}
	if (!promClient.register.getSingleMetric('vue_busy_workers')) {
		new promClient.Gauge({
			name: 'vue_busy_workers',
			help: 'Number of busy vue worker threads',
			collect() {
				this.set(pool.stats().busyWorkers);
			}
		});
	}
	if (!promClient.register.getSingleMetric('vue_pending_tasks')) {
		new promClient.Gauge({
			name: 'vue_pending_tasks',
			help: 'Total number of pending tasks in the vue worker pool',
			collect() {
				this.set(pool.stats().pendingTasks);
			}
		});
	}
	if (!promClient.register.getSingleMetric('vue_active_tasks')) {
		new promClient.Gauge({
			name: 'vue_active_tasks',
			help: 'Total number of active tasks in the vue worker pool',
			collect() {
				this.set(pool.stats().activeTasks);
			}
		});
	}

	return pool;
};
