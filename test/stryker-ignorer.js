import { PluginKind, declareValuePlugin } from '@stryker-mutator/api/plugin';

export const strykerPlugins = [
	declareValuePlugin(PluginKind.Ignore, 'vue/SFC', {
		shouldIgnore(path) {
			// Define the conditions for which you want to ignore mutants
			if (
				path?.node?.callee?.name === 'defineProps'
			) {
				// Return the ignore reason
				return 'defineProps in Vue SFCs should not be mutated.';
			}
			if (
				path?.node?.callee?.name === 'defineEmits'
			) {
				// Return the ignore reason
				return 'defineEmits in Vue SFCs should not be mutated.';
			}
			if (
				path?.node?.callee?.name === 'defineExpose'
			) {
				// Return the ignore reason
				return 'defineExpose in Vue SFCs should not be mutated.';
			}
		}
	}),
	declareValuePlugin(PluginKind.Ignore, 'import.meta.glob', {
		shouldIgnore(path) {
			// Define the conditions for which you want to ignore mutants
			if (
				path?.node?.callee?.property?.name === 'glob'
				&& path?.node?.callee?.object?.type === 'MetaProperty'
				&& path?.node?.callee?.object?.meta?.name === 'import'
				&& path?.node?.callee?.object?.property?.name === 'meta'
			) {
				// Return the ignore reason
				return 'import.meta.glob calls should not be mutated.';
			}
		}
	}),
];
