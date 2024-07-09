import { RetryLink } from '@apollo/client/link/retry';

export default ({
	activateRetry = false,
	// Note 1 here means retries will not occur, bumping to 2 will attempt 1 retry
	attemptsMax = 1,
}) => {
	return new RetryLink({
		attempts: {
			max: attemptsMax,
			// eslint-disable-next-line no-unused-vars
			retryIf: (error, _operation) => !!error && activateRetry,
		}
	});
};
