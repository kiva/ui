import CDNHelper from '#src/util/CDNHelper';

let helper;

export default function useCDNHeaders(callback) {
	// Ensure this function is only executed in a server-side context
	if (typeof window !== 'undefined') {
		return;
	}
	// Initialize the CDNHelper instance if it doesn't exist
	if (!helper) {
		helper = new CDNHelper();
	}
	// Execute the callback with the CDNHelper instance
	if (typeof callback === 'function') {
		callback(helper);
	}
}

export function getCDNHelper() {
	return helper;
}
