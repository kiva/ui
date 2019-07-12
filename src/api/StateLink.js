import _merge from 'lodash/merge';
import { withClientState } from 'apollo-link-state';
import experiment from './localResolvers/experiment';
import tipMessage from './localResolvers/tipMessage';
import usingTouch from './localResolvers/usingTouch';
import basketAddInterstitial from './localResolvers/addToBasketInterstitial';
import activeLoan from './localResolvers/activeLoan';
import my from './localResolvers/my';

export default ({ cache, ...options }) => {
	return withClientState({
		cache,
		..._merge(
			experiment(options),
			tipMessage(options),
			usingTouch(options),
			basketAddInterstitial(options),
			activeLoan(options),
			my(options),
		),
	});
};
