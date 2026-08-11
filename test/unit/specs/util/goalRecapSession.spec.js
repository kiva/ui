import { completedGoalThisSession, markGoalCompletedThisSession } from '#src/util/goalRecapSession';

const makeCookieStore = (initial = {}) => {
	const jar = { ...initial };
	return {
		get: name => jar[name],
		set: (name, value) => { jar[name] = value; },
		jar,
	};
};

describe('goalRecapSession.js', () => {
	it('reports the completion session once it has been marked', () => {
		const cookieStore = makeCookieStore();

		markGoalCompletedThisSession(cookieStore, 2026);

		expect(completedGoalThisSession(cookieStore, 2026)).toBe(true);
	});

	it('sets no expiry, so the mark dies with the browser session', () => {
		const cookieStore = { get: vi.fn(), set: vi.fn() };

		markGoalCompletedThisSession(cookieStore, 2026);

		expect(cookieStore.set).toHaveBeenCalledWith('kv_goal_completed_this_session', '2026', { path: '/' });
	});

	it('does not carry a mark from one goal year to another', () => {
		const cookieStore = makeCookieStore();

		markGoalCompletedThisSession(cookieStore, 2026);

		expect(completedGoalThisSession(cookieStore, 2027)).toBe(false);
	});

	it('reports nothing for a session that never marked a completion', () => {
		expect(completedGoalThisSession(makeCookieStore(), 2026)).toBe(false);
	});

	it('survives a missing cookie store', () => {
		expect(completedGoalThisSession(null, 2026)).toBe(false);
		expect(() => markGoalCompletedThisSession(null, 2026)).not.toThrow();
	});

	it('ignores a missing year rather than marking a bare cookie', () => {
		const cookieStore = { get: vi.fn(), set: vi.fn() };

		markGoalCompletedThisSession(cookieStore, null);

		expect(cookieStore.set).not.toHaveBeenCalled();
	});
});
