import { ref, onUnmounted } from 'vue';
import { createIntersectionObserver } from '#src/util/observerUtils';

export default () => {
	const observer = ref(null);

	const delayUntilVisible = (callback, elements) => {
		const targets = elements ?? [];
		observer.value = createIntersectionObserver({
			targets,
			callback: entries => {
				entries.forEach(entry => {
					if (entry.intersectionRatio > 0) {
						callback(entry);
					}
				});
			}
		});
		if (!observer.value) {
			callback();
		}
	};

	onUnmounted(() => {
		if (observer.value) {
			observer.value.disconnect();
		}
	});

	return { delayUntilVisible };
};
