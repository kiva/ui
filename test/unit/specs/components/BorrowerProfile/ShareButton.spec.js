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
	anonymization: 'none',
	fundraisingPercent: 0.5,
	loanAmount: 1000,
	loanFundraisingInfo: { fundedAmount: 500 },
};

function renderShareButton() {
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
				$route: { path: `/lend/${defaultLoan.id}`, query: {} },
				$filters: {
					...globalOptions.mocks.$filters,
					changeCase: str => str,
				},
			},
			stubs,
		},
		props: {
			loan: defaultLoan,
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
});
