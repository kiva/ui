export default value => {
	return String(value)
		.toLowerCase()
		.trim()
		// convert & to -and-
		.replace(/&/g, '-and-')
		// convert whitespace to dashes
		.replace(/[\s\W-]+/g, '-')
		// remove duplicate dashes
		.replace(/--+/g, '-')
		// trim dashes from start and end of the string
		.replace(/^-+|-+$/g, '');
};
