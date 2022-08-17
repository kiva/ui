import LoanSearchGenderFilter from '@/components/Lend/LoanSearch/LoanSearchGenderFilter';

export default {
	title: 'Loan Search/Loan Search Gender Filter',
	component: LoanSearchGenderFilter,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchGenderFilter },
		template: '<loan-search-gender-filter :gender="gender" />',
	})
	template.args = args;
	return template;
};

export const Default = story();

export const Female = story({ gender: 'female' });

export const Male = story({ gender: 'male' });

export const Nonbinary = story({ gender: 'nonbinary' });
