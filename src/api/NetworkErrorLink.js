import { onError } from 'apollo-link-error';
import logFormatter from '@/util/logFormatter';

export default () => {
	return onError(({
		networkError,
		operation,
		forward
	}) => {
		if (networkError) {
			logFormatter(`Apollo network error: ${networkError}`, 'error', { operation, networkError });
		}
		forward();
	});
};
