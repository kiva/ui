import ChallengeHeader from '@/components/Lend/LoanSearch/ChallengeHeader';

export default {
	title: 'Loan Search/Challenge Header',
	component: ChallengeHeader,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ChallengeHeader },
		template: 	`<div style="max-width: 1200px;">
						<challenge-header :challengeData="challengeData" :teamData="teamData" />
					</div>`,
	
	});
	template.args = args;
	return template;
};

const teamData = {
    name: "LOTUS: Lend Out To Uplift Self-sufficiency",
    image: {
        url: "https://www-0.development.kiva.org/img/s100/6c2c7e2306275173dff001306158bf4d.jpg"
    },
};

const challengeData = {
    name: "New Year’s Challenge",
    description: "Let's get 2024 off to a great start with a team challenge! If we can fully fund all of these loans as a team by Feb 16, 2024 we'll unlock the surprise reward!",
    descriptionAuthor: {
        name: "Ronan",
        image: {
            url: "https://www-0.development.kiva.org/img/s100/ed413098ef247db85e2c7ae4b2fd9552.jpg",
        }
    },
    participation: {
        totalCount: 2,
        values: [
            {
                amountLent: 100,
                lender: {
                    id: 1234,
                    name: "Roger",
                    image: {
                        url: "https://www-0.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg",
                    }
                }
            },
            {
                amountLent: 50,
                lender: {
                    id: 12351,
                    name: "Casey",
                    image: {
                        url: "https://www-0.development.kiva.org/img/s100/251d0b45d19ba768b8180ab281aa5224.jpg",
                    }
                }
            }
        ]
    },
    startDate: "2024-01-22T17:00:00.000Z",
    endDate: "2024-04-15T07:59:00.000Z",
}

export const Default = story({ challengeData, teamData });

