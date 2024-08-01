import { onError } from '@apollo/client/link/error/index';
import logFormatter from '#src/util/logFormatter';

export default () => {
	return onError(({
		networkError,
		operation,
		forward
	}) => {
		// we log the network error and continue on to retry which doesn't provide a way to log the error
		if (networkError) {
			logFormatter(`Apollo network error: ${networkError}`, 'error', { operation, networkError });
		}
		forward();
	});
};
