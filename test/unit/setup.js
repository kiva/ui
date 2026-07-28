/* eslint-disable import/no-extraneous-dependencies */
import vueSnapshotSerializer from 'jest-serializer-vue';
import { config } from '@vue/test-utils';

expect.addSnapshotSerializer(vueSnapshotSerializer);

// Suite-wide defaults so specs don't have to opt in to the basics. Anything a
// spec passes in its own `global` block merges on top of (and wins over) these.
//
// Three constraints on what may go here:
// 1. Stateless only. `clearMocks` is off and setup runs once per file, so a
//    shared spy would leak assertions between tests.
// 2. No `#src` imports. They load app modules before a spec's `vi.mock()` can
//    apply — importing KvAuth0 here broke syncDate.spec.js, which mocks
//    `timesync`, because KvAuth0 imports syncDate.
// 3. Nothing that a spec might also install as a plugin. Registering RouterLink
//    or providing vue-router's routerKey globally collides with the specs that
//    build a real router (Vue warns "already registered" and the real
//    <router-link> stops rendering an anchor). Those live in specUtils.js as
//    opt-in helpers instead.
config.global.directives = {
	...config.global.directives,
	kvTrackEvent: () => {},
};

config.global.provide = {
	...config.global.provide,
	apollo: {
		readFragment: () => {},
		query: () => Promise.resolve({}),
		readQuery: () => {},
		mutate: () => Promise.resolve({}),
	},
};

// Mirror index.html so components that `<Teleport to="#teleports">` (lightboxes)
// have a valid target when rendered. Guarded because some specs run in the node
// environment or stub `document`, where these DOM APIs aren't available.
beforeEach(() => {
	if (typeof document !== 'undefined'
		&& typeof document.getElementById === 'function'
		&& document.body
		&& !document.getElementById('teleports')) {
		const teleportTarget = document.createElement('div');
		teleportTarget.id = 'teleports';
		document.body.appendChild(teleportTarget);
	}
});
