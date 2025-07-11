<template>
	<div>
		<secondary-menu class="show-for-large">
			<ul class="row">
				<li v-for="{name, routerLink, url} in menuItems" :key="name">
					<router-link
						:to="routerLink"
						v-if="routerLink"
					>
						{{ name }}
					</router-link>
					<a v-else :href="url">{{ name }}</a>
				</li>
			</ul>
		</secondary-menu>
		<div class="mobile-nav hide-for-large exact-path">
			<button
				@click="toggle"
				aria-controls="secondary-menus-combo-nav"
				:aria-expanded="open ? 'true' : 'false'"
			>
				<span>{{ getSelectedTabName() }}</span>
				<kv-icon name="small-chevron-mobile" class="chevron" :from-sprite="true" />
			</button>
			<kv-expandable easing="ease-in-out">
				<div
					id="secondary-menu-combo-nav"
					v-show="open"
					class="kv-expandable-pane sec-ter-combo-nav"
					:aria-hidden="open ? 'false' : 'true'"
				>
					<ul>
						<li v-for="{name, routerLink, url} in menuItems" :key="name">
							<router-link
								:to="routerLink"
								v-if="routerLink"
							>
								{{ name }}
							</router-link>
							<a v-else :href="url">{{ name }}</a>
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
} from '#src/util/touchEvents';
import usingTouchClient from '#src/graphql/query/shared/usingTouchClient.graphql';
import KvIcon from '#src/components/Kv/KvIcon';
import SecondaryMenu from '#src/components/WwwFrame/SecondaryMenu';
import KvExpandable from '#src/components/Kv/KvExpandable';

export default {
	name: 'CustomSecondaryMenu',
	components: {
		KvIcon,
		SecondaryMenu,
		KvExpandable,
	},
	inject: ['apollo', 'cookieStore'],
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
@use '#src/assets/scss/settings' as *;

.mobile-nav {
	background-color: $kiva-bg-lightgray;
	margin: 0;

	.sec-ter-combo-nav {
		position: absolute;
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

			a.router-link-exact-active {
				@extend .basic-secondary-menu-active-mobile;

				color: $kiva-text-light;
			}
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

		span {
			display: inline-block;
			line-height: 1rem;
			padding-top: 1rem;
		}

		&:hover {
			span {
				text-decoration: underline;
			}
		}

		.chevron {
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

	button[aria-expanded=true] {
		.chevron {
			transform: rotate(-180deg);
		}
	}
}

.basic-secondary-menu-active-mobile {
	padding: rem-calc(20) 1rem;
	font-weight: normal;
	line-height: 1rem;
	display: inline-block;
}
</style>
