/**
 * @description - Helper function to import modules from import.meta.glob()
 *
 * @param {object} glob - result from import.meta.glob()
 * @param {string} rootPath - root path of the glob
 * @returns any - module from glob matching the path
 */
export function metaGlobReader(glob, rootPath) {
	return path => {
		const module = glob?.[`${rootPath}${path}`];
		return module?.default ?? module;
	};
}
