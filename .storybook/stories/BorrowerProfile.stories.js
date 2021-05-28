import BorrowerProfile from '@/pages/BorrowerProfile/BorrowerProfile';

export default {
	title: '/Pages/Borrower Profile',
	component: { BorrowerProfile }
};

export const Default = () => ({
	components: {
		BorrowerProfile
	},
	template: '<div>Borrower profile frame</div>'
});
