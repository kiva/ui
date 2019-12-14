export default (error, queryType = 'undefined_query_error_type') => {
	console.error(queryType, error);
};
