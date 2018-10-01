<template>
	<div>
		<secondary-menu class="show-for-large">
			<ul class="row">
				<li v-for="{name, url, eventTracking} in menuItems" :key="name">
					<router-link
						:to="url"
						v-kv-track-event="eventTracking"
					>
						{{ name }}
					</router-link>
				</li>
			</ul>
		</secondary-menu>
		<div class="mobile-nav hide-for-large">
			<button
				@click="toggle"
				aria-controls="portfolio-combo-nav"
				:aria-expanded="open ? 'true' : 'false'"
			>
				<span>Portfolio</span>
				<kv-icon name="small-chevron-mobile" />
			</button>
			<kv-expandable easing="ease-in-out">
				<div
					id="portfolio-combo-nav"
					v-show="open"
					class="kv-expandable-pane sec-ter-combo-nav"
					:aria-hidden="open ? 'false' : 'true'"
				>
					<ul>
						<li v-for="menuItem in menuItems" :key="menuItem.name">
							<router-link
								:to="menuItem.url"
								v-if="menuItem.eventTracking"
								v-kv-track-event="menuItem.eventTracking"
							>
								{{ menuItem.name }}
							</router-link>
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
import customSecondaryMenuQuery from '@/graphql/query/customSecondaryMenuQuery.graphql';
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
		}
	},
	apollo: {
		query: customSecondaryMenuQuery,
		preFetch: true,
		result({ data }) {
			this.usingTouch = _get(data, 'usingTouch');
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
			a:visited,
			a.router-link-exact-active {
				padding: 0 1rem;
				font-weight: normal;
				line-height: rem-calc(45);
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

	.tertiary-nav {
		padding: 0;

		ul {
			background-color: $kiva-bg-darkgray;

			li {
				margin: 0;
				border: none;

				a,
				a:active,
				a:visited,
				a:hover,
				a.router-link-exact-active {
					padding: 0 1rem 0 1.75rem;
				}

				a.router-link-exact-active {
					color: $kiva-text-light;
				}
			}
		}
	}
}
</style>
