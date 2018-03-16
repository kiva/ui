<template>
	<ul class="lend-list-menu hide-for-large-up">
	</ul>
</template>

<script>
export default {
};
</script>

<style lang="scss">
@import 'settings';

// .lend-list-menu {
// 	$row-height: $header-height-small - 1rem;
//
// 	list-style: none;
// 	margin: 0;
// 	background-color: $level-one-background;
//
// 	li a {
// 		font-size: $body-font-size;
// 		padding: 0.5rem 1rem;
// 		line-height: $row-height;
// 		border-bottom: 1px solid $kiva-stroke-gray;
// 		color: $kiva-text-dark;
// 		text-decoration: none;
//
// 		&:hover {
// 			color: $kiva-text-dark;
// 		}
//
// 		&.section-title {
// 			color: $kiva-text-dark;
// 			text-decoration: none;
// 		}
//
// 		&.disabled {
// 			text-decoration: none;
// 			color: $gray;
//
// 			&:hover {
// 				color: $gray;
// 			}
// 		}
//
// 		&[aria-expanded="false"] .open {
// 			display: none;
// 		}
//
// 		&[aria-expanded="true"] {
// 			color: $dropdown-selected-color;
//
// 			.icon {
// 				transform: rotate(-180deg);
// 			}
// 		}
//
// 		.icon {
// 			float: right;
// 			height: 1.5rem;
// 			width: rem-calc(25);
// 			transition: transform 300ms ease;
// 		}
// 	}
//
// 	ul {
// 		background-color: $level-two-background;
//
// 		&[aria-hidden="true"] {
// 			height: 0;
// 		}
//
// 		li a {
// 			padding-left: 2rem;
// 		}
//
// 		ul {
// 			background-color: $level-three-background;
//
// 			li {
// 				a {
// 					padding-left: 3rem;
// 					border: none;
// 				}
//
// 				&:last-child {
// 					border-bottom: 1px solid $kiva-stroke-gray;
// 				}
// 			}
// 		}
// 	}
// }
</style>
