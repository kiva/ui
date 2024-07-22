const PHOTO_PATH = 'https://www-kiva-org.freetls.fastly.net/img/';

export default {
	data() {
		return {
			addedLoan: null,
			PHOTO_PATH,
			cartModalVisible: false,
			hasBasket: false,
		};
	},
	computed: {
		basketCount() {
			return this.addedLoan?.basketSize ?? 0;
		}
	},
	methods: {
		handleCartModal(payload) {
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
		}
	},
};
