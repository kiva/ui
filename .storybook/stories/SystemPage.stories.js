import SystemPage from '#src/components/SystemFrame/SystemPage';

export default {
	title: 'SystemFrame/SystemPage',
	component: SystemPage,
};

export const Default = () => ({
	components: {
		SystemPage,
	},
	template: `
		<system-page>
			<h1>Lorem ipsum</h1>
			<p>Aliquam metus turpis, pharetra vel diam imperdiet, tristique eleifend ante. Fusce gravida arcu arcu, ut elementum diam facilisis quis.</p>
		</system-page>
	`,
});
