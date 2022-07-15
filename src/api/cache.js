import { InMemoryCache } from '@apollo/client';
import activeLoan from './localResolvers/activeLoan';
import addToBasketInterstitial from './localResolvers/addToBasketInterstitial';
import autolending from './localResolvers/autolending';
import experimentVersion from './localResolvers/experiment';
import loan from './localResolvers/loan';
import loanSearch from './localResolvers/loanSearch';
import my from './localResolvers/my';
import tipMessage from './localResolvers/tipMessage';
import usingTouch from './localResolvers/usingTouch';
import verificationLightbox from './localResolvers/verificationLightbox';

export default new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				handleActiveLoan: {
					read() {
						return activeLoan();
					}
				},
				handleAddToBasket: {
					read() {
						return addToBasketInterstitial();
					}
				},
				handleAutolending: {
					read() {
						return autolending();
					}
				},
				handleLoan: {
					read() {
						return loan();
					}
				},
				handleLoanSearch: {
					read() {
						return loanSearch();
					}
				},
				handleMy: {
					read(options) {
						return my(options);
					}
				},
				handleExperimentVersion: {
					read(options) {
						return experimentVersion(options);
					}
				},
				handleTipMessage: {
					read() {
						return tipMessage();
					}
				},
				handleUsingTouch: {
					read() {
						return usingTouch();
					}
				},
				handleVerificationLightbox: {
					read() {
						return verificationLightbox();
					}
				}
			}
		}
	}
});
