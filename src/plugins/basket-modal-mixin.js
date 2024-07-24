const PHOTO_PATH = 'https://www-kiva-org.freetls.fastly.net/img/';

export default {
	data() {
		return {
			addedLoan: null,
			PHOTO_PATH,
			cartModalVisible: false,
			hasBasket: false,
			modalPosition: { top: '0', right: '0' },
		};
	},
	computed: {
		basketCount() {
			return this.addedLoan?.basketSize ?? 0;
		}
	},
	methods: {
		handleCartModal(payload) {
			const { basketPosition, headerPosition } = this.getTargetsPosition();
			this.modalPosition = {
				top: `${headerPosition.bottom}`,
				right: `${window.innerWidth - basketPosition.right - 200}`, // 200 to be in the middle of the basket
			};
			this.hasBasket = payload?.basketSize > 0;
			this.addedLoan = { ...payload };
			this.cartModalVisible = true;
		},
		closeCartModal(closedBy) {
			this.cartModalVisible = false;
			this.addedLoan = null;
			const { type } = closedBy;
			if (type) {
				this.$kvTrackEvent('basket', 'dismiss', 'basket-modal', type);
				this.handleRedirect(type);
			}
		},
		handleRedirect(type) {
			if (type === 'view-basket') {
				this.$router.push({ path: '/basket' });
			}
		},
		getTargetsPosition() {
			const target = document.getElementById('basket-exp');
			const header = document.getElementsByTagName('header')[0];
			return {
				basketPosition: target.getBoundingClientRect(),
				headerPosition: header.getBoundingClientRect(),
			};
		},
	},
};
