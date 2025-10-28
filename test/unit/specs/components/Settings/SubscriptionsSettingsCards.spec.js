import { render } from '@testing-library/vue';
import {
	describe, it, expect, vi, beforeEach
} from 'vitest';
import SubscriptionsSettingsCards from '#src/components/Settings/SubscriptionsSettingsCards';

let mockMutate;
let mockShowTipMsg;

beforeEach(() => {
	mockMutate = vi.fn(() => Promise.resolve({ data: { my: { cancelAutoDeposit: true } } }));
	mockShowTipMsg = vi.fn();
});

const getGlobal = () => ({
	provide: {
		apollo: {
			mutate: mockMutate,
		},
		cookieStore: {},
	},
	mocks: {
		$showTipMsg: mockShowTipMsg,
	},
	stubs: {
		SubscriptionsMonthlyGood: {
			name: 'SubscriptionsMonthlyGood',
			template: '<div class="subscriptions-monthly-good">Monthly Good</div>',
		},
		SubscriptionsAutoDeposit: {
			name: 'SubscriptionsAutoDeposit',
			template: '<div class="subscriptions-auto-deposit">Auto Deposit</div>',
		},
		SubscriptionsLegacy: {
			name: 'SubscriptionsLegacy',
			template: '<div class="subscriptions-legacy">Legacy</div>',
		},
		KvButton: {
			name: 'KvButton',
			props: ['variant', 'state', 'id'],
			template: '<button :id="id" :disabled="state === \'loading\'"><slot /></button>',
		},
		KvLightbox: {
			name: 'KvLightbox',
			props: ['visible', 'title', 'variant'],
			template: `<div v-if="visible" class="kv-lightbox">
				<h2>{{ title }}</h2>
				<div><slot name="controls" /></div>
			</div>`,
		},
		KvLoadingOverlay: {
			name: 'KvLoadingOverlay',
			template: '<div class="kv-loading-overlay"></div>',
		},
	},
});

describe('SubscriptionsSettingsCards.vue', () => {
	it('has name property', () => {
		expect(SubscriptionsSettingsCards.name).toBe('SubscriptionsSettingsCards');
	});

	it('has data properties', () => {
		const data = SubscriptionsSettingsCards.data.call({});
		expect(data.confirmationText).toBe('');
		expect(data.isChanged).toBe(false);
		expect(data.isLegacySubscriber).toBe(false);
		expect(data.isMonthlyGoodSubscriber).toBe(false);
		expect(data.isSaving).toBe(false);
		expect(data.showLightbox).toBe(false);
		expect(data.showLoadingOverlay).toBe(false);
		expect(data.hasModernSub).toBe(false);
	});

	it('has methods', () => {
		expect(SubscriptionsSettingsCards.methods.setUnsavedChanges).toBeDefined();
		expect(SubscriptionsSettingsCards.methods.cancelSubscription).toBeDefined();
		expect(SubscriptionsSettingsCards.methods.showConfirmationPrompt).toBeDefined();
		expect(SubscriptionsSettingsCards.methods.onLeave).toBeDefined();
		expect(SubscriptionsSettingsCards.methods.saveSubscription).toBeDefined();
	});

	it('has mounted lifecycle hook', () => {
		expect(SubscriptionsSettingsCards.mounted).toBeDefined();
	});

	it('has beforeUnmount lifecycle hook', () => {
		expect(SubscriptionsSettingsCards.beforeUnmount).toBeDefined();
	});

	it('renders SubscriptionsMonthlyGood component', () => {
		const { container } = render(SubscriptionsSettingsCards, { global: getGlobal() });
		const component = container.querySelector('.subscriptions-monthly-good');
		expect(component).toBeTruthy();
	});

	it('renders wrapper with correct class', () => {
		const { container } = render(SubscriptionsSettingsCards, { global: getGlobal() });
		const wrapper = container.querySelector('.subscriptions-settings-page');
		expect(wrapper).toBeTruthy();
	});

	it('does not show save button when no changes', () => {
		const { queryByText } = render(SubscriptionsSettingsCards, { global: getGlobal() });
		const saveButton = queryByText('Save');
		expect(saveButton).toBeFalsy();
	});

	it('does not show loading overlay initially', () => {
		const { container } = render(SubscriptionsSettingsCards, { global: getGlobal() });
		const overlay = container.querySelector('.kv-loading-overlay');
		expect(overlay).toBeFalsy();
	});

	it('does not show lightbox initially', () => {
		const { container } = render(SubscriptionsSettingsCards, { global: getGlobal() });
		const lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeFalsy();
	});

	it('renders wrapper with subscriptions-settings-page class', () => {
		const { container } = render(SubscriptionsSettingsCards, { global: getGlobal() });
		const wrapper = container.querySelector('.subscriptions-settings-page');
		expect(wrapper).toBeTruthy();
	});

	it('injects apollo', () => {
		expect(SubscriptionsSettingsCards.inject).toContain('apollo');
	});

	it('injects cookieStore', () => {
		expect(SubscriptionsSettingsCards.inject).toContain('cookieStore');
	});

	it('has apollo query configuration', () => {
		expect(SubscriptionsSettingsCards.apollo.query).toBeDefined();
		expect(SubscriptionsSettingsCards.apollo.preFetch).toBe(true);
		expect(SubscriptionsSettingsCards.apollo.result).toBeDefined();
	});
});
