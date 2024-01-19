/* eslint-disable no-new */

const path = require('path');
const { SHARE_ENV } = require('worker_threads');
const workerpool = require('workerpool');
const promClient = require('prom-client');

module.exports = function createWorkerPool(workerData) {
	// Create pool of worker threads for Vue rendering
	const pool = workerpool.pool(path.resolve(__dirname, 'vue-worker.js'), {
		workerType: 'thread',
		workerThreadOpts: {
			workerData,
			env: SHARE_ENV,
		},
	});

	// Track worker pool metrics
	new promClient.Gauge({
		name: 'vue_total_workers',
		help: 'Total number of vue worker threads, both busy and idle',
		collect() {
			this.set(pool.stats().totalWorkers);
		}
	});
	new promClient.Gauge({
		name: 'vue_idle_workers',
		help: 'Number of idle vue worker threads',
		collect() {
			this.set(pool.stats().idleWorkers);
		}
	});
	new promClient.Gauge({
		name: 'vue_busy_workers',
		help: 'Number of busy vue worker threads',
		collect() {
			this.set(pool.stats().busyWorkers);
		}
	});
	new promClient.Gauge({
		name: 'vue_pending_tasks',
		help: 'Total number of pending tasks in the vue worker pool',
		collect() {
			this.set(pool.stats().pendingTasks);
		}
	});
	new promClient.Gauge({
		name: 'vue_active_tasks',
		help: 'Total number of active tasks in the vue worker pool',
		collect() {
			this.set(pool.stats().activeTasks);
		}
	});

	return pool;
};
