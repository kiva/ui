import * as Sentry from '@sentry/browser';

export default (error, queryType = 'undefined_query_error_type') => {
	console.error(queryType, error);
	Sentry.withScope(scope => {
		scope.setTag('query_error_type', queryType);
		Sentry.captureException(error);
	});
};
