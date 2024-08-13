<template>
	<div>
		<svg
			class="svg first-svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M15.6562 9.56756C10.5937 9.56756 9.32812 5.18919 9.32812 3C9.32812 5.18919 8.0625 9.56756 3 9.56756C8.0625 9.56756 9.32812 14.1892 9.32812 16.5C9.32812 14.1892 10.5937 9.56756 15.6562 9.56756Z"
				fill="#F4B539"
				stroke="#F4B539"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M18.75 16.5V21"
				stroke="#F4B539"
				stroke-width="1.5"
				stroke-linecap="round"
			/>
			<path
				d="M21 18.75L16.5 18.75"
				stroke="#F4B539"
				stroke-width="1.5"
				stroke-linecap="round"
			/>
			<circle cx="19.875" cy="4.125" r="1.125" fill="#F4B539" />
		</svg>

		<svg
			class="svg second-svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M15.6562 11.8176C10.5937 11.8176 9.32812 7.43919 9.32812 5.25C9.32812 7.43919 8.0625 11.8176 3 11.8176C8.0625 11.8176 9.32812 16.4392 9.32812 18.75C9.32812 16.4392 10.5937 11.8176 15.6562 11.8176Z"
				fill="#F4B539"
				stroke="#F4B539"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<circle cx="19.875" cy="6.375" r="1.125" fill="#F4B539" />
		</svg>
	</div>
</template>

<style lang="postcss" scoped>

.svg {
	animation: fadeTransition 2s infinite alternate;
	@apply tw-absolute tw-w-3 tw-h-3 tw-opacity-0;
}

.first-svg {
	animation-delay: 0s;
	@apply tw-top-0 tw-right-0;
}

.second-svg {
  animation-delay: 0.5s;
	@apply tw-bottom-0 tw-left-0;
}

@keyframes fadeTransition {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
