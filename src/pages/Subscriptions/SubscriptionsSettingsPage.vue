<template>
	<div>
		<div class="row subscription-settings-area">
			<div class="column large-8 settings-card">
				Subscription Settings
			</div>
		</div>
		<!-- <div class="row column save-button-area">
			<save-button v-if="isChanged" />
		</div> -->
	</div>
</template>

<script>
export default {
	components: {
	},
	data() {
		return {
			isChanged: false,
		};
	},
	mounted() {
		window.addEventListener('beforeunload', this.onLeave);
	},
	beforeDestroy() {
		window.removeEventListener('beforeunload', this.onLeave);
	},
	methods: {
		onLeave(event) {
			if (this.isChanged) {
				// eslint-disable-next-line no-param-reassign
				event.returnValue = 'You have unsaved settings! Are you sure you want to leave?';
			}
		},
	},
};
</script>

// !TODO clean up CSS
<style lang="scss">
@import 'settings';

.subscriptions {
	.button {
		.loading-spinner {
			vertical-align: middle;
			width: 1rem;
			height: 1rem;

			& >>> .line {
				background-color: $white;
			}
		}
	}
}
</style>

<style lang="scss" scoped>
@import 'settings';

::v-deep .obscure {
	opacity: 0.4;
	pointer-events: none;
}

[class*="-area"] {
	margin-bottom: 1.5rem;
}

.save-button-area {
	margin-bottom: 5rem;
}

::v-deep .settings-card {
	background: $white;
	padding: 1.95rem;
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto 1fr;
	gap: 1rem 1rem;
	grid-template-areas: "icon-wrapper title-wrapper" "icon-wrapper content-wrapper";
}

::v-deep .icon-wrapper {
	grid-area: icon-wrapper;

	.icon {
		margin-top: 1px;
		height: 1.75rem;
		width: 1.75rem;
	}
}

::v-deep .title-wrapper {
	grid-area: title-wrapper;

	h3 {
		font-weight: $global-weight-bold;
	}
}

::v-deep .content-wrapper { grid-area: content-wrapper; }
</style>
