import ChallengeCallout from '@/components/Lend/LoanSearch/ChallengeCallout';
import apolloStoryMixin from "../mixins/apollo-story-mixin";

export default {
  title: 'Components/ChallengeCallout',
  component: ChallengeCallout,
};

const story = (args = {}) => {
  const template = (_args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChallengeCallout },
    mixins: [apolloStoryMixin()],
    template: '<challenge-callout :lender="lender" :team-name="teamName" />',
  });
  template.args = args;
  return template;
};

const publicLendProfile = {
  community: {
    lender: {
      id: 2383848,
      name: 'Mary',
      image: {
        url: 'https://www-0.development.kiva.org/img/s100/4da4a17c4b35913d22114bf29bb1911b.jpg',
        width: 3264,
        height: 2448,
      },
      publicId: 'mary19806605',
    },
  },
};


export const Default = story({});
export const Lender = story({ lender: publicLendProfile.community.lender });
export const Team = story({ lender: publicLendProfile.community.lender, teamName: 'A+' });
