import { RetryLink } from '@apollo/client/link/retry';

export default () => {
	return new RetryLink();
};
