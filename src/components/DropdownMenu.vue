<template>
	<ul :id="name"
		class="f-dropdown dropdown-list"
		data-dropdown-content
		aria-hidden="true"
		tabindex="-1">
		<slot></slot>
	</ul>
</template>

<script>
export default {
	props: {
		name: { type: String, required: true }
	},
};
</script>

<style lang="scss">
// @import 'settings';
// @import 'foundation';
// @include foundation-dropdown-menu;

// ul.dropdown-list {
// 	background-color: $level-two-background;
// 	list-style: none;
//
// 	@media #{$large-up} {
// 		background-color: $white;
// 	}
//
// 	li {
// 		&:hover,
// 		&:focus {
// 			background: none;
// 		}
//
// 		a {
// 			display: block;
// 			padding: 0 1rem;
// 			white-space: nowrap;
// 			line-height: $header-height-small;
// 			font-size: $body-font-size;
// 			color: $kiva-textlink;
// 			text-decoration: none;
// 			border-bottom: rem-calc(1) solid $kiva-stroke-gray;
//
// 			&.active {
// 				color: $dropdown-selected-color;
// 			}
//
// 			&:hover {
// 				text-decoration: underline;
// 				color: $kiva-textlink-hover;
// 			}
//
// 			@media #{$large-up} {
// 				border: none;
//
// 				&.end-section::after {
// 					content: "";
// 					display: block;
// 					background-color: $kiva-stroke-gray;
// 					width: 100%;
// 					height: rem-calc(1);
// 					margin: 0 auto;
// 				}
// 			}
// 		}
// 	}
//
// 	ul {
// 		background-color: $level-three-background;
// 		list-style: none;
// 		margin-left: 0;
//
// 		li a {
// 			border: none;
// 			padding-left: 2.5rem;
// 		}
// 	}
// }
</style>
