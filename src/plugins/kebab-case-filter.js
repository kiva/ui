export default value => {
	return value.toString()
		.toLowerCase()
		.trim()
		.replace(/&/g, '-and-')
		.replace(/[\s\W-]+/g, '-')
		.replace(/--+/g, '-')
		.replace(/^-+|-+$/g, '');
};
