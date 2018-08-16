import _merge from 'lodash/merge';
import { withClientState } from 'apollo-link-state';
import experiment from './localResolvers/experiment';
import tipMessage from './localResolvers/tipMessage';
import usingTouch from './localResolvers/usingTouch';

export default ({ cache, ...options }) => {
	return withClientState({
		cache,
		..._merge(
			experiment(options),
			tipMessage(options),
			usingTouch(options)
		),
	});
};
