import logFormatter from './logFormatter';

export default (error, queryType = 'undefined_query_error_type') => {
	logFormatter(`${queryType}: ${error.stack}`, 'error');
};
