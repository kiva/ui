import { CacheControl } from '@tusbar/cache-control';

export default class CDNHelper {
	constructor() {
		this.cacheControl = new CacheControl();
		this.tags = new Set();
	}

	addTags(tags) {
		if (Array.isArray(tags)) {
			tags.forEach(tag => this.tags.add(tag));
		}
		return this;
	}

	set(key, value) {
		if (Object.prototype.hasOwnProperty.call(this.cacheControl, key)) {
			this.cacheControl[key] = value;
		}
		return this;
	}

	setNumeric(key, value) {
		if (Object.prototype.hasOwnProperty.call(this.cacheControl, key) && typeof value === 'number') {
			const currentValue = this.cacheControl[key];
			if (currentValue === null
				|| currentValue === undefined
				|| value < currentValue
			) {
				this.cacheControl[key] = value;
			}
		}
		return this;
	}

	private() {
		this.cacheControl.private = true;
		this.cacheControl.public = false;
		return this;
	}

	public() {
		if (!this.cacheControl.private) {
			this.cacheControl.public = true;
		}
		return this;
	}
}
