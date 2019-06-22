import _toPairs from 'lodash/toPairs';

const simpleObjectToString = simpleObject => _toPairs(simpleObject)
	.map(([key, value]) => `${key}:${value}`)
	.join('; ');

export default error => console.error(new Error(`readQuery failed: ${simpleObjectToString(error)}`));
