const PHOTO_PATH = 'https://www-kiva-org.freetls.fastly.net/img/';

export default {
	data() {
		return {
			addedLoan: null,
			PHOTO_PATH,
			cartModalVisible: false,
			hasBasket: false,
			modalPosition: { right: '0' },
		};
	},
	computed: {
		basketCount() {
			return this.addedLoan?.basketSize ?? 0;
		}
	},
	methods: {
		handleCartModal(payload) {
			const position = this.getTargetPosition();
			this.modalPosition = {
				right: `${window.innerWidth - position.right - 200}`, // 200 to be almost in the middle of the basket
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
		getTargetPosition() {
			const target = document.getElementById('basket-exp');
			return target.getBoundingClientRect();
		},
	},
};
