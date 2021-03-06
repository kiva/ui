<template>
	<div>
		<secondary-menu class="show-for-large">
			<ul class="row">
				<li>
					<router-link
						to="/portfolio"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Portfolio']"
					>
						Portfolio
					</router-link>
				</li>
				<li>
					<router-link
						to="/teams/my-teams"
						v-kv-track-event="['SecondaryNav','click-MyKiva-My-teams']"
					>
						My teams
					</router-link>
				</li>
				<li>
					<router-link
						to="/account/messages"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Messages']"
					>
						Messages
					</router-link>
				</li>
				<li>
					<router-link
						id="settings-link"
						to="/settings"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Settings']"
					>
						Settings
					</router-link>
					<kv-dropdown
						controller="settings-link"
					>
						<the-settings-tertiary-menu
							class="tertiary-menu"
						/>
					</kv-dropdown>
				</li>
				<li v-if="isBorrower">
					<router-link
						to="/my/borrower"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Borrower-dashboard']"
					>
						Borrower Dashboard
					</router-link>
				</li>
				<li v-if="isTrustee">
					<router-link
						to="/my/trustee"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Trustee-dashboard']"
					>
						Trustee Dashboard
					</router-link>
				</li>
			</ul>
		</secondary-menu>
		<div class="mobile-nav hide-for-large">
			<button
				@click="toggle"
				aria-controls="tertiary-combo-nav"
				:aria-expanded="open ? 'true' : 'false'"
			>
				<span class="mobile-nav-title">{{ myKivaCategory }}</span>
				<kv-icon name="small-chevron-mobile" class="chevron-icon" :from-sprite="true" />
			</button>
			<kv-expandable easing="ease-in-out">
				<div
					id="tertiary-combo-nav"
					v-show="open"
					class="kv-expandable-pane sec-ter-combo-nav"
					:aria-hidden="open ? 'false' : 'true'"
				>
					<template v-if="myKivaCategory === 'portfolio'">
						<the-portfolio-tertiary-menu />
					</template>
					<template v-else-if="myKivaCategory === 'settings'">
						<the-settings-tertiary-menu />
					</template>
					<ul>
						<li>
							<router-link
								to="/portfolio"
								v-kv-track-event="['SecondaryNav','click-MyKiva-Portfolio']"
							>
								Portfolio
							</router-link>
						</li>
						<li>
							<router-link
								to="/teams/my-teams"
								v-kv-track-event="['SecondaryNav','click-MyKiva-My-teams']"
							>
								My teams
							</router-link>
						</li>
						<li>
							<router-link
								to="/account/messages"
								v-kv-track-event="['SecondaryNav','click-MyKiva-Messages']"
							>
								Messages
							</router-link>
						</li>
						<li>
							<router-link
								to="/settings"
								v-kv-track-event="['SecondaryNav','click-MyKiva-Settings']"
							>
								Settings
							</router-link>
						</li>
						<li v-if="isBorrower">
							<router-link
								to="/my/borrower"
								v-kv-track-event="['SecondaryNav','click-MyKiva-Borrower-dashboard']"
							>
								Borrower Dashboard
							</router-link>
						</li>
						<li v-if="isTrustee">
							<router-link
								to="/my/trustee"
								v-kv-track-event="['SecondaryNav','click-MyKiva-Trustee-dashboard']"
							>
								Trustee Dashboard
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
import myKivaMenuQuery from '@/graphql/query/myKivaSecondaryMenu.graphql';
import KvDropdown from '@/components/Kv/KvDropdown';
import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';
import SecondaryMenu from '@/components/WwwFrame/SecondaryMenu';
import ThePortfolioTertiaryMenu from '@/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import TheSettingsTertiaryMenu from '@/components/WwwFrame/Menus/TheSettingsTertiaryMenu';

export default {
	components: {
		KvDropdown,
		KvExpandable,
		KvIcon,
		SecondaryMenu,
		ThePortfolioTertiaryMenu,
		TheSettingsTertiaryMenu
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			open: false,
			isBorrower: false,
			isTrustee: false,
			usingTouch: false,
		};
	},
	apollo: {
		query: myKivaMenuQuery,
		preFetch: true,
		result({ data }) {
			this.isBorrower = _get(data, 'my.isBorrower');
			this.isTrustee = !!_get(data, 'my.trustee.id');
			this.usingTouch = _get(data, 'usingTouch');
		},
	},
	computed: {
		myKivaCategory() {
			return this.$route.path.split('/')[1];
		}
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

	.mobile-nav-title {
		text-transform: capitalize;
	}

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
			a.router-link-active {
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

		.chevron-icon {
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
		.chevron-icon {
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
				a.router-link-active {
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
