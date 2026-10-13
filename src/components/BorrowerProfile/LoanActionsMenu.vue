<template>
	<div
		class="tw-relative"
		@keydown.esc.prevent="close({ focusTrigger: true })"
	>
		<kv-icon-button
			ref="trigger"
			:icon="mdiDotsVertical"
			size="medium"
			aria-label="More loan options"
			aria-haspopup="menu"
			:aria-expanded="isOpen ? 'true' : 'false'"
			:aria-controls="menuId"
			data-testid="bp-loan-actions-menu-button"
			@click="toggle"
			@keydown.down.prevent="openAndFocus(0)"
			@keydown.up.prevent="openAndFocus(-1)"
		/>
		<div
			v-show="isOpen"
			:id="menuId"
			ref="menu"
			role="menu"
			aria-label="Loan options"
			data-testid="bp-loan-actions-menu"
			class="
				tw-absolute tw-right-0 tw-top-full tw-mt-0.5 tw-z-dropdown
				tw-flex tw-flex-col tw-gap-1 tw-py-1 tw-px-2 tw-whitespace-nowrap
				tw-bg-primary tw-rounded-sm tw-shadow-lg
			"
			@keydown.down.prevent="moveFocus(1)"
			@keydown.up.prevent="moveFocus(-1)"
			@keydown.home.prevent="focusItem(0)"
			@keydown.end.prevent="focusItem(-1)"
			@keydown.tab="close()"
		>
			<button
				v-for="item in items"
				:key="item.event"
				type="button"
				role="menuitem"
				tabindex="-1"
				:data-testid="`bp-loan-actions-menu-${item.event}`"
				class="
					tw-flex tw-items-center tw-gap-1 tw-w-full tw-min-h-4 tw-px-1 tw-py-0.5 tw-rounded-sm
					tw-text-label tw-text-primary hover:tw-bg-secondary focus:tw-bg-secondary
				"
				@click="select(item.event)"
			>
				<kv-material-icon class="tw-w-2 tw-h-2 tw-shrink-0" :icon="item.icon" />
				{{ item.label }}
			</button>
		</div>
	</div>
</template>

<script>
import { mdiDotsVertical, mdiExportVariant, mdiFormatListBulleted } from '@mdi/js';
import { KvIconButton, KvMaterialIcon } from '@kiva/kv-components';

/**
 * Kebab ("more options") menu for the borrower profile top card on small screens (new user version).
 * Holds "Loan details" and "Share"; presentational, the parent decides what each action does.
 *
 * Keyboard: Enter/Space toggle (native button), ArrowDown/ArrowUp open and focus the first/last item,
 * arrows wrap inside the menu, Home/End jump, Escape closes and refocuses the trigger, Tab closes
 * without trapping focus. A click outside closes.
 */
export default {
	name: 'LoanActionsMenu',
	components: {
		KvIconButton,
		KvMaterialIcon,
	},
	props: {
		menuId: {
			type: String,
			default: 'bp-loan-actions-menu',
		},
	},
	emits: ['loan-details', 'share'],
	data() {
		return {
			isOpen: false,
			mdiDotsVertical,
			items: [
				{ event: 'loan-details', label: 'Loan details', icon: mdiFormatListBulleted },
				{ event: 'share', label: 'Share', icon: mdiExportVariant },
			],
		};
	},
	methods: {
		toggle() {
			if (this.isOpen) {
				this.close();
			} else {
				this.open();
			}
		},
		open() {
			this.isOpen = true;
		},
		close({ focusTrigger = false } = {}) {
			this.isOpen = false;
			if (focusTrigger) {
				this.$refs.trigger?.$el?.focus();
			}
		},
		async openAndFocus(index) {
			this.open();
			await this.$nextTick();
			this.focusItem(index);
		},
		menuItems() {
			return Array.from(this.$refs.menu?.querySelectorAll('[role="menuitem"]') ?? []);
		},
		// Negative or overflowing indexes wrap, so -1 is the last item
		focusItem(index) {
			const menuItems = this.menuItems();
			if (!menuItems.length) return;
			const wrapped = ((index % menuItems.length) + menuItems.length) % menuItems.length;
			menuItems[wrapped].focus();
		},
		moveFocus(step) {
			const current = this.menuItems().indexOf(document.activeElement);
			this.focusItem(current + step);
		},
		select(event) {
			this.$emit(event);
			this.close({ focusTrigger: true });
		},
		onDocumentClick(event) {
			if (this.isOpen && !this.$el.contains(event.target)) {
				this.close();
			}
		},
	},
	mounted() {
		document.addEventListener('click', this.onDocumentClick);
	},
	beforeUnmount() {
		document.removeEventListener('click', this.onDocumentClick);
	},
};
</script>
