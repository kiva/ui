<template>
	<kv-dropdown-content name="lend-dropdown">
		<lend-list-menu />
		<lend-mega-menu />
	</kv-dropdown-content>
</template>

<script>
import KvDropdownContent from '@/components/Kv/Dropdown/KvDropdownContent';
import LendListMenu from './LendListMenu';
import LendMegaMenu from './LendMegaMenu';

export default {
	components: {
		KvDropdownContent,
		LendListMenu,
		LendMegaMenu,
	},
};
</script>

<style lang="scss">
@import 'settings';

// .lend-list-menu,
// .lend-mega-menu {
// 	& *[aria-hidden="true"] {
// 		display: none;
// 	}
//
// 	ul {
// 		list-style: none;
// 		margin: 0;
// 	}
//
// 	li {
// 		&:hover,
// 		&:focus {
// 			background: none;
// 		}
//
// 		a {
// 			color: $kiva-textlink;
//
// 			&:focus {
// 				text-decoration: none;
// 			}
//
// 			&:hover {
// 				color: $kiva-textlink-hover;
// 			}
//
// 			.f16 {
// 				margin-right: 0.25rem;
// 			}
//
// 			&.disabled {
// 				text-decoration: none;
// 				color: $gray;
//
// 				&:hover {
// 					color: $gray;
// 					cursor: text;
// 				}
// 			}
// 		}
// 	}
// }
</style>
