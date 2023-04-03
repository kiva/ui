import { createIntersectionObserver } from '@/util/observerUtils';

export default {
	data() {
		return {
			delayUntilVisibleObserver: null,
		};
	},
	methods: {
		delayUntilVisible(callback, elements) {
			const targets = elements ?? [this.$el];
			// Watch for this element being in the viewport
			this.delayUntilVisibleObserver = createIntersectionObserver({
				targets,
				callback: entries => {
					entries.forEach(entry => {
						if (entry.intersectionRatio > 0) {
							// This element is in the viewport, so call the callback.
							callback(entry);
						}
					});
				}
			});
			if (!this.delayUntilVisibleObserver) {
				// Observer was not created, so call the calback right away.
				callback();
			}
		}
	},
	beforeDestroy() {
		if (this.delayUntilVisibleObserver) {
			this.delayUntilVisibleObserver.disconnect();
		}
	},
};
