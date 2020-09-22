<template>
	<div class="profile">
		<h3>
			{{ person.name }}
		</h3>
		<h4>{{ person.title }}</h4>
		{{ person.img }}
		<div v-html="person.body"></div>

		<fifteen-years-button
			:to="person.link"
		>
			{{ person.cta }}
		</fifteen-years-button>

		<div v-if="person.videoId && expanded" class="profile__video">
			<div style="padding: 56.25% 0 0 0; position: relative;">
				<iframe
					:src="`https://player.vimeo.com/video/${person.videoId}?title=0&byline=0&portrait=0`"
					style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
					frameborder="0"
					allow="autoplay; fullscreen"
					allowfullscreen
				></iframe>
			</div>
		</div>
	</div>
</template>

<script>
import FifteenYearsButton from './15YearsButton';

export default {
	components: {
		FifteenYearsButton,

	},
	props: {
		person: {
			type: Object,
			default() { return {}; }
		},
		expanded: {
			type: Boolean,
			default: false
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

</style>
