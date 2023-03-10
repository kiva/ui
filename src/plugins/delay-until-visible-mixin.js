import { createIntersectionObserver } from '@/util/observerUtils';

export default {
	data() {
		return {
			delayUntilVisibleObserver: null,
		};
	},
	methods: {
		delayUntilVisible(callback, element) {
			const el = element ?? this.$el;
			// Watch for this element being in the viewport
			this.delayUntilVisibleObserver = createIntersectionObserver({
				targets: [el],
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === el && entry.intersectionRatio > 0) {
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
