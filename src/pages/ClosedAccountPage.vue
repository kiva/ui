<template>
	<system-page>
		<h1 class="tw-text-h2 tw-mb-2">
			Your Kiva account has been closed.
		</h1>
		<p>
			Thanks for your support!<br>
			If you have any questions, email us at
			<a href="mailto:contactus@kiva.org">contactus@kiva.org</a>
		</p>
	</system-page>
</template>

<script>
import SystemPage from '#src/components/SystemFrame/SystemPage';

export default {
	name: 'ClosedAccountPage',
	components: {
		SystemPage,
	},
	head: {
		title: 'Closed Account',
	},
};
</script>
