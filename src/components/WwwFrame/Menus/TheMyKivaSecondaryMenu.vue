<template>
	<div class="tw-bg-action-highlight tw-font-medium">
		<kv-page-container class="tw-hidden md:tw-block">
			<ul>
				<li class="tw-inline-block">
					<router-link
						to="/portfolio"
						active-class="tw-underline"
						class="desktop-link"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Portfolio']"
					>
						Portfolio
					</router-link>
				</li>
				<li class="tw-inline-block">
					<router-link
						to="/teams/my-teams"
						active-class="tw-underline"
						class="desktop-link"
						v-kv-track-event="['SecondaryNav','click-MyKiva-My-teams']"
					>
						My teams
					</router-link>
				</li>
				<li class="tw-inline-block">
					<router-link
						to="/account/messages"
						active-class="tw-underline"
						class="desktop-link"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Messages']"
					>
						Messages
					</router-link>
				</li>
				<li class="tw-inline-block">
					<router-link
						id="settings-link"
						to="/settings"
						active-class="tw-underline"
						class="desktop-link"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Settings']"
					>
						Settings
					</router-link>
					<kv-dropdown
						controller="settings-link"
					>
						<the-settings-tertiary-menu />
					</kv-dropdown>
				</li>
				<li class="tw-inline-block" v-if="isBorrower">
					<router-link
						to="/my/borrower"
						active-class="tw-underline"
						class="desktop-link"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Borrower-dashboard']"
					>
						Borrower Dashboard
					</router-link>
				</li>
				<li class="tw-inline-block" v-if="isTrustee">
					<router-link
						to="/my/trustee"
						active-class="tw-underline"
						class="desktop-link"
						v-kv-track-event="['SecondaryNav','click-MyKiva-Trustee-dashboard']"
					>
						Trustee Dashboard
					</router-link>
				</li>
			</ul>
		</kv-page-container>
		<div class="md:tw-hidden">
			<button
				@click="toggle"
				aria-controls="tertiary-combo-nav"
				:aria-expanded="open ? 'true' : 'false'"
				class="
					tw-bg-action-highlight
					tw-w-full tw-h-8 tw-px-2
					tw-text-primary-inverse hover:tw-underline
					tw-flex tw-items-center tw-justify-between
				"
			>
				<span class="tw-capitalize">{{ myKivaCategory }}</span>
				<kv-material-icon
					class="tw-h-4 tw-w-4 tw-transition tw-transform tw-duration-500 tw-ease"
					:class="{ 'tw-rotate-180' : open }"
					:icon="mdiChevronDown"
				/>
			</button>
			<kv-expandable easing="ease-in-out">
				<div
					id="tertiary-combo-nav"
					v-show="open"
					class="kv-expandable-pane sec-ter-combo-nav"
					:aria-hidden="open ? 'false' : 'true'"
				>
					<template v-if="myKivaCategory === 'portfolio'">
						<the-portfolio-tertiary-menu class="tw-bg-tertiary tw-py-1 tw-pl-4" />
					</template>
					<template v-else-if="myKivaCategory === 'settings'">
						<the-settings-tertiary-menu class="tw-bg-tertiary tw-py-1 tw-pl-2" />
					</template>
					<ul class="tw-bg-secondary">
						<li>
							<router-link
								to="/portfolio"
								class="mobile-link"
								v-kv-track-event="['SecondaryNav','click-MyKiva-Portfolio']"
							>
								Portfolio
							</router-link>
						</li>
						<li>
							<router-link
								to="/teams/my-teams"
								class="mobile-link"
								v-kv-track-event="['SecondaryNav','click-MyKiva-My-teams']"
							>
								My teams
							</router-link>
						</li>
						<li>
							<router-link
								to="/account/messages"
								class="mobile-link"
								v-kv-track-event="['SecondaryNav','click-MyKiva-Messages']"
							>
								Messages
							</router-link>
						</li>
						<li>
							<router-link
								to="/settings"
								class="mobile-link"
								v-kv-track-event="['SecondaryNav','click-MyKiva-Settings']"
							>
								Settings
							</router-link>
						</li>
						<li v-if="isBorrower">
							<router-link
								to="/my/borrower"
								class="mobile-link"
								v-kv-track-event="['SecondaryNav','click-MyKiva-Borrower-dashboard']"
							>
								Borrower Dashboard
							</router-link>
						</li>
						<li v-if="isTrustee">
							<router-link
								to="/my/trustee"
								class="mobile-link"
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
import { gql } from '@apollo/client';
import { mdiChevronDown } from '@mdi/js';
import {
	onBodyTouchstart,
	offBodyTouchstart,
	isTargetElement,
} from '@/util/touchEvents';
import KvDropdown from '@/components/Kv/KvDropdown';
import KvExpandable from '@/components/Kv/KvExpandable';
import ThePortfolioTertiaryMenu from '@/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import TheSettingsTertiaryMenu from '@/components/WwwFrame/Menus/TheSettingsTertiaryMenu';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'TheMyKivaSecondaryMenu',
	components: {
		KvDropdown,
		KvExpandable,
		KvMaterialIcon,
		KvPageContainer,
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
			mdiChevronDown,
		};
	},
	apollo: {
		query: gql`query myKivaSecondaryMenu {
			my {
				isBorrower
				trustee {
					id
				}
			}
			usingTouch @client
		}`,
		preFetch: true,
		result({ data }) {
			this.isBorrower = data?.my?.isBorrower ?? false;
			this.isTrustee = !!data?.my?.trustee?.id;
			this.usingTouch = data?.usingTouch ?? false;
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

<style lang="postcss" scoped>
.desktop-link {
	@apply tw-block tw-pr-4 tw-py-2 tw-text-primary-inverse hover:tw-underline hover:tw-text-primary-inverse;
}

.mobile-link {
	@apply tw-block tw-px-2 tw-py-1 tw-w-full tw-border-b tw-border-tertiary;
}
</style>
