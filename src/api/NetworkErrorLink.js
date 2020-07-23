import { onError } from 'apollo-link-error';
import logFormatter from '@/util/logFormatter';

export default () => {
	return onError(({
		networkError,
		operation,
		forward
	}) => {
		if (networkError) {
			logFormatter(operation, 'error');
			logFormatter(networkError, 'error');
		}
		forward();
	});
};
