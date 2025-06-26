import { v4 as uuidv4 } from 'uuid';

export default function setVisitorIdCookie(cookieStore) {
	// Create random visitor id if none is set
	if (!cookieStore.has('uiv')) {
		// Set visitor id cookie expiration for 2 years from now
		const expires = new Date();
		expires.setFullYear(expires.getFullYear() + 2);
		// Store visitor id as 'uiv' cookie
		cookieStore.set('uiv', uuidv4(), {
			expires,
			sameSite: true,
			secure: true,
			path: '/',
		});
	}
}
