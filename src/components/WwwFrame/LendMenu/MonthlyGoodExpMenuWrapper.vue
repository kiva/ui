<template>
	<div class="the-mg-exp-menu">
		<div class="the-mg-exp-menu__desktop show-for-large">
			<router-link
				to="/monthlygood"
				class="header-button"
				v-kv-track-event="['TopNav','click-mg-exp-cause', 'Find a cause']"
			>
				<span>Find a cause</span>
			</router-link>
			<router-link
				:id="borrowerMenuId"
				to="/lend-by-category"
				class="header-button"
				v-kv-track-event="['TopNav','click-mg-exp-borrower', 'Find a borrower']"
			>
				<span>Find a borrower <kv-icon class="triangle-icon" name="triangle" :from-sprite="true" /></span>
			</router-link>
			<kv-dropdown
				:controller="borrowerMenuId"
				@show="onBorrowerMenuShow"
				@hide="onBorrowerMenuHide"
				@show.once="onLoad"
			>
				<the-lend-menu ref="lendMenuDesktop" />
			</kv-dropdown>
		</div>
		<div class="the-mg-exp-menu__mobile hide-for-large">
			<the-lend-menu ref="lendMenuMobile" />
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvDropdown from '@/components/Kv/KvDropdown';
import TheLendMenu from '@/components/WwwFrame/LendMenu/TheLendMenu';

export default {
	name: 'MonthlyGoodExpMenuWrapper',
	components: {
		KvDropdown,
		KvIcon,
		TheLendMenu,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			borrowerMenuId: 'borrower-header-dropdown',
		};
	},
	methods: {
		onBorrowerMenuShow() {
			this.$kvTrackEvent('TopNav', 'hover-Borrower-menu', 'Find a borrower');
		},
		onBorrowerMenuHide() {
			this.$refs.lendMenuDesktop.onClose();
		},
		onLoad() {
			this.$refs.lendMenuDesktop.onLoad();
			this.$refs.lendMenuMobile.onLoad();
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.the-mg-exp-menu {
	&__desktop {
		// width of the-lend-menu
		width: rem-calc(507);
		display: flex;
		height: rem-calc(51);

		.header-button {
			flex: 1;
			color: rgb(var(--text-action));
			border-right: 0;

			&:hover {
				background-color: $kiva-bg-darkgray;
				text-decoration: none;
				color: rgb(var(--text-action-highlight));
			}
		}

		.header-button:first-child {
			border-right: 1px solid $light-gray;
		}

		.triangle-icon {
			fill: rgb(var(--text-action));
		}

		::v-deep {
			div.dropdown-pane.is-open {
				// hack to move the secondary dropdown left
				left: -255px !important;
				width: rem-calc(509);
			}
		}
	}
}
</style>
