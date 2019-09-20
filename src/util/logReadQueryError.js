import Raven from 'raven-js';

export default (error, queryType = 'undefined_query_error_type') => {
	console.error(queryType, error);
	Raven.captureException(error, {
		tags: {
			query_error_type: queryType,
		}
	});
};
