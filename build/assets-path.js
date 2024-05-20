import path from 'path';
import { build } from '../config/index.js';

export default function assetsPath(_path) {
	return path.posix.join(build.assetsSubDirectory, _path);
}
