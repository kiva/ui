export default function Experiment({ id, version = null }) {
	return {
		id,
		version,
		__typename: 'Experiment',
	};
}
