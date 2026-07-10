import { render, fireEvent } from '@testing-library/vue';
import ShareButton from '#src/components/BorrowerProfile/ShareButton';
import { globalOptions } from '../../../specUtils';

const stubs = {
	KvSocialShareButton: {
		template: `<div>
			<button data-testid="bp-share-cta-button" @click="handleClick">
				<slot>Share</slot>
			</button>
			<div v-if="visible" data-testid="share-options">
				<span>Facebook</span>
				<span>LinkedIn</span>
			</div>
			<slot name="modal-content"></slot>
		</div>`,
		props: [
			'modalTitle', 'shareMessage', 'shareUrl', 'variant',
			'utmCampaign', 'utmContent', 'openLightbox', 'loanId',
			'trackingCategory',
		],
		emits: ['lightbox-closed', 'click'],
		data() {
			return { visible: false };
		},
		methods: {
			handleClick() {
				this.visible = true;
			},
		},
	},
};

const defaultLoan = {
	id: 123,
	name: 'Maria',
	anonymizationLevel: 'none',
	fundraisingPercent: 0.5,
	loanAmount: 1000,
	loanFundraisingInfo: { fundedAmount: 500 },
};

function renderShareButton(loanOverride = {}) {
	const loan = { ...defaultLoan, ...loanOverride };
	const Component = {
		...ShareButton,
		data() {
			return {
				...ShareButton.data.call(this),
				borrowedLoanId: null,
			};
		},
		created() {
			this.modifiedShareMessage = this.shareMessage;
		},
	};

	return render(Component, {
		global: {
			...globalOptions,
			mocks: {
				...globalOptions.mocks,
				$route: { path: `/lend/${loan.id}`, query: {} },
				$filters: {
					...globalOptions.mocks.$filters,
					changeCase: str => str,
				},
			},
			stubs,
		},
		props: {
			loan,
			campaign: 'social_share_bp',
		},
	});
}

describe('ShareButton', () => {
	it('click share button renders share options', async () => {
		const { getByTestId } = renderShareButton();
		await fireEvent.click(getByTestId('bp-share-cta-button'));

		expect(getByTestId('share-options')).toBeTruthy();
	});

	it('suppresses the borrower name in modal copy when anonymizationLevel is full', async () => {
		const { getByTestId, container } = renderShareButton({ anonymizationLevel: 'full' });

		await fireEvent.click(getByTestId('bp-share-cta-button'));

		// Modal copy uses `this.name`, which must fall through to "this lender"
		// when the loan is fully anonymized (ShareButton.vue:148–153).
		const shareTextarea = container.querySelector('textarea');
		expect(shareTextarea).not.toBeNull();
		expect(shareTextarea.value).not.toMatch(/Maria/);
		expect(shareTextarea.value).toMatch(/this lender/);
	});
});
