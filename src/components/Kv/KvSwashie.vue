<template>
	<div
		class="kv-swashie"
		:class="`kv-swashie--${this.excitementLevel}`"
	>
		<div class="kv-swashie__wrapper">
			<div class="kv-swashie__circle">
				<svg viewBox="0 0 205 205" fill="none" xmlns="http://www.w3.org/2000/svg">
					<template v-if="excitementLevel === 'sleepy'">
						<path d="M156.24 143.365C156.24 148.076 152.42 151.896 147.71 151.896C142.999 151.896 139.179 148.076 139.179 143.365" stroke="#3E4653" stroke-width="5.02235" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M65.0617 143.366C65.0617 148.076 61.2415 151.897 56.5308 151.897C51.8202 151.897 48 148.076 48 143.366" stroke="#3E4653" stroke-width="5.02235" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M102.12 162.715C106.092 162.715 109.312 159.495 109.312 155.523C109.312 151.551 106.092 148.331 102.12 148.331C98.148 148.331 94.928 151.551 94.928 155.523C94.928 159.495 98.148 162.715 102.12 162.715Z" fill="#3E4653" />
					</template>

					<template v-if="excitementLevel === 'content'">
						<path d="M145.86 131.113C150.342 131.113 153.976 127.48 153.976 122.997C153.976 118.515 150.342 114.882 145.86 114.882C141.377 114.882 137.744 118.515 137.744 122.997C137.744 127.48 141.377 131.113 145.86 131.113Z" fill="#3E4653" />
						<path d="M59.1159 131.114C63.5982 131.114 67.2318 127.48 67.2318 122.998C67.2318 118.515 63.5982 114.882 59.1159 114.882C54.6336 114.882 51 118.515 51 122.998C51 127.48 54.6336 131.114 59.1159 131.114Z" fill="#3E4653" />
						<path d="M120.922 124.531C120.922 134.711 112.668 142.965 102.488 142.965C92.3076 142.965 84.0533 134.711 84.0533 124.531" stroke="#3E4653" stroke-width="3.76773" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
					</template>

					<template v-if="excitementLevel === 'elated'">
						<path d="M144.749 76.8705C149.131 76.8705 152.684 73.3178 152.684 68.9352C152.684 64.5527 149.131 61 144.749 61C140.366 61 136.814 64.5527 136.814 68.9352C136.814 73.3178 140.366 76.8705 144.749 76.8705Z" fill="#3E4653" />
						<path d="M59.9352 76.8707C64.3178 76.8707 67.8705 73.318 67.8705 68.9355C67.8705 64.553 64.3178 61.0002 59.9352 61.0002C55.5527 61.0002 52 64.553 52 68.9355C52 73.318 55.5527 76.8707 59.9352 76.8707Z" fill="#3E4653" />
						<mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="84" y="70" width="37" height="19">
							<path d="M84.3181 70.4343C84.3181 80.3879 92.3886 88.4584 102.342 88.4584C112.296 88.4584 120.366 80.3879 120.366 70.4343H84.3181Z" fill="#3E4D61" />
						</mask>
						<g mask="url(#mask0)">
							<path d="M84.3181 70.4343C84.3181 80.3879 92.3886 88.4584 102.342 88.4584C112.296 88.4584 120.366 80.3879 120.366 70.4343H84.3181Z" fill="#3E4653" />
							<path d="M120.367 97.4705C120.367 87.5169 112.296 79.4463 102.342 79.4463C92.3888 79.4463 84.3183 87.5169 84.3183 97.4705H120.367V97.4705Z" fill="#DF5D4F" />
						</g>
					</template>
				</svg>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	props: {
		percentLoaded: {
			type: Number,
			default: 0,
			validator(val) {
				return val >= 0 && val <= 100;
			}
		},
	},
	data() {
		return {
		};
	},
	computed: {
		excitementLevel() {
			if (this.percentLoaded >= 0 && this.percentLoaded < 50) {
				return 'sleepy';
			}
			if (this.percentLoaded >= 50 && this.percentLoaded < 80) {
				return 'content';
			}
			return 'elated';
		}
	},
	mounted() {
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-swashie {
	&__wrapper {
		width: 100%;
	}

	&__circle {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 50%;
		background: #fff;
		line-height: 1;
	}

	&--sleepy {
		.kv-swashie__circle {
			background: grey;
		}
	}

	&--content {
		.kv-swashie__circle {
			background: orange;
		}
	}

	&--elated {
		.kv-swashie__circle {
			background: green;
		}
	}
}
</style>
