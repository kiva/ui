import { addDecorator, addParameters } from '@storybook/vue';

//load all the svg icon sprites
import '@/assets/iconLoader';

// same styles that are in App.vue
import '../src/assets/scss/app.scss';

addParameters({
	options: {
		storySort: (a, b) => { // sort the categories alphabetically.
			return a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true });
		},
		showRoots: true,
	},
});

const GlobalDecorator = () => ({
	template: `
		<div style="padding: 2rem">
			<story />
		</div>
	  `
});
addDecorator(GlobalDecorator);

