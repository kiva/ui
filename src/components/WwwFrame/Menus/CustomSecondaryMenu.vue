<template>
	<div>
		<secondary-menu class="show-for-large" :uses-exact-paths="usesExactPaths">
			<ul class="row">
				<li v-for="{name, routerLink, url, eventTracking} in menuItems" :key="name">
					<router-link
						:to="routerLink"
						v-kv-track-event="eventTracking"
						v-if="routerLink"
					>
						{{ name }}
					</router-link>
					<a v-else :href="url" v-kv-track-event="eventTracking">{{ name }}</a>
				</li>
			</ul>
		</secondary-menu>
		<div :class="`mobile-nav hide-for-large ${usesExactPaths ? 'exact-path' : 'non-exact-path'}`">
			<button
				@click="toggle"
				aria-controls="secondary-menus-combo-nav"
				:aria-expanded="open ? 'true' : 'false'"
			>
				<span>{{ getSelectedTabName() }}</span>
				<kv-icon name="small-chevron-mobile" />
			</button>
			<kv-expandable easing="ease-in-out">
				<div
					id="secondary-menu-combo-nav"
					v-show="open"
					class="kv-expandable-pane sec-ter-combo-nav"
					:aria-hidden="open ? 'false' : 'true'"
				>
					<ul>
						<li v-for="{name, routerLink, url, eventTracking} in menuItems" :key="name">
							<router-link
								:to="routerLink"
								v-kv-track-event="eventTracking"
								v-if="routerLink"
							>
								{{ name }}
							</router-link>
							<a v-else :href="url" v-kv-track-event="eventTracking">{{ name }}</a>
						</li>
					</ul>
				</div>
			</kv-expandable>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import {
	onBodyTouchstart,
	offBodyTouchstart,
	isTargetElement,
} from '@/util/touchEvents';
import usingTouchClient from '@/graphql/query/shared/usingTouchClient.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import SecondaryMenu from '@/components/WwwFrame/SecondaryMenu';
import KvExpandable from '@/components/Kv/KvExpandable';

export default {
	components: {
		KvIcon,
		SecondaryMenu,
		KvExpandable,
	},
	inject: ['apollo'],
	data() {
		return {
			open: false,
			usingTouch: false,
		};
	},
	props: {
		menuItems: {
			type: Array,
			required: true,
		},
		usesExactPaths: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	apollo: {
		query: usingTouchClient,
		preFetch: true,
		result({ data }) {
			this.usingTouch = !!_get(data, 'usingTouch');
		},
	},
	methods: {
		toggle() {
			if (this.open) {
				this.collapse();
			} else {
				this.expand();
			}
		},
		expand() {
			this.open = true;
			if (this.usingTouch) {
				onBodyTouchstart(this.touchHandler);
			}
		},
		collapse() {
			this.open = false;
			if (this.usingTouch) {
				offBodyTouchstart(this.touchHandler);
			}
		},
		touchHandler(e) {
			if (!isTargetElement(e, this.$el)) {
				this.collapse();
			}
		},
		getSelectedTabName() {
			let selectedTabName = 'Menu';
			this.menuItems.forEach(({ routerLink, name }) => {
				if (this.$route.path === routerLink) {
					selectedTabName = name;
				}
			});
			return selectedTabName;
		},
	}
};
</script>

<style lang="scss">
@import 'settings';

.mobile-nav {
	background-color: $kiva-bg-lightgray;
	margin: 0;

	.sec-ter-combo-nav {
		position: absolute;
		top: rem-calc(90);
		width: 100%;
		z-index: 10;
	}

	ul {
		margin: 0;
		background-color: $kiva-bg-lightgray;
		list-style-type: none;

		li {
			border-bottom: 1px solid $kiva-stroke-gray;

			a,
			a:active,
			a:visited {
				@extend .basic-secondary-menu-active-mobile;
			}
		}
	}

	&.exact-path {
		ul li a.router-link-exact-active {
			@extend .basic-secondary-menu-active-mobile;

			color: $kiva-text-light;
		}
	}

	&.non-exact-path {
		ul li a.router-link-active {
			@extend .basic-secondary-menu-active-mobile;

			color: $kiva-text-light;
		}
	}

	button {
		display: block;
		color: $white;
		font-weight: normal;
		padding: 0 1rem;
		background-color: $kiva-darkgreen;
		width: 100%;
		text-align: left;
		line-height: rem-calc(45);

		&:hover {
			span {
				text-decoration: underline;
			}
		}

		.icon {
			stroke: $white;
			color: $white;
			float: right;
			height: rem-calc(45);
			width: rem-calc(25);
			transition: transform 300ms ease;
		}
	}

	button:focus {
		outline: none;
	}

	button[aria-expanded="true"] {
		.icon {
			transform: rotate(-180deg);
		}
	}
}

.basic-secondary-menu-active-mobile {
	padding: 0 1rem;
	font-weight: normal;
	line-height: rem-calc(45);
}
</style>
