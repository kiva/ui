<template>
	<div class="the-mg-exp-menu">
		<div class="the-mg-exp-menu__desktop show-for-large">
			<router-link
				to="/monthlygood"
				class="header-button"
				v-kv-track-event="['TopNav','click-mg-exp-cause', 'Find a Cause']"
			>
				<span>Find a Cause</span>
			</router-link>
			<router-link
				:id="borrowerMenuId"
				to="/lend-by-category"
				class="header-button"
				v-kv-track-event="['TopNav','click-mg-exp-borrower', 'Find a Borrower']"
			>
				<span>Find a Borrower <kv-icon class="triangle-icon" name="triangle" :from-sprite="true" /></span>
			</router-link>
			<kv-dropdown
				:controller="borrowerMenuId"
				@show="onBorrowerMenuShow"
			>
				<slot name="lendmenu">
				</slot>
			</kv-dropdown>
		</div>
		<div class="the-mg-exp-menu__mobile hide-for-large">
			<slot name="lendmenu">
			</slot>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvDropdown from '@/components/Kv/KvDropdown';

export default {
	components: {
		KvDropdown,
		KvIcon,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			borrowerMenuId: 'borrower-header-dropdown',
		};
	},
	methods: {
		onBorrowerMenuShow() {
			// get the ref from parent component filling in slot
			this.$scopedSlots?.lendmenu()[0]?.context?.$refs?.lendMenu.onOpen();
			this.$kvTrackEvent('TopNav', 'hover-Borrower-menu', 'Find a Borrower');
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.the-mg-exp-menu {
	&__desktop {
		// width of the-lend-menu
		width: rem-calc(443);
		display: flex;
		height: rem-calc(51);

		.header-button {
			flex: 1;
			color: $kiva-accent-blue;
		}

		.header-button:first-child {
			border-right: 1px solid $light-gray;
		}

		.triangle-icon {
			fill: $kiva-accent-blue;
		}

		::v-deep {
			div.dropdown-pane.is-open {
				// hack to move the secondary dropdown left
				left: -223px !important;
				width: rem-calc(445);
			}
		}
	}
}
</style>
