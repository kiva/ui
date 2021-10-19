<template>
	<div class="kv-cause-selector">
		<template v-if="asIcon">
			<div class="kv-cause-selector__circle tw-bg-primary">
				<img
					class="kv-cause-selector__img"
					:srcset="`${causeImage2xSrc} 2x`"
					:src="causeImageSrc"
					loading="lazy"
					width="120"
					height="120"
					alt=""
				>
			</div>
		</template>
		<template v-else>
			<input
				class="kv-cause-selector__checkbox"
				:type="asRadio ? 'radio' : 'checkbox'"
				:name="asRadio ? 'kv-cause-selector' : cause"
				:value="asRadio ? cause : checked"
				:checked="checked"
				:disabled="disabled"
				:id="`cause-selector-${cause}-${asRadio ? 'radio' : 'checkbox'}`"
				@change="onChange($event)"
			>
			<label
				class="kv-cause-selector__label hover:tw-text-action-highlight tw-text-center"
				:for="`cause-selector-${cause}-${asRadio ? 'radio' : 'checkbox'}`"
			>
				<div class="kv-cause-selector__circle">
					<div class="kv-cause-selector__check-icon-wrapper">
						<kv-icon
							class="kv-cause-selector__check-icon"
							name="checkmark"
						/>
					</div>
					<img
						class="kv-cause-selector__img"
						:srcset="`${causeImage2xSrc} 2x`"
						:src="causeImageSrc"
						loading="lazy"
						width="120"
						height="120"
						alt=""
					>
				</div>
				<div class="kv-cause-selector__text">{{ cause }}</div>
			</label>
		</template>
	</div>
</template>

<script>
import { paramCase } from 'change-case';
import KvIcon from '@/components/Kv/KvIcon';

const imageRequire = require.context('@/assets/images/cause-selector/', true);

export default {
	components: {
		KvIcon
	},
	props: {
		/**
		 * The cause to display
		 * 	`women,
			shelter,
			education,
			technology,
			agriculture,
			COVID-19,
			health,
			refugees,
			arts`
		* */
		cause: {
			type: String,
			required: true
		},
		/**
		 * The checked state
		* */
		checked: {
			type: Boolean,
			default: null,
		},
		/**
		 * Disable the input
		* */
		disabled: {
			type: Boolean,
			default: false,
		},
		/**
		 * Only allows 1 cause to be checked at a time.
		* */
		asRadio: {
			type: Boolean,
			default: false,
		},
		/**
		 * No interactions, renders as a div instead of input
		* */
		asIcon: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		causeImageSrc() {
			return imageRequire(`./${paramCase(this.cause)}.png`);
		},
		causeImage2xSrc() {
			return imageRequire(`./${paramCase(this.cause)}_2x.png`);
		},
	},
	methods: {
		onChange(event) {
			/**
			 * If radio, the cause name. If checkbox, whether it's checked or not.
			 * @event change
			 * @type {Event}
			 */
			const { checked, value } = event.target;
			this.$emit('change', this.asRadio ? value : checked);
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$box-shadow: 0 rem-calc(2) rem-calc(30) 0 rgba(0, 0, 0, 0.15);
$box-shadow-hover: 0 rem-calc(2) rem-calc(10) 0 rgba(0, 0, 0, 0.35);

.kv-cause-selector {
	width: rem-calc(120);

	&__circle {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 50%;
		box-shadow: $box-shadow;
		margin-bottom: 1rem;
		user-select: none;
	}

	&__img {
		width: 100%;
		height: 100%;
	}

	&__check-icon-wrapper {
		display: flex;
		width: rem-calc(45);
		height: rem-calc(45);
		padding: 0.2rem;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: rem-calc(3) solid #fff;
		opacity: 0;
		z-index: 2;
		position: absolute;
	}

	&__check-icon {
		width: rem-calc(20);
		height: rem-calc(15);
		fill: #fff;
	}

	&__text {
		font-size: 1rem;
		font-weight: normal;
		text-align: center;
		text-transform: capitalize;
	}

	&__label {
		width: 100%;
		margin: 0;

		&:hover {
			color: $kiva-textlink-hover;

			.kv-cause-selector__circle {
				// background: $kiva-bg-lightgray;
				box-shadow: $box-shadow-hover;
			}
		}
	}

	&__checkbox {
		@include visually-hidden();

		&:focus + .kv-cause-selector__label {
			outline: 0;

			.kv-cause-selector__circle {
				box-shadow: $box-shadow, 0 0 0 rem-calc(2) $kiva-accent-darkblue;
			}

			.kv-cause-selector__text {
				font-weight: $global-weight-bold;
			}
		}

		&:checked + .kv-cause-selector__label {
			.kv-cause-selector__img {
				opacity: 0;
			}

			.kv-cause-selector__check-icon-wrapper {
				opacity: 1;
			}

			.kv-cause-selector__text {
				font-weight: $global-weight-bold;
				color: $kiva-textlink-hover;
			}

			.kv-cause-selector__circle {
				background: $kiva-accent-blue;
			}
		}

		&[disabled] + .kv-cause-selector__label {
			@include disabled();

			&:hover {
				.kv-cause-selector__circle {
					background: #fff;
				}
			}
		}
	}
}
</style>
