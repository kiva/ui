import KvTooltip from '@/components/Kv/KvTooltip';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	title: 'Kv/KvTooltip',
	component: KvTooltip,
};

export const Default = () => ({
	components: {
		KvTooltip,
	},
	template: `
		<div>
			<button id="my-cool-btn">Hover of Focus Me!</button>
			<kv-tooltip controller="my-cool-btn">
				<template #title>
					What is an Experimental Field Partner?
				</template>
				If a Field Partner is labeled as Experimental, this means that Kiva has
				required only a comparatively light level of due diligence and
				monitoring, in exchange for only allowing this Field Partner access to a
				small amount of funding through Kiva at any given time.
			</kv-tooltip>
		</div>
	`
});

export const QuestionMarkIcon = () => ({
	components: {
		KvTooltip,
		KvIcon,
	},
	template: `
		<div>
			<kv-icon
				name="question"
				id="question"
				style="fill: #d8d8d8; width: 1rem;"
			/>
			<kv-tooltip controller="question">
				Staying signed in enables personalized browsing and seamless lending. You may be asked again
				for your password to view account information or make withdrawals, but uncheck this option
				if you’re using a public device.
			</kv-tooltip>
		</div>
	`
});




