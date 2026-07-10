import vueSnapshotSerializer from 'jest-serializer-vue';

expect.addSnapshotSerializer(vueSnapshotSerializer);

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
